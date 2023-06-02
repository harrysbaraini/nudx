import pm2 = require('pm2');
import { ProcessConfig } from './processes';

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

      pm2.start(
        {
          name: proc.name,
          script: proc.script,
          env: proc.env,
          cwd: proc.cwd || process.cwd(),
          interpreter: proc.interpreter,
          output: proc.out_file,
          error: proc.error_file,
          pid: proc.pid_file,
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
    pm2.stop(proc.name, (err) => {
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
