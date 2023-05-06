import pm2 = require('pm2');
import { APP_NAME, CLICONF_SERVER, CLICONF_SERVER_STATE } from './flags';

export function disconnectProcess(): void {
  pm2.disconnect();
}

export async function killProcessManager(): Promise<void> {
  return new Promise((resolve) => {
    pm2.killDaemon((err) => {
      if (err) {
        console.error(err);
        process.exit(2);
      }

      pm2.disconnect();
      resolve();
    });
  });
}

export async function startProcesses(file: string, processes: string[]): Promise<void> {
  return new Promise((resolve) => {
    pm2.connect((err) => {
      if (err) {
        console.error(err);
        process.exit(2);
      }

      pm2.start(file, {
        name: APP_NAME,
        cwd: CLICONF_SERVER,
        output: `${CLICONF_SERVER_STATE}/nudx-out.log`,
        error: `${CLICONF_SERVER_STATE}/nudx-error.log`,
        pid: `${CLICONF_SERVER_STATE}/nudx.pid`,
      }, (err) => {
        if (err) {
          console.error(err);
          pm2.disconnect();
          return process.exit(2);
        }

        pm2.disconnect();
        resolve();
      });
    });
  });
}

export async function stopProcesses(processes: string[]): Promise<void> {
  await Promise.all(processes.map((proc) => {
    return new Promise<void>((resolve) => {
      pm2.stop(proc, (err) => {
        if (err) {
          console.error(err);
          pm2.disconnect();
          return process.exit(2);
        }

        pm2.disconnect();

        resolve();
      });
    });
  }));
}
