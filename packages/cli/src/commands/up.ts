import { Command, Flags } from '@oclif/core';
import { CommandError } from '@oclif/core/lib/interfaces';
import { ChildProcess } from 'child_process';
import * as Listr from 'listr';
import { join, resolve } from 'path';
import { fileExists, gitInit, writeFile, writeJsonFile, writeYamlFromJson } from '../lib/filesystem';
import { CLICONF_SERVER, CLICONF_SERVER_CONFIG } from '../lib/flags';
import { getNixCmdString, runNixDevelop, runNixOnSite } from '../lib/nix';
import { ProcessComposeProcess, ProcessComposeProcessFile, buildFlakeFile, generateCaddyConfig, getServerConfig, isServerRunning, updateCaddyConfig } from '../lib/server';
import { loadSettings, loadSiteConfigCollection } from '../lib/sites';
import { CliSettings, CliSettingsSites, Dictionary, Json, Site } from '../lib/types';
import Shutdown from './down';
import { write } from 'fs';
import { ListrTaskResult } from 'listr';
import { ListrTask } from 'listr';
import { ListrTaskWrapper } from 'listr';

export default class Up extends Command {
  static description = 'Initialize the server and all configured sites';
  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    verbose: Flags.boolean({ char: 'v' }),
    ui: Flags.boolean({ char: 'v' }),
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
            processes: {}
          };
          ctx.processesToStart = [];

          if (ctx.settings.sites.length === 0) {
            task.skip('No sites to load');
            return;
          }

          ctx.sites = await loadSiteConfigCollection(ctx.settings.sites);

          // Create server flake if needed
          await buildFlakeFile(ctx.settings, ctx.sites, false);
        },
      },

      {
        title: 'Load sites',
        task: async (ctx, task) => {
          if (!ctx.sites) {
            task.skip('No sites to load');
            return;
          }

          ctx.sitesToStart = [];

          return new Listr(
            ctx.sites.map((site: Site): ListrTask => {
              return {
                title: site.definition.project + (site.definition.group ? `[${site.definition.group}]` : ''),
                task: async (ctx: { processes: ProcessComposeProcessFile, settings: CliSettings, processesToStart: string[] }, task: ListrTaskWrapper) => {
                  if (
                    ctx.settings.sites[site.projectPath].hash !== site.hash ||
                    !fileExists(site.virtualHostsPath) ||
                    !fileExists(site.flakePath)
                  ) {
                    this.log('Site needs to be built - It will take a few moments');
                    // await Build.run(['--force', `--project ${site.project}`])
                  }

                  const processCmd = getNixCmdString(
                    site.flakePath.replace('/flake.nix', ''),
                    '--command bash -c "startProject"'
                  );

                  ctx.processes.processes[site.id] = {
                    command: processCmd,
                    depends_on: {
                      nudx__server: {
                        condition: 'process_started'
                      }
                    }
                  };

                  if (site.definition.autostart) {
                    ctx.processesToStart.push(site.id);
                  }
                },
              };
            }),
            {
              concurrent: true,
              renderer: flags.verbose
                ? 'verbose'
                : 'default',
            },
          );
        },
      },

      {
        title: 'Start server',
        task: async (ctx: { processes: ProcessComposeProcessFile, settings: CliSettings, sites: Site[], processesToStart: string[] }) => {
          ctx.processes.processes.nudx__server = {
            command: 'runCaddy',
            readiness_probe: {
              http_get: {
                host: 'localhost',
                scheme: 'http',
                path: '/config',
                port: 2019
              },
              initial_delay_seconds: 5,
              period_seconds: 2,
              timeout_seconds: 10,
            },
          };

          writeJsonFile(join(CLICONF_SERVER_CONFIG, 'processes.json'), ctx.processes as unknown as Json);

          const daemon = flags.ui ? 'tui' : 'daemon';
          const cmd = `--command bash -c "startServer ${daemon} '${ctx.processesToStart.join(' ')}'"`;

          const process = runNixDevelop(CLICONF_SERVER_CONFIG, cmd, {
            cwd: CLICONF_SERVER_CONFIG,
            stdio: daemon === 'tui' || flags.verbose
              ? 'inherit'
              : 'ignore',
          });

          if (daemon === 'tui') {
            return true
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
  }

  async catch(err: CommandError): Promise<any> {
    Shutdown.run();
    this.error(err);
  }
}
