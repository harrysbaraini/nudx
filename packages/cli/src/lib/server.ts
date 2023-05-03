import { join } from 'path';
import { createDirectory, fileExists, readJsonFile, writeFile, writeYamlFromJson } from './filesystem';
import { CADDY_API, CLICONF_SERVER, CLICONF_SERVER_CONFIG, CLICONF_SERVER_STATE } from './flags';
import { CliSettings, Dictionary, Site } from './types';
import { Renderer } from './templates';
import serverFlakeTpl from '../templates/serverFlake.tpl';

// @todo Not used - but here in case we decide to use process-compose instead of overmind
interface ProcessComposeProbe {
  http_get?: {
    host: string;
    scheme: string;
    path: string;
    port: number;
  },
  exec?: {
    command: string;
  },
  initial_delay_seconds?: number;
  period_seconds?: number;
  timeout_seconds?: number;
  success_threshold?: number;
  failure_threshold?: number;
}

// @todo Not used - but here in case we decide to use process-compose instead of overmind
export interface ProcessComposeProcessFile {
  environment?: string[],
  processes: Dictionary<ProcessComposeProcess>,
}

export interface ProcessComposeProcess {
  command: string;
  is_daemon?: boolean;
  availability?: {
    restart: 'on_failure' | 'exit_on_failure' | 'always' | 'no';
    backoff_seconds?: number;
    max_restarts?: number;
  },
  depends_on?: Dictionary<{
    condition: 'process_completed_successfully' | 'process_completed' | 'process_healthy' | 'process_started';
  }>,
  shutdown?: {
    command: string;
    signal?: number;
    timeout_seconds?: number;
  },
  readiness_probe?: ProcessComposeProbe,
  liveness_probe?: ProcessComposeProbe,
};

export type CaddyRoute = Dictionary & { '@id': string; };

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

export async function buildFlakeFile(settings: CliSettings, sites: Site[], force = false) {
  const serverFlakeFile = join(CLICONF_SERVER_CONFIG, 'flake.nix');

  if (!fileExists(CLICONF_SERVER_CONFIG)) {
    await createDirectory(CLICONF_SERVER_CONFIG);
  }

  if (force || !fileExists(serverFlakeFile)) {
    const ports = settings.server.listen
      .map((str) => `"${str}"`)
      .join(',');

    await writeFile(
      serverFlakeFile,
      Renderer.build(serverFlakeTpl, {
        basicCaddyConfig: `{"apps":{"http":{"servers":{"srvHttp":{"listen": [${ports}],"routes": []}}}}}`,
        statePath: CLICONF_SERVER_STATE,
        configPath: CLICONF_SERVER_CONFIG,
        sites,
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

export function getServerConfig(cliSettings: CliSettings, routes: CaddyRoute[] = []): CaddyConfig {
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
  }
}

export async function generateCaddyConfig(
  cliSettings: CliSettings,
  siteConfigs: Site[],
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

  return getServerConfig(cliSettings, routes);
}
