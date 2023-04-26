import * as crypto from 'node:crypto';
import * as path from 'node:path';
import { deleteFile, fileExists, readJsonFile, writeJsonFile } from './filesystem';
import { CLICONF_SETTINGS, CLICONF_SITES, CLICONF_STATE } from './flags';
import { CliSettings, CliSettingsSites, Json, Site, SiteDefinition } from './types';

export function getConfigStateDir(site: string): string {
  return path.resolve(CLICONF_STATE, site);
}

export function getConfigSiteDir(site: string): string {
  return path.resolve(CLICONF_SITES, site);
}

export async function loadSettings(): Promise<CliSettings> {
  if (!fileExists(CLICONF_SETTINGS)) {
    await writeJsonFile(CLICONF_SETTINGS, {
      server: {
        listen: [':80', ':443'],
      },
      sites: {},
    });
  }

  try {
    const settings = (await readJsonFile(CLICONF_SETTINGS)) as unknown as CliSettings;

    if (!settings?.server?.listen || !settings.sites) {
      throw new Error();
    }

    return settings;
  } catch (err) {
    await deleteFile(CLICONF_SETTINGS);
    throw new Error('Settings file is blank or corrupted. Execute this command again to recreate it.');
  }
}

export async function loadSiteConfig(projectPath: string): Promise<Site> {
  const config = (await readJsonFile(`${projectPath}/dev.json`)) as unknown as SiteDefinition;

  const configHash = hash(JSON.stringify(config));

  return {
    definition: config,
    project: config.project,
    projectPath,
    configPath: getConfigSiteDir(config.project),
    statePath: getConfigStateDir(config.project),
    virtualHostsPath: path.resolve(getConfigSiteDir(config.project), 'virtualHosts.json'),
    flakePath: path.resolve(getConfigSiteDir(config.project), 'flake.nix'),
    mainHost: Object.keys(config.hosts)[0],
    hash: configHash,
  };
}

export async function loadSiteConfigCollection(sites: CliSettingsSites) {
  return await Promise.all(Object.keys(sites).map((site) => loadSiteConfig(site)));
}

export function hash(content: string) {
  return crypto.createHash('md5').update(content).digest('hex');
}

export async function resolveSiteConfig(site: string | null = null): Promise<Site> {
  const settings = await loadSettings();

  const siteConfig = await (async () => {
    if (site) {
      const sitePath = Object.keys(settings.sites).find((s) => settings.sites[s].project === site);

      if (!sitePath) {
        throw new Error('Project name is not registered');
      }

      return loadSiteConfig(sitePath);
    }

    return loadSiteConfig(process.cwd());
  })();

  if (!siteConfig?.project) {
    throw new Error('No project name provided');
  }

  const savedSite = Object.keys(settings.sites).find((site) => settings.sites[site].project === siteConfig.project);

  if (!savedSite) {
    throw new Error('Project name is not registered');
  }

  return siteConfig;
}
