import { Command, ux } from "@oclif/core";
import { CLIError } from "@oclif/core/lib/errors";
import { isServerRunning } from "../lib/server";
import { listProcesses } from "../lib/pm2";
import { Dictionary, Json } from "../lib/types";
import { ProcessDescription } from "pm2";

export default class Status extends Command {
  static description = 'List status of running sites and processes';
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %>'];

  private formatBytes(bytes: number, decimals = 2): string {
    if (bytes === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  async run(): Promise<any> {
    if (!isServerRunning()) {
      // @todo Ask if user wants to start nudx...
      throw new CLIError('Nudx Server is not running. Run `nudx up` first.');
    }

    const processes = await listProcesses() as Record<string, ProcessDescription>[];

    ux.table(processes, {
      name: {},
      pid: {
        header: 'PID',
        minWidth: 10,
      },
      status: {
        minWidth: 15,
        get: (row: ProcessDescription): string => row.pm2_env?.status || '-',
      },
      memory: {
        header: 'Memory',
        minWidth: 20,
        get: (row: ProcessDescription): string => {
          const memory = row.monit?.memory || 0;
          return this.formatBytes(memory);
        },
      },
      cpu: {
        header: 'CPU',
        minWidth: 10,
        get: (row): string => ((row as { monit: Dictionary }).monit.cpu as Number).toString() + '%',
      },
    });

    this.exit(0);
  }
}
