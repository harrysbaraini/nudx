import { ProcessConfig } from './processes';

import pm2 = require('pm2');

export function disconnectProcess(): void {
  pm2.disconnect();
}

export async function killProcessManager(): Promise<void> {
  return new Promise((resolve, reject) => {
    pm2.killDaemon((err) => {
      if (err) {
        reject(err);
        return;
      }

      resolve();
    });
  });
}

export function startProcess(proc: ProcessConfig): Promise<void> {
  return new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        pm2.disconnect();
        reject(err);
      }

      const scrParts = proc.script.split(' ');
      const scrPath = scrParts.shift() as string;

      pm2.start(
        {
          name: proc.name,
          script: scrPath,
          args: scrParts,
          env: proc.env,
          cwd: proc.cwd || process.cwd(),
          interpreter: proc.interpreter,
          output: proc.out_file,
          pid: proc.pid_file,
          error: undefined,
        },
        (err) => {
          if (err) {
            pm2.disconnect();
            reject(err);
          }

          pm2.disconnect();

          resolve();
        },
      );
    });
  });
}

export function stopProcess(proc: ProcessConfig): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    pm2.delete(proc.name, (err) => {
      if (err) {
        reject(err);
      }

      resolve();
    });
  });
}

export function listProcesses(): Promise<pm2.ProcessDescription[]> {
  return new Promise((resolve, reject) => {
    pm2.list((err, list) => {
      if (err) {
        reject(err);
        return;
      }

      resolve(list as pm2.ProcessDescription[]);
    });
  });
}
