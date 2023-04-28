import { Command, Flags } from '@oclif/core';
import { resolve } from 'path';
import { createDirectory, deleteFile, fileExists, gitInit, srcPath, writeFile, writeJsonFile } from '../../lib/filesystem';
import { CLICONF_ENV_PREFIX, CLICONF_PATH, CLICONF_SETTINGS } from '../../lib/flags';
import { CaddyRoute } from '../../lib/server';
import { ServiceConfig, ServiceFile } from '../../lib/services';
import { loadSiteConfig } from '../../lib/sites';
import { loadSettings } from '../../lib/sites';
import { Dictionary, Json, Site } from '../../lib/types';
import { services } from '../../services';
import Reload from './reload';
import siteFlakeTpl from '../../templates/siteFlake.tpl';
import { Renderer } from '../../lib/templates';
import { execAttached } from '../../lib/process';
import { runNixOnSite } from '../../lib/nix';
import Listr = require('listr');

export interface BuildProps {
  devl: {
    rootPath: string;
  };
  project: Site;
  env: Dictionary<string>;
  hosts: Dictionary<string>;
  processes: Dictionary<string>;
  packages: string[];
  files: ServiceFile[]; // @todo add interface
  virtualHosts: CaddyRoute[]; // @todo add interface
  onStartHooks: Array<string[]>;
  onStartedHooks: Array<string[]>;
  onStopHooks: Array<string[]>;
  shellHooks: Array<string[]>;
}

export default class Build extends Command {
  static description = 'Build site definition';
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --force'];

  static flags = {
    force: Flags.boolean({ char: 'f' }),
    reload: Flags.boolean({ char: 'r' }),
  };

  async run(): Promise<any> {
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
      return;
    }

    settings.sites[cwd] = {
      hash: siteConfig.hash,
      project: siteConfig.project,
    };

    const tasks = new Listr([
      {
        title: 'Gather services',
        task: async (ctx) => {
          // Build project files
          const buildProps: BuildProps = {
            devl: {
              rootPath: CLICONF_PATH,
            },
            project: {
              ...siteConfig,
            },
            env: {
              APP_MAIN_HOST: Object.keys(siteConfig.definition.hosts)[0],
            },
            hosts: siteConfig.definition.hosts,
            processes: {},
            packages: [],
            files: [],
            virtualHosts: [],
            onStartHooks: [],
            onStartedHooks: [],
            onStopHooks: [],
            shellHooks: [],
          };

          for (const [srvKey, srvConfig] of Object.entries<Dictionary>(siteConfig.definition.services)) {
            if (!services.has(srvKey)) {
              throw new Error(`${srvKey} is not a valid service!`);
            }

            if ('enable' in srvConfig && srvConfig.enable === false) {
              return;
            }

            const srv: ServiceConfig = await services.get(srvKey).install(srvConfig, buildProps.project);

            if (srv.env) {
              buildProps.env = {
                ...buildProps.env,
                ...srv.env,
              };
            }
            if (srv.packages) {
              buildProps.packages.push(...srv.packages);
            }
            if (srv.files) {
              buildProps.files.push(...srv.files);
            }
            if (srv.processes) {
              buildProps.processes = {
                ...buildProps.processes,
                ...srv.processes,
              };
            }
            if (srv.virtualHosts) {
              buildProps.virtualHosts.push(...srv.virtualHosts);
            }
            if (srv.onStartHook) {
              buildProps.onStartHooks.push(srv.onStartHook.split('\n'));
            }
            if (srv.onStartedHook) {
              buildProps.onStartedHooks.push(srv.onStartedHook.split('\n'));
            }
            if (srv.onStopHook) {
              buildProps.onStopHooks.push(srv.onStopHook.split('\n'));
            }
            if (srv.shellHook) {
              buildProps.shellHooks.push(srv.shellHook.split('\n'));
            }
          }

          ctx.buildProps = buildProps;
        }
      },

      {
        title: 'Generate configuration files',
        task: async (ctx) => {
          // Now we will ensure the site state directory exists and create all files
          createDirectory(siteConfig.configPath);
          createDirectory(siteConfig.statePath);

          // Generate server config file
          if (fileExists(siteConfig.virtualHostsPath)) {
            await deleteFile(siteConfig.virtualHostsPath);
          }

          await writeJsonFile(siteConfig.virtualHostsPath, ctx.buildProps.virtualHosts);

          // Generate the Flake file
          const flakeContent = Renderer.build(siteFlakeTpl, {
            ...(ctx.buildProps as unknown as Dictionary),
            packagesString: ctx.buildProps.packages.join(' '),
            envPrefix: CLICONF_ENV_PREFIX,
            overmindSocketPath: `${ctx.buildProps.project.statePath}/overmind`,
          });

          if (fileExists(siteConfig.flakePath)) {
            await deleteFile(siteConfig.flakePath);
          }
          await writeFile(siteConfig.flakePath, flakeContent);

          // Initialize git just to make sure Flake will not try to include everything (and break...)
          // await gitInit(siteConfig.configPath);

          // Finally update the cli settings file
          await writeJsonFile(CLICONF_SETTINGS, settings as unknown as Json);
        }
      },

      {
        title: 'Build site dependencies',
        task: async (ctx) => {
          //await runNixOnSite(siteConfig.definition.project, '--command bash -c "echo \'Site dependencies built\'"');
        }
      },

      {
        title: 'Reload NUDX Server',
        enabled: () => flags.reload,
        task: async (ctx) => {
          await Reload.run();
        }
      }
    ]);

    await tasks.run();

    this.log('Site configuration completed!');
    this.exit(0);
  }
}
