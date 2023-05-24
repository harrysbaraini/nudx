import { ChildProcess } from 'child_process';
import { ExecOptions, execAttached, execDetached } from './process';
import { resolveSiteConfig } from './sites';

export async function runNixOnSite(
  site: string | null | undefined,
  args = '',
  options: ExecOptions = {},
  callback?: (proc: ChildProcess) => void,
) {
  const siteConfig = await resolveSiteConfig(site);
  const flakeDir = siteConfig.flakePath.replace('/flake.nix', '');

  return runNixDevelop(flakeDir, args, options, callback);
}

export async function runNixDevelop(
  flakeDir: string,
  args = '',
  options: ExecOptions = {},
  callback?: (proc: ChildProcess) => void,
) {
  const cmd = getNixCmdString(flakeDir, args);

  return options.detached === true
    ? execDetached(cmd, options, callback)
    : execAttached(cmd, options, callback);
}

export function getNixCmdString(flakeDir: string, args = ''): string {
  return `nix develop path:${flakeDir} --impure ${args}`.trim();
}
