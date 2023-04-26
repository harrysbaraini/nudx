// TODO - Refactor main index.js and add utils here
import { ChildProcess, SpawnOptions, spawn } from 'node:child_process';

export interface ExecOptions extends SpawnOptions {}

export async function execAttached(
  command: string,
  options: ExecOptions = {},
  callback?: (proc: ChildProcess) => void,
) {
  return new Promise((resolve, reject) => {
    try {
      const proc = spawn(command, {
        cwd: options.cwd || undefined,
        stdio: options.stdio || 'ignore',
        shell: true,
        env: {
          ...process.env,
          ...(options.env || {}),
        },
      });

      if (callback) {
        callback(proc);
      }

      proc.on('exit', (code) => {
        if (code === 0) {
          resolve(proc);
        } else {
          reject(code);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}

export async function execDetached(
  command: string,
  options: ExecOptions = {},
  callback?: (proc: ChildProcess) => void,
) {
  return new Promise((resolve, reject) => {
    try {
      const proc = spawn(command, {
        cwd: options.cwd || undefined,
        stdio: options.stdio || 'inherit',
        detached: options.detached || true,
        shell: true,
        env: {
          ...process.env,
          ...(options.env || {}),
        },
      });

      if (callback) {
        callback(proc);
      }

      proc.on('exit', (code: number) => {
        if (code === 0) {
          resolve(proc);
        }
      });

      proc.on('error', (err: Error) => {
        reject(err);
      });
    } catch (err) {
      reject(err);
    }
  });
}
