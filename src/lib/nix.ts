import { ChildProcess } from 'child_process';
import { ExecOptions, execAttached, execDetached } from './process';
import { getConfigSiteDir, resolveSiteConfig } from './sites';

export async function runNixOnSite(
  site: string | null | undefined,
  args = '',
  options: ExecOptions = {},
  callback?: (proc: ChildProcess) => void,
) {
  const siteConfig = await resolveSiteConfig(site);
  const flakeDir = getConfigSiteDir(siteConfig.project);

  return runNixDevelop(flakeDir, args, options, callback);
}

export async function runNixDevelop(
  flakeDir: string,
  args = '',
  options: ExecOptions = {},
  callback?: (proc: ChildProcess) => void,
) {
  const cmd = `nix develop path:${flakeDir} --impure ${args}`.trim();

  return options.detached === true ? execDetached(cmd, options, callback) : execAttached(cmd, options, callback);
}
