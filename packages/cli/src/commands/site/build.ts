import { CLIError } from '@oclif/core/lib/errors';
import { BaseCommand } from '../../core/base-command';
import { createDirectory, deleteDirectory, fileExists, writeFile, writeJsonFile } from '../../core/filesystem';
import { CLICONF_ENV_PREFIX } from '../../core/flags';
import { Dictionary, Json } from '../../core/interfaces/generic';
import { runNixDevelop } from '../../core/nix';
import { services } from '../../core/services';
import { SiteHandler } from '../../core/sites';
import { Renderer } from '../../core/templates';
import siteEnvrcTpl from '../../templates/siteEnvrc.tpl';
import newSiteFlakeTpl from '../../templates/siteFlake.tpl';
import sourceEnvrcTpl from '../../templates/sourceEnvrc.tpl';
import Reload from '../reload';

import Listr = require('listr');
import { SiteConfig, SiteFile } from '../../core/interfaces/sites';
import { CaddyRoute } from '../../core/interfaces/server';
import { Flags } from '@oclif/core';
import { ServiceBuildConfig } from '../../core/interfaces/services';
import { join } from 'path';

interface BuildPropsService {
  name: string;
  file: string;
  config: string;
}

export interface BuildProps {
  rootPath: string;
  project: SiteConfig;
  env: Dictionary<string>;
  serverRoutes: CaddyRoute[];
  services: BuildPropsService[];
}

export default class Build extends BaseCommand<typeof Build> {
  static description = 'Build site definition';
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --force'];

  static flags = {
    site: Flags.string({ char: 's', require: false }),
    force: Flags.boolean({ char: 'f' }),
    reload: Flags.boolean({ char: 'r' }),
  };

  async run(): Promise<void> {
    const site = await SiteHandler.load(this.flags.site, this.cliInstance);

    // Site already exists and hash is the same (so nothing changed in dev.json)
    if (!this.flags.force && site.checkHash()) {
      throw new CLIError('Site already exists and its dev.json has not changed');
    }

    const tasks = new Listr([
      {
        title: 'Gather services',
        task: async (ctx) => {
          // Build project files
          const buildProps: BuildProps = {
            rootPath: this.config.home,
            project: {
              ...site.config,
            },
            env: {
              APP_MAIN_HOST: site.config.definition.hosts[0],
            },
            serverRoutes: [],
            services: [],
          };

          for (const [srvKey, srvConfig] of Object.entries<Dictionary>(site.config.definition.services)) {
            if (!services.has(srvKey)) {
              throw new CLIError(`${srvKey} is not a valid service!`);
            }

            if ('enable' in srvConfig && srvConfig.enable === false) {
              return;
            }

            const srv = await services.get(srvKey);
            const builtSrv: ServiceBuildConfig = await srv.onBuild(srvConfig, site.config);

            if (builtSrv.serverRoutes) {
              buildProps.serverRoutes.push(...builtSrv.serverRoutes);
            }

            buildProps.services.push({
              name: srvKey,
              file: builtSrv.nix.file,
              config: JSON.stringify(builtSrv.nix.config),
            });
          }

          ctx.buildProps = buildProps;
        },
      },

      {
        title: 'Generate configuration files',
        task: async (ctx: { buildProps: BuildProps }) => {
          // Clean up
          // @todo Instead of deleting, we could back up all site folder, so if something goes wrong
          //       we just revert it? We could even have a revision system.
          if (fileExists(site.config.configPath)) {
            deleteDirectory(site.config.configPath, {
              force: true,
            });
          }

          // Now we will ensure the required directories exist
          createDirectory(site.config.configPath);

          // Generate the Flake file
          const flakeContent = Renderer.build(newSiteFlakeTpl, {
            ...(ctx.buildProps as unknown as Dictionary),
            envPrefix: CLICONF_ENV_PREFIX,
            cliNix: join(this.config.root, 'files', 'cli.nix'),
          });

          await writeFile(site.config.flakePath, flakeContent);

          // Generate caddy server configuration
          if (fileExists(site.config.serverConfigPath)) {
            deleteDirectory(site.config.serverConfigPath);
          }

          await writeJsonFile(site.config.serverConfigPath, ctx.buildProps.serverRoutes);

          // Generate .envrc

          await writeFile(
            site.config.envrcPath,
            Renderer.build(siteEnvrcTpl, {
              flakeDir: site.config.configPath,
              flakePath: site.config.flakePath,
              statePath: site.config.statePath,
            }),
          );

          if (!fileExists(site.config.sourceEnvrcPath)) {
            await writeFile(
              site.config.sourceEnvrcPath,
              Renderer.build(sourceEnvrcTpl, {
                envrcPath: site.config.envrcPath,
              }),
            );
          }

          // Finally update the cli settings fil
          const siteSettings = {
            hash: site.config.hash,
            project: site.config.definition.project,
            group: site.config.definition.group,
          };

          this.cliInstance.updateSiteSettings(site.config.projectPath, siteSettings);
        },
      },

      {
        title: 'Build site dependencies',
        task: async () => {
          await site.runNixCmd('echo \"Site dependencies built\"');

          const postBuildSite = await SiteHandler.loadByPath(site.config.projectPath, this.cliInstance);

          return new Listr(
            postBuildSite.config.processesConfig.processes.map((proc): Listr.ListrTask => {
              return {
                title: `on_build hook > ${proc.name}`,
                enabled: () => Boolean(proc.on_build),
                task: async () => site.runNixCmd(`run_hooks ${proc.on_build}`),
              };
            }), {
              concurrent: true,
            },
          );
        },
      },

      {
        title: 'Load site hosts',
        task: async () => this.cliInstance.getServer().runNixCmd(`create_hosts_profile ${site.config.id} ${site.config.definition.hosts.join(' ')}`),
      },

      {
        title: 'Reload NUDX Server',
        enabled: () => this.flags.reload,
        task: async () => {
          await Reload.run();
        },
      },
    ], { renderer: 'verbose' });

    await tasks.run();

    this.log('Site configuration completed!');
    this.exit(0);
  }
}
