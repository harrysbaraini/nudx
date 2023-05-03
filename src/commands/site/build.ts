import { Command, Flags } from '@oclif/core';
import { resolve } from 'path';
import { createDirectory, deleteDirectory, deleteFile, fileExists, gitInit, writeFile, writeJsonFile } from '../../lib/filesystem';
import { CLICONF_ENV_PREFIX, CLICONF_PATH, CLICONF_SERVER_STATE, CLICONF_SETTINGS } from '../../lib/flags';
import { CaddyRoute } from '../../lib/server';
import { Inputs, Outputs, ServiceConfig, VirtualHost } from '../../lib/services';
import { loadSiteConfig } from '../../lib/sites';
import { loadSettings } from '../../lib/sites';
import { Dictionary, Json, Site } from '../../lib/types';
import { services } from '../../services';
import Reload from './reload';
import { Renderer } from '../../lib/templates';
import Listr = require('listr');
import newSiteFlakeTpl from '../../templates/siteFlake.tpl';
import siteEnvrcTpl from '../../templates/siteEnvrc.tpl';
import sourceEnvrcTpl from '../../templates/sourceEnvrc.tpl';
import { runNixOnSite } from '../../lib/nix';

export interface BuildProps {
  rootPath: string;
  project: Site;
  env: Dictionary<string>;
  virtualHosts: VirtualHost[]; // @todo add interface
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
      throw new Error('No dev.json found in this directory.');
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
              APP_MAIN_HOST: Object.keys(siteConfig.definition.hosts)[0],
            },
            virtualHosts: [],
            inputs: {},
            outputs: [],
          };

          for (const [srvKey, srvConfig] of Object.entries<Dictionary>(siteConfig.definition.services)) {
            if (!services.has(srvKey)) {
              throw new Error(`${srvKey} is not a valid service!`);
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

            if (builtSrv.virtualHosts) {
              buildProps.virtualHosts.push(...builtSrv.virtualHosts);
            }

            buildProps.outputs.push(builtSrv.outputs.split('\n'));
          }

          ctx.buildProps = buildProps;
        }
      },

      {
        title: 'Generate configuration files',
        task: async (ctx) => {
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
          createDirectory(siteConfig.statePath);

          // Generate server config file
          // if (ctx.buildProps.virtualHosts.length > 0) {
          //   await writeJsonFile(siteConfig.virtualHostsPath, ctx.buildProps.virtualHosts);
          // }

          // Generate the Flake file
          const flakeContent = Renderer.build(newSiteFlakeTpl, {
            ...(ctx.buildProps as unknown as Dictionary),
            inputsKeys: Object.keys(ctx.buildProps.inputs).join(' '),
            envPrefix: CLICONF_ENV_PREFIX,
            cliStatePath: CLICONF_SERVER_STATE,
            virtualHosts: ctx.buildProps.virtualHosts.map((vh: VirtualHost) => ({
              id: vh['@id'].replace('@', ''),
              json: JSON.stringify(vh),
            })),
          });

          await writeFile(siteConfig.flakePath, flakeContent);

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

          // Initialize git just to make sure Flake will not try to include everything (and break...)
          // await gitInit(siteConfig.configPath);

          // Finally update the cli settings file
          await writeJsonFile(CLICONF_SETTINGS, settings as unknown as Json);
        }
      },

      {
        title: 'Build site dependencies',
        task: async () => {
          await runNixOnSite(siteConfig.definition.project, '--command bash -c "echo \'Sitedependencies built\'"');
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
