import { resolve } from 'path';
import { fileExists, readJsonFile, writeFile } from './filesystem';
import { CADDY_API, CLICONF_SERVER } from './flags';
import { CliSettings, Dictionary, Site } from './types';
import { Renderer } from './templates';
import serverFlakeTpl from '../templates/serverFlake.tpl';

export type CaddyRoute = Dictionary

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
      Renderer.build(serverFlakeTpl, {
        statePath: resolve(CLICONF_SERVER, 'state'),
      }),
    );
  }
}

export async function isServerRunning() {
  try {
    const response = await fetch(`${CADDY_API}/config`);
    return response.status === 200;
  } catch {
    return false;
  }
}

export async function generateCaddyConfig(
  cliSettings: CliSettings,
  siteConfigs: CaddySiteConfig[],
): Promise<CaddyConfig> {
  const routes: CaddyRoute[] = [];

  for (const siteConfig of siteConfigs) {
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
