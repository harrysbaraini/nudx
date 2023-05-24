import { Command, Flags } from '@oclif/core';
import { CommandError } from '@oclif/core/lib/interfaces';
import * as Listr from 'listr';
import { join } from 'path';
import { writeJsonFile } from '../lib/filesystem';
import { CLICONF_CADDY_CONFIG, CLICONF_CADDY_PATH, CLICONF_SERVER_STATE } from '../lib/flags';
import { ProcessComposeProcess, buildFlakeFile, generateCaddyConfig, isServerRunning } from '../lib/server';
import { loadSettings, loadSiteConfigCollection } from '../lib/sites';
import { CliSettings, Json, Site } from '../lib/types';
import Shutdown from './down';
import { ListrTask } from 'listr';
import { disconnectProcess, startProcess } from '../lib/pm2';
import Start from './site/start';

interface SiteStartConfig {
  siteId: string;
  flakeDir: string;
  processes: ProcessComposeProcess[];
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
        title: 'Load settings',
        task: async (ctx) => {
          ctx.settings = await loadSettings();
          ctx.sites = await loadSiteConfigCollection(ctx.settings.sites);
        }
      },
      {
        title: 'Start server',
        task: async (ctx: { settings: CliSettings, sites: Site[] }) => {
          await buildFlakeFile();

          await writeJsonFile(CLICONF_CADDY_CONFIG, await generateCaddyConfig(ctx.settings, ctx.sites) as unknown as Json);

          await startProcess({
            name: 'nudx-server',
            script: `${CLICONF_CADDY_PATH} run --config ${CLICONF_CADDY_CONFIG}`,
            interpreter: 'none',
            instance_var: 'nudx-server',
            error_file: join(`${CLICONF_SERVER_STATE}`, 'server-error.log'),
            out_file: join(`${CLICONF_SERVER_STATE}`, 'server-out.log'),
            pid_file: join(`${CLICONF_SERVER_STATE}`, 'server.pid'),
          });

          await writeJsonFile(CLICONF_CADDY_CONFIG, await generateCaddyConfig(ctx.settings, ctx.sites) as unknown as Json);
        },
      },

      {
        title: 'Load sites',
        task: async (ctx, task) => {
          if (Object.keys(ctx.settings.sites).length === 0) {
            task.skip('No sites to load');
            return;
          }

          return new Listr(
            ctx.sites.map((site: Site): ListrTask => {
              return {
                title: site.id,
                task: async (_, task) => {
                  if (!site.definition.autostart) {
                    return task.skip('Site autostart is set to off');
                  }

                  await Start.run([`--site ${site.definition.project}`]);
                },
              };
            }),
            {
              concurrent: true,
            },
          );
        },
      },
    ],
      {
        renderer: flags.verbose
          ? 'verbose'
          : 'default',
      },
    );

    try {
      await tasks.run();
    } catch {
      this.error('Error', { exit: 2 });
    }

    disconnectProcess();
  }

  async catch(err: CommandError): Promise<any> {
    disconnectProcess();
    await Shutdown.run();
  }
}
