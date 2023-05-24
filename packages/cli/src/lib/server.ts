import { fileExists, readJsonFile, writeFile } from './filesystem';
import { CLICONF_CADDY_API_URL, CLICONF_CADDY_PATH, CLICONF_FLAKE_FILE, CLICONF_SERVER } from './flags';
import { CliSettings, Dictionary, Site } from './types';
import { Renderer } from './templates';
import serverFlakeTpl from '../templates/serverFlake.tpl';
import { runNixDevelop } from './nix';
import { CLIError } from '@oclif/core/lib/errors';

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
  environment?: Dictionary<string | number | boolean>,
  processes: ProcessComposeProcess[],
}

export interface ProcessComposeProcess {
  name: string;
  script: string;
  on_build?: string;
  on_start?: string;
  after_start?: string;
  interpreter: 'none';
  instance_var: string;
  error_file: string;
  out_file: string;
  pid_file: string;
  env?: Dictionary<string>;
}

export type CaddyRoute = Dictionary & { '@id': string; };

export interface CaddySiteConfig {
  id: string;
  ports: string[];
  routes: CaddyRoute[];
}

export interface CaddyServerConfig {
  listen: string[];
  routes: CaddyRoute[];
}

export interface CaddyConfig {
  apps: {
    http: {
      servers: Dictionary<CaddyServerConfig>;
    };
  };
}

export async function updateCaddyConfig(id: string, config: CaddyConfig) {
  let tries = 5;
  const interval = 1000;

  const intervalInst = setInterval(async () => {
    try {
      const response = await fetch(`${CLICONF_CADDY_API_URL}/load`, {
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

        throw new CLIError(`Error: [${response.status}] ${response.statusText}`);
      }

      clearInterval(intervalInst);
    } catch (err) {
      if (tries === 0) {
        clearInterval(intervalInst);
        throw new CLIError('Timeout: is server running?');
      }

      tries--;
    }
  }, interval);
}

export async function buildFlakeFile(force = false) {
  if (force || !fileExists(CLICONF_FLAKE_FILE)) {
    const flake = Renderer.build(serverFlakeTpl, {
      caddyPath: CLICONF_CADDY_PATH,
    });

    await writeFile(CLICONF_FLAKE_FILE, flake);

    await runNixDevelop(CLICONF_SERVER, '--command bash -c "echo \"Dependencies installed!\""', {
      cwd: CLICONF_SERVER,
      stdio: 'ignore',
    });
  }
}

export async function isServerRunning() {
  try {
    const response = await fetch(`${CLICONF_CADDY_API_URL}/config`);
    return response.status === 200;
  } catch {
    return false;
  }
}

export async function generateCaddyConfig(
  cliSettings: CliSettings,
  siteConfigs: Site[],
): Promise<CaddyConfig> {
  const routes: CaddyRoute[] = [];

  for (const siteConfig of siteConfigs) {
    if (fileExists(siteConfig.serverConfigPath)) {
      routes.push(
        ...(await readJsonFile<CaddyRoute[]>(siteConfig.serverConfigPath))
      );
    }
  }

  return getServerConfig(cliSettings, routes);
}

function getServerConfig(cliSettings: CliSettings, routes: CaddyRoute[] = []): CaddyConfig {
  return {
    apps:
    {
      http:
      {
        servers: {
          web: {
            listen: cliSettings.server.ports,
            routes,
          }
        }
      }
    }
  };
}
