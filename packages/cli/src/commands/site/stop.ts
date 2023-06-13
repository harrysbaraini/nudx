import { BaseCommand } from '../../core/base-command';
import { fileExists, readJsonFile } from '../../core/filesystem';
import { CaddyRoute } from '../../core/interfaces/server';
import { stopProcess } from '../../core/pm2';
import { SiteHandler } from '../../core/sites';

import Listr = require('listr');

export default class Stop extends BaseCommand<typeof Stop> {
  static description = 'Stop site';
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %>'];

  static flags = {
    site: Flags.string({ char: 's', require: false }),
  };

  async run(): Promise<void> {
    if (!this.cliInstance.getServer().isRunning()) {
      this.warn('Server is not running');
      this.exit(1);
    }

    const site = await SiteHandler.load(this.flags.site, this.cliInstance);

    const tasks = new Listr(
      site.config.processesConfig.processes
        .map<Listr.ListrTask>((proc) => {
          return {
            title: `Stop ${proc.name}`,
            task: async () => {
              // @todo Add a before_stop hook

              try {
                await stopProcess(proc);
              } catch (err) {
                this.warn(`[${proc.name}] ${err}`);
              }

              // @todo Add a after_stop hook
            },
          };
        })
        .concat([
          {
            title: 'Unload server routes',
            enabled: async () => fileExists(site.config.serverConfigPath),
            task: async () => {
              await this.server.unloadRoutes(await readJsonFile<CaddyRoute[]>(site.config.serverConfigPath));
            },
          },
          {
            title: 'Disable hosts',
            task: async () => {
              await this.cliInstance.getServer().runNixCmd(`disable_hosts_profile '${site.config.id}'`, {
                stdio: 'ignore',
              });
            },
          },
        ]),
      { renderer: 'verbose' },
    );

    await tasks.run();

    this.exit(0);
  }
}
