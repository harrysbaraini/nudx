import { Command, Flags } from '@oclif/core';
import { CommandError } from '@oclif/core/lib/interfaces';
import * as Listr from 'listr';
import { join } from 'path';
import { fileExists, readJsonFile, writeFile, writeJsonFile } from '../lib/filesystem';
import { CLICONF_CADDY_CONFIG, CLICONF_CADDY_PATH, CLICONF_SERVER, CLICONF_SERVER_STATE } from '../lib/flags';
import { ProcessComposeProcessFile, buildFlakeFile, generateCaddyConfig, isServerRunning } from '../lib/server';
import { loadSettings, loadSiteConfigCollection } from '../lib/sites';
import { CliSettings, Json, Site } from '../lib/types';
import Shutdown from './down';
import { ListrTask } from 'listr';
import { ListrTaskWrapper } from 'listr';
import { disconnectProcess, startProcesses } from '../lib/pm2';
import { runNixDevelop } from '../lib/nix';

interface StartConfig {
  [key: string]: {
    flakeDir: string;
    processes: string[];
    onStartHooks: string[];
    afterStartHooks: string[];
  }
}

export default class Up extends Command {
  static description = 'Initialize the server and all configured sites';
  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    verbose: Flags.boolean({ char: 'v' }),
  };

  async run(): Promise<any> {
    const { flags } = await this.parse(Up);

    if (await isServerRunning()) {
      this.warn('Server is already running');
      return this.exit(1);
    }

    const tasks = new Listr([
      {
        title: 'Load sites configuration',
        task: async (ctx, task) => {
          ctx.settings = await loadSettings();
          ctx.processes = {
            environment: {},
            processes: []
          };
          ctx.processesToStart = [];

          if (ctx.settings.sites.length === 0) {
            task.skip('No sites to load');
            return;
          }

          ctx.sites = await loadSiteConfigCollection(ctx.settings.sites);

          await buildFlakeFile();
        },
      },

      {
        title: 'Load sites',
        task: async (ctx, task) => {
          if (!ctx.sites) {
            task.skip('No sites to load');
            return;
          }

          ctx.startConfig = {};

          return new Listr(
            ctx.sites.map((site: Site): ListrTask => {
              return {
                title: site.definition.project + (site.definition.group
                  ? `[${site.definition.group}]`
                  : ''),
                task: async (ctx: { processes: ProcessComposeProcessFile, settings: CliSettings, startConfig: StartConfig }, task: ListrTaskWrapper) => {
                  if (
                    ctx.settings.sites[site.projectPath].hash !== site.hash ||
                    !fileExists(site.serverConfigPath) ||
                    !fileExists(site.flakePath)
                  ) {
                    this.log('Site needs to be built - It will take a few moments');
                    // await Build.run(['--force', `--project ${site.project}`])
                  }

                  const siteProcessesConfig = await readJsonFile<ProcessComposeProcessFile>(`${site.configPath}/processes.json`);

                  ctx.processes.environment = siteProcessesConfig.environment;

                  siteProcessesConfig.processes.forEach((proc) => {
                    const procName = `${site.id}-${proc.name}`;
                    ctx.processes.processes.push({
                      ...proc,
                      name: procName,
                      env: {
                        ...ctx.processes.environment,
                        ...proc.env,
                      },
                      instance_var: procName,
                      interpreter: 'none',
                      // @todo: Move it to flakes?
                      error_file: join(site.statePath, `${proc.name}-error.log`),
                      out_file: join(site.statePath, `${proc.name}-out.log`),
                      pid_file: join(site.statePath, `${proc.name}.pid`),
                    });

                    if (site.definition.autostart) {
                      ctx.startConfig[site.id] = {
                        flakeDir: site.flakePath.replace('/flake.nix', ''),
                        onStartHooks: [
                          ...(ctx.startConfig[site.id]?.onStartHooks || []),
                          ...(proc.on_start
                            ? [proc.on_start]
                            : [])
                        ],
                        afterStartHooks: [
                          ...(ctx.startConfig[site.id]?.afterStartHooks || []),
                          ...(proc.after_start
                            ? [proc.after_start]
                            : [])
                        ],
                        processes: [
                          ...(ctx.startConfig[site.id]?.processes || []),
                          procName,
                        ],
                      }
                    }
                  });
                },
              };
            }),
            {
              concurrent: true,
            },
          );
        },
      },

      {
        title: 'Start server',
        task: async (ctx: { processes: ProcessComposeProcessFile, settings: CliSettings, sites: Site[], startConfig: StartConfig }) => {
          ctx.processes.processes.unshift({
            name: 'nudx-server',
            instance_var: 'nudx-server',
            interpreter: 'none',
            script: `${CLICONF_CADDY_PATH} run --config ${CLICONF_CADDY_CONFIG}`,
            error_file: join(`${CLICONF_SERVER_STATE}`, 'server-error.log'),
            out_file: join(`${CLICONF_SERVER_STATE}`, 'server-out.log'),
            pid_file: join(`${CLICONF_SERVER_STATE}`, 'server.pid'),
          });

          const pm2File = join(CLICONF_SERVER, 'ecosystem.config.js');
          await writeFile(pm2File, `module.exports = ${JSON.stringify({ apps: ctx.processes.processes }, null, 2)}`);
          await writeJsonFile(CLICONF_CADDY_CONFIG, await generateCaddyConfig(ctx.settings, ctx.sites) as unknown as Json);

          // Execute hooks and start processes
          const startGroups = Object.values(ctx.startConfig);

          for (const sg of startGroups) {
            if (sg.onStartHooks) {
              this.log('Running hook on ' + sg.flakeDir);
              await runNixDevelop(sg.flakeDir, `--command bash -c "run_hooks ${sg.onStartHooks.join(' ')}"`);
            }
          }

          const process = startProcesses(pm2File, startGroups.flatMap((sg) => sg.processes));

          for (const sg of Object.values(ctx.startConfig)) {
            if (sg.afterStartHooks) {
              this.log('Running hook on ' + sg.flakeDir);
              await runNixDevelop(sg.flakeDir, `--command bash -c "run_hooks ${sg.onStartHooks.join(' ')}"`);
            }
          }

          return await process;
        },
      },
    ],
      {
        renderer: flags.verbose
          ? 'verbose'
          : 'default',
      },
    );

    await tasks.run();

    disconnectProcess();
  }

  async catch(err: CommandError): Promise<any> {
    Shutdown.run();
    this.error(err);
  }
}
