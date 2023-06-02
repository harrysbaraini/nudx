import { CLIError } from "@oclif/core/lib/errors";
import Listr = require("listr");
import { stopProcess } from "../../core/pm2";
import { BaseCommand } from "../../core/base-command";
import { SiteHandler } from "../../core/sites";
import { Flags } from "@oclif/core";
import { runNixDevelop } from "../../core/nix";

export default class Stop extends BaseCommand<typeof Stop> {
  static description = 'Stop site';
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %>'];

  static flags = {
    site: Flags.string({ char: 's', require: false }),
  };

  async run(): Promise<void> {
    if (!this.server.isRunning()) {
      // @todo Ask if user wants to start nudx...
      throw new CLIError('Nudx Server is not running. Run `nudx up` first.');
    }

    const site = await SiteHandler.load(this.flags.site, this.settings);

    const tasks = new Listr(
      site.config.processesConfig.processes.map((proc) => {
        return {
          title: proc.name,
          task: async () => {
            // @todo Add a before_stop hook

            await this.server.runNixCmd(`disable_hosts_profile '${site.config.id}'`);
            await stopProcess(proc);

            // @todo Add a after_stop hook
          },
        }
      })
    );

    await tasks.run();

    this.exit(0);
  }
}
