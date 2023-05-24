import { Command, Flags } from "@oclif/core";
import { fileExists } from "../../lib/filesystem";
import { loadSettings, resolveSiteConfig } from "../../lib/sites";
import { isServerRunning } from "../../lib/server";
import { runNixDevelop } from "../../lib/nix";
import { disconnectProcess, startProcess } from "../../lib/pm2";
import { CLIError } from "@oclif/core/lib/errors";
import Listr = require("listr");
import { CommandError } from "@oclif/core/lib/interfaces";

export default class Start extends Command {
  static description = 'Start site';
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %>'];

  static flags = {
    site: Flags.string({ char: 's', require: false }),
  };

  async run(): Promise<void> {
    if (!isServerRunning()) {
      // @todo Ask if user wants to start nudx...
      throw new CLIError('Nudx Server is not running. Run `nudx up` first.');
    }

    const { flags } = await this.parse(Start);
    const site = await resolveSiteConfig(flags.site);
    const settings = await loadSettings();

    // ---
    // @todo Check if site needs to be rebuilt and inform user about it
    // ---
    if (settings.sites[site.projectPath].hash !== site.hash || !fileExists(site.flakePath)) {
      this.log('Site dependencies are not built');
      // await Build.run(['--force', `--project ${site.project}`])
    }

    const tasks = new Listr(
      site.processesConfig.processes.map((proc) => {
        return {
          title: proc.name,
          task: async () => {
            if (proc.on_start) {
              await runNixDevelop(site.configPath, `--command bash -c "run_hooks ${proc.on_start}"`);
            }

            await startProcess(proc);

            if (proc.after_start) {
              await runNixDevelop(site.configPath, `--command bash -c "run_hooks ${proc.after_start}"`);
            }
          }
        }
      })
    );

    await tasks.run();

    this.log('Site started!');
  }

  async catch(err: CommandError): Promise<any> {
    disconnectProcess();
    this.error(err.message, { exit: 2 });
  }
}
