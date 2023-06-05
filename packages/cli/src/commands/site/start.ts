import { CLIError } from '@oclif/core/lib/errors';
import { CommandError } from '@oclif/core/lib/interfaces';
import { BaseCommand } from '../../core/base-command';
import { fileExists } from '../../core/filesystem';
import { runNixDevelop } from '../../core/nix';
import { disconnectProcess, startProcess } from '../../core/pm2';
import { SiteHandler } from '../../core/sites';

import Listr = require('listr');
import { Flags } from '@oclif/core';
import Build from './build';

export default class Start extends BaseCommand<typeof Start> {
  static description = 'Start site';
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %>'];

  static flags = {
    site: Flags.string({ char: 's', require: false }),
  };

  async run(): Promise<void> {
    if (!this.cliInstance.getServer().isRunning()) {
      // @todo Ask if user wants to start nudx...
      throw new CLIError('Nudx Server is not running. Run `nudx up` first.');
    }

    const site = await SiteHandler.load(this.flags.site, this.cliInstance);

    // ---
    // @todo Check if site needs to be rebuilt and inform user about it, asking if they want to rebuild it.
    // ---
    if (
      this.cliInstance.getSites()[site.config.projectPath].hash !== site.config.hash ||
      !fileExists(site.config.flakePath)
    ) {
      this.error('Site dependencies are not built');
    }

    const tasks = new Listr(
      site.config.processesConfig.processes.map((proc) => {
        return {
          title: proc.name,
          task: async () => {
            if (proc.on_start) {
              await site.runNixCmd(`run_hooks ${proc.on_start}`);
            }

            await startProcess(proc);

            if (proc.after_start) {
              await site.runNixCmd(`run_hooks ${proc.after_start}`);
            }
          },
        };
      }).concat([
        {
          title: 'Enable hosts',
          task: async () => {
            await this.cliInstance.getServer().runNixCmd(`enable_hosts_profile '${site.config.id}'`);
          },
        }
      ]),
      {
        renderer: 'verbose',
      }
    );

    await tasks.run();

    this.log('Site started!');
  }

  async catch(err: CommandError): Promise<any> {
    disconnectProcess();
    this.error(err.message, { exit: 2 });
  }
}
