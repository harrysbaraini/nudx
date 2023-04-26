import { Command, Flags } from '@oclif/core';
import { CommandError } from '@oclif/core/lib/interfaces';
import { ChildProcess } from 'child_process';
import * as Listr from 'listr';
import { resolve } from 'path';
import { fileExists, writeFile, writeJsonFile } from '../lib/filesystem';
import { CLICONF_SERVER } from '../lib/flags';
import { runNixDevelop, runNixOnSite } from '../lib/nix';
import { buildFlakeFile, generateCaddyConfig, isServerRunning, updateCaddyConfig } from '../lib/server';
import { loadSettings, loadSiteConfigCollection } from '../lib/sites';
import { Json, Site } from '../lib/types';
import Shutdown from './down';
import Build from './site/build';

export default class Up extends Command {
  static description = 'Initialize the server and all configured sites';
  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    force: Flags.boolean({ char: 'f' }),
    verbose: Flags.boolean({ char: 'v' }),
  };

  async run(): Promise<any> {
    const { flags } = await this.parse(Up);

    if (!flags.force && (await isServerRunning())) {
      this.log('Server is already running');
      return this.exit(1);
    }

    // Create server flake if needed
    buildFlakeFile(false);

    const envInfo: string[] = [];

    const tasks = new Listr(
      [
        {
          title: 'Load sites configuration',
          task: async (ctx, task) => {
            ctx.settings = await loadSettings();
          },
        },
        {
          title: 'Boot sites',
          task: async (ctx, task) => {
            if (ctx.settings.sites.length === 0) {
              task.skip('No site to boot');
              return;
            }

            ctx.sites = await loadSiteConfigCollection(ctx.settings.sites);

            return new Listr(
              ctx.sites.map((site: Site) => {
                return {
                  title: site.project,
                  task: async () => {
                    if (
                      ctx.settings.sites[site.projectPath].hash !== site.hash ||
                      !fileExists(site.virtualHostsPath) ||
                      !fileExists(site.flakePath)
                    ) {
                      this.log('Site needs to be built - It will take a few moments');
                      // await Build.run(['--force', `--project ${site.project}`])
                    }

                    await runNixOnSite(site.project, '--command bash -c "startProject"', {
                      cwd: site.projectPath,
                      stdio: flags.verbose ? 'inherit' : 'ignore',
                    });

                    await runNixOnSite(
                      site.project,
                      '--command bash -c "printInfo"',
                      {
                        cwd: site.projectPath,
                        stdio: 'pipe',
                      },
                      (proc: ChildProcess) => {
                        proc.stdout?.on('data', (data: Buffer) => {
                          envInfo.push(data.toString());
                        });
                      },
                    );
                  },
                };
              }),
              {
                concurrent: true,
                renderer: flags.verbose ? 'verbose' : 'default',
              },
            );
          },
        },
        {
          title: 'Start proxy server',
          task: async (ctx) => {
            const caddyConfig = await generateCaddyConfig(ctx.settings, ctx.sites);
            const siteEnvVars = envInfo.join('\n');

            await writeJsonFile(resolve(CLICONF_SERVER, 'server.json'), caddyConfig as unknown as Json);
            await writeFile(resolve(CLICONF_SERVER, 'env.txt'), siteEnvVars);

            // @todo We don't actually need to call updateCaddyConfig in boot method, we could pass
            //       JSON.stringify(caddyConfig) as an argument to "startServer" in the following
            //       code, store it in a temporary file in startServer, and start caddy with --config="config.json".
            //       Then, we can use updateCaddyConfig on other places to reload caddy config
            //       without having to restart the server.
            await runNixDevelop(
              CLICONF_SERVER,
              `--command bash -c 'startServer "${JSON.stringify(caddyConfig)}" "${siteEnvVars}"'`,
              {
                cwd: CLICONF_SERVER,
                stdio: flags.verbose ? 'inherit' : 'ignore',
              },
            );

            await updateCaddyConfig(caddyConfig);
          },
        },
      ],
      {
        renderer: flags.verbose ? 'verbose' : 'default',
      },
    );

    await tasks.run();
  }

  async catch(err: CommandError): Promise<any> {
    Shutdown.run();
    this.error(err);
  }
}
