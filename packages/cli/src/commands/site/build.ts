import { Command, Flags } from '@oclif/core';
import { resolve } from 'path';
import { createDirectory, deleteDirectory, fileExists, writeFile, writeJsonFile } from '../../lib/filesystem';
import { CLICONF_ENV_PREFIX, CLICONF_PATH, CLICONF_SETTINGS } from '../../lib/flags';
import { Inputs, ServiceConfig } from '../../lib/services';
import { loadSiteConfig } from '../../lib/sites';
import { loadSettings } from '../../lib/sites';
import { Dictionary, Json, Site } from '../../lib/types';
import { services } from '../../services';
import Reload from '../reload';
import { Renderer } from '../../lib/templates';
import Listr = require('listr');
import newSiteFlakeTpl from '../../templates/siteFlake.tpl';
import siteEnvrcTpl from '../../templates/siteEnvrc.tpl';
import sourceEnvrcTpl from '../../templates/sourceEnvrc.tpl';
import { runNixDevelop, runNixOnSite } from '../../lib/nix';
import { CaddyRoute } from '../../lib/server';
import { CLIError } from '@oclif/core/lib/errors';

export interface BuildProps {
  rootPath: string;
  project: Site;
  env: Dictionary<string>;
  serverRoutes: CaddyRoute[];
  inputs: Inputs;
  outputs: Array<string[]>;
}

export default class Build extends Command {
  static description = 'Build site definition';
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --force'];

  static flags = {
    force: Flags.boolean({ char: 'f' }),
    reload: Flags.boolean({ char: 'r' }),
  };

  async run(): Promise<void> {
    const { flags } = await this.parse(Build);
    const cwd = process.cwd();
    const siteJsonFile = resolve(cwd, 'dev.json');

    if (!fileExists(siteJsonFile)) {
      throw new CLIError('No dev.json found in this directory.');
    }

    const siteConfig = await loadSiteConfig(cwd);
    const settings = await loadSettings();

    // Site already exists and hash is the same (so nothing changed in dev.json)
    if (!flags.force && settings.sites[cwd] && settings.sites[cwd].hash === siteConfig.hash) {
      this.log('Site already exists and its dev.json has not changed');
      this.exit(1);
    }

    settings.sites[cwd] = {
      hash: siteConfig.hash,
      project: siteConfig.definition.project,
      group: siteConfig.definition.group,
    };

    const tasks = new Listr([
      {
        title: 'Gather services',
        task: async (ctx) => {
          // Build project files
          const buildProps: BuildProps = {
            rootPath: CLICONF_PATH,
            project: {
              ...siteConfig,
            },
            env: {
              APP_MAIN_HOST: siteConfig.definition.hosts[0],
            },
            serverRoutes: [],
            inputs: {},
            outputs: [],
          };

          for (const [srvKey, srvConfig] of Object.entries<Dictionary>(siteConfig.definition.services)) {
            if (!services.has(srvKey)) {
              throw new CLIError(`${srvKey} is not a valid service!`);
            }

            if ('enable' in srvConfig && srvConfig.enable === false) {
              return;
            }

            const srv = await services.get(srvKey);
            const srvDefaults = srv.options().reduce((defs, opt) => ({
              ...defs,
              [opt.name]: opt.default,
            }), {});

            const builtSrv: ServiceConfig = await srv.install({ ...srvDefaults, ...srvConfig }, buildProps.project);

            if (builtSrv.inputs) {
              buildProps.inputs = {
                ...buildProps.inputs,
                ...builtSrv.inputs,
              };
            }

            if (builtSrv.serverRoutes) {
              buildProps.serverRoutes.push(...builtSrv.serverRoutes);
            }

            buildProps.outputs.push(builtSrv.outputs.split('\n'));
          }

          ctx.buildProps = buildProps;
        }
      },

      {
        title: 'Generate configuration files',
        task: async (ctx: { buildProps: BuildProps }) => {
          // Clean up
          // @todo Instead of deleting, we could backup all site folder, so if something goes wrong
          // we just revert it? We could even has a revision system.
          if (fileExists(siteConfig.configPath)) {
            deleteDirectory(siteConfig.configPath, {
              force: true
            });
          }

          // Now we will ensure the required directories exist
          createDirectory(siteConfig.configPath);

          // Generate the Flake file
          const flakeContent = Renderer.build(newSiteFlakeTpl, {
            ...(ctx.buildProps as unknown as Dictionary),
            inputsKeys: Object.keys(ctx.buildProps.inputs).join(' '),
            envPrefix: CLICONF_ENV_PREFIX,
          });

          await writeFile(siteConfig.flakePath, flakeContent);

          // Generate caddy server configuration
          if (fileExists(siteConfig.serverConfigPath)) {
            deleteDirectory(siteConfig.serverConfigPath);
          }

          await writeJsonFile(siteConfig.serverConfigPath, ctx.buildProps.serverRoutes);

          // Generate .envrc

          await writeFile(siteConfig.envrcPath, Renderer.build(siteEnvrcTpl, {
            flakeDir: siteConfig.configPath,
            flakePath: siteConfig.flakePath,
            statePath: siteConfig.statePath,
          }))

          if (!fileExists(siteConfig.sourceEnvrcPath)) {
            await writeFile(siteConfig.sourceEnvrcPath, Renderer.build(sourceEnvrcTpl, {
              envrcPath: siteConfig.envrcPath,
            }));
          }

          // Finally update the cli settings file
          await writeJsonFile(CLICONF_SETTINGS, settings as unknown as Json);
        }
      },

      {
        title: 'Build site dependencies',
        task: async () => {
          await runNixOnSite(siteConfig.definition.project, '--command bash -c "echo \'Sitedependencies built\'"');

          const postBuildSiteConfig = await loadSiteConfig(cwd);

          return new Listr(
            postBuildSiteConfig.processesConfig.processes.map((proc): Listr.ListrTask => {
              return {
                title: `${proc.name} on_build hook`,
                enabled: () => Boolean(proc.on_build),
                task: async () => {
                  await runNixDevelop(postBuildSiteConfig.configPath, `--command bash -c "run_hooks ${proc.on_build}"`);
                }
              }
            }),
            {
              concurrent: true
            }
          );
        }
      },

      {
        title: 'Reload NUDX Server',
        enabled: () => flags.reload,
        task: async () => {
          await Reload.run();
        }
      }
    ]);

    await tasks.run();

    this.log('Site configuration completed!');
    this.exit(0);
  }
}
