import { ChildProcess } from 'child_process';
import { ExecOptions, execAttached } from './process';
import { resolve } from 'path';

export async function runNixDevelop(
  flakeDir: string,
  args = '',
  options: ExecOptions = {},
  callback?: (proc: ChildProcess) => void,
) {
  const cmd = getNixCmdString(flakeDir, args);

  return execAttached(cmd, options, callback);
}

export function getNixCmdString(flakeDir: string, args = ''): string {
  return `nix develop path:${flakeDir} --impure ${args}`.trim();
}
