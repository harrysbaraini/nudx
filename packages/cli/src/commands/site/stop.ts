import { Command, Flags } from "@oclif/core";
import { CLIError } from "@oclif/core/lib/errors";
import { isServerRunning } from "../../lib/server";
import { loadSettings, resolveSiteConfig } from "../../lib/sites";
import Listr = require("listr");
import { stopProcess } from "../../lib/pm2";

export default class Stop extends Command {
  static description = 'Stop site';
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %>'];

  static flags = {
    site: Flags.string({ char: 's', require: false }),
  };

  async run(): Promise<void> {
    if (!isServerRunning()) {
      // @todo Ask if user wants to start nudx...
      throw new CLIError('Nudx Server is not running. Run `nudx up` first.');
    }

    const { flags } = await this.parse(Stop);
    const site = await resolveSiteConfig(flags.site);

    const tasks = new Listr(
      site.processesConfig.processes.map((proc) => {
        return {
          title: proc.name,
          task: async () => {
            // @todo Add a before_stop hook

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
