import * as crypto from 'node:crypto';
import * as path from 'node:path';
import { deleteFile, fileExists, readJsonFile, writeJsonFile } from './filesystem';
import { CLICONF_SETTINGS, CLICONF_SITES } from './flags';
import { CliSettings, CliSettingsSites, Site, SiteDefinition } from './types';

const currentIp = '127.100.100.1';

export async function loadSettings(): Promise<CliSettings> {
  if (!fileExists(CLICONF_SETTINGS)) {
    await writeJsonFile(CLICONF_SETTINGS, {
      server: {
        host: '127.0.0.1',
        ports: [80, 443],
      },
      sites: {},
    });
  }

  try {
    const settings = (await readJsonFile(CLICONF_SETTINGS)) as unknown as CliSettings;

    if (!settings?.server?.ports || !settings.sites) {
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
  const sitePath = path.join(CLICONF_SITES, config.project);
  const configPath = path.join(sitePath, 'config');

  return {
    id: (config.group
      ? config.group + '-'
      : '') + config.project.replace('_', '-'),
    definition: config,
    project: config.project,
    projectPath,
    configPath,
    statePath: path.join(sitePath, 'state'),
    serverConfigPath: path.join(configPath, 'server.json'),
    flakePath: path.join(configPath, 'flake.nix'),
    shellenvPath: path.join(configPath, 'shellenv'),
    envrcPath: path.join(configPath, '.envrc'),
    sourceEnvrcPath: path.join(projectPath, '.envrc'),
    mainHost: config.hosts[0],
    hash: configHash,
    ip: '127.100.100.1',
  };
}

export async function loadSiteConfigCollection(sites: CliSettingsSites): Promise<Site[]> {
  return await Promise.all(Object.keys(sites).filter((site: string) => !sites[site].disabled).map((site) => loadSiteConfig(site)));
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
