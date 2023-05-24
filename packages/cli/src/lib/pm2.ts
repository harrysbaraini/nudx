import pm2 = require('pm2');
import { CLICONF_SERVER } from './flags';
import { ProcessComposeProcess } from './server';
import { Dictionary } from './types';

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

export function startProcess(process: ProcessComposeProcess): Promise<void> {
  return new Promise((resolve, reject) => {
    pm2.connect((err) => {
      if (err) {
        pm2.disconnect();
        reject(err);
      }

      pm2.start({
        name: process.name,
        script: process.script,
        env: process.env,
        interpreter: process.interpreter,
        cwd: CLICONF_SERVER,
        output: process.out_file,
        error: process.error_file,
        pid: process.pid_file,
      }, (err) => {
        if (err) {
          pm2.disconnect();
          reject(err);
        }

        pm2.disconnect();

        resolve();
      });
    });
  });
}

export function stopProcess(process: ProcessComposeProcess): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    pm2.stop(process.name, (err) => {
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
