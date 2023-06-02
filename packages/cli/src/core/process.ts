import { ChildProcess, SpawnOptions, spawn } from 'node:child_process';

export type ExecOptions = SpawnOptions;

export async function execAttached(
  command: string,
  options: ExecOptions = {},
  callback?: (proc: ChildProcess) => void,
) {
  return new Promise((resolve, reject) => {
    try {
      const proc = spawn(command, {
        cwd: options.cwd || undefined,
        stdio: options.stdio || [
          'inherit',
          'inherit',
          'pipe',
        ],
        shell: true,
        env: {
          ...process.env,
          ...(options.env || {}),
        },
      });

      if (callback) {
        callback(proc);
      }

      proc.on('close', (code, ...args) => {
        if (code === 0) {
          resolve(proc);
        } else {
          console.log(`child process exited with code ${code}`, args);
          reject(code);
        }
      });


      proc.on('exit', (code) => {
        if (code === 0) {
          resolve(proc);
        } else {
          console.log(`child process exited with code ${code}`);
          reject(code);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
}
