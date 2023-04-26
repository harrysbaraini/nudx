import { resolve } from 'path';
import { buildServerFlake } from '../stubs/server-nix';
import { fileExists, readJsonFile, writeFile } from './filesystem';
import { CADDY_API, CLICONF_SERVER, CLICONF_STATE } from './flags';
import { CliSettings, Dictionary, Json, Site } from './types';

export interface CaddyRoute extends Dictionary {}

export interface CaddySiteConfig extends Site {
  socket?: string;
}

export interface CaddyConfig {
  apps: {
    http: {
      servers: Dictionary<{
        listen: string[];
        routes: CaddyRoute[];
      }>;
    };
  };
}

export async function updateCaddyConfig(config: CaddyConfig) {
  let tries = 5;
  const interval = 1000;

  const intervalInst = setInterval(async () => {
    try {
      const response = await fetch(`${CADDY_API}/load`, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        method: 'POST',
        body: JSON.stringify(config),
      });

      if (!response.ok) {
        if (response.status === 400) {
          tries = 0;
        }

        throw new Error(`Error: [${response.status}] ${response.statusText}`);
      }

      clearInterval(intervalInst);
    } catch (err) {
      if (tries === 0) {
        clearInterval(intervalInst);
        throw new Error('Timeout: is server running?');
      }

      tries--;
    }
  }, interval);
}

export async function buildFlakeFile(force = false) {
  const serverFlakeFile = resolve(CLICONF_SERVER, 'flake.nix');

  if (!fileExists(serverFlakeFile)) {
    await writeFile(
      serverFlakeFile,
      buildServerFlake({
        statePath: CLICONF_STATE,
      }),
    );
  }
}

export async function isServerRunning() {
  try {
    const response = await fetch(`${CADDY_API}/config`);
    return response.status === 200;
  } catch {}

  return false;
}

export async function generateCaddyConfig(
  cliSettings: CliSettings,
  siteConfigs: CaddySiteConfig[],
): Promise<CaddyConfig> {
  const routes: CaddyRoute[] = [];

  for (let siteConfig of siteConfigs) {
    if (!fileExists(siteConfig.virtualHostsPath)) {
      throw new Error(
        'Virtual Hosts file not found in project config path. Rebuild the project:  "devl build --force"',
      );
    }

    routes.push(...((await readJsonFile(siteConfig.virtualHostsPath)) as CaddyRoute[]));
  }

  return {
    apps: {
      http: {
        servers: {
          srvHttp: {
            listen: cliSettings.server.listen,
            routes,
          },
        },
      },
    },
  };
}
