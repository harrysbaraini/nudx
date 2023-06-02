import * as Listr from 'listr';
import { ListrTask } from 'listr';
import { BaseCommand } from '../core/base-command';
import { CliFile } from '../core/interfaces/cli';
import { disconnectProcess } from '../core/pm2';
import { SiteHandler } from '../core/sites';
import Shutdown from './down';
import Start from './site/start';
import { Flags } from '@oclif/core';

export default class Up extends BaseCommand<typeof Up> {
  static description = 'Initialize the server and all configured sites';
  static examples = ['<%= config.bin %> <%= command.id %>'];

  static flags = {
    verbose: Flags.boolean({ char: 'v' }),
  };

  async run(): Promise<unknown> {
    if (await this.server.isRunning()) {
      this.warn('Server is already running');
      return this.exit(1);
    }

    const tasks = new Listr(
      [
        {
          title: 'Load settings',
          task: async (ctx) => {
            const sites = this.settings.getSites();

            ctx.sites = await Promise.all(
              Object.keys(sites)
                .filter((site: string) => !sites[site].disabled)
                .map((site) => SiteHandler.loadByPath(site, this.settings)),
            );
          },
        },
        {
          title: 'Start server',
          task: async (ctx: { settings: CliFile; sites: SiteHandler[] }) => {
            this.server.start(ctx.sites);
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
              ctx.sites.map((site: SiteHandler): ListrTask => {
                return {
                  title: site.config.id,
                  task: async (_, task) => {
                    if (!site.config.definition.autostart) {
                      return task.skip('Site autostart is set to off');
                    }

                    await Start.run([`--site ${site.config.definition.project}`]);
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
        renderer: this.flags.verbose ? 'verbose' : 'default',
      },
    );

    try {
      await tasks.run();
    } catch {
      this.error('Error', { exit: 2 });
    }

    disconnectProcess();
  }

  async catch(): Promise<any> {
    disconnectProcess();
    await Shutdown.run();
  }
}
