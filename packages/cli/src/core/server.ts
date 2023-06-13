import { CLIError } from '@oclif/core/lib/errors';
import { join } from 'path';
import serverFlakeTpl from '../templates/serverFlake.tpl';
import { createDirectory, fileExists, readJsonFile, writeFile } from './filesystem';
import { Dictionary, Json } from './interfaces/generic';
import { CaddyConfig, CaddyRoute, ServerPlugin } from './interfaces/server';
import { runNixDevelop } from './nix';
import { startProcess } from './pm2';
import { SiteHandler } from './sites';
import { Renderer } from './templates';

export class Server {
  private isSetup = false;
  private baseDir: string;
  private stateDir: string;
  private flakeFile: string;
  private binPath: string;
  private caddyConfigFile: string;
  private ports: string[];
  private plugins: ServerPlugin[] = [];

  private caddyApiUrl: string = 'http://127.0.0.1:2019';
  private maxTries = 5;

  public constructor(ports: string[], dataPath: string) {
    if (this.isSetup) {
      throw new Error('Server Class Instance already setup');
    }

    this.ports = ports;
    this.baseDir = join(dataPath, 'server');
    this.stateDir = join(this.baseDir, 'state');
    this.flakeFile = join(this.baseDir, 'flake.nix');
    this.binPath = join(this.baseDir, 'bin');
    this.caddyConfigFile = join(this.stateDir, 'caddy.json');

    // By creating the state dir, we also ensure baseDir exists.
    if (!fileExists(this.stateDir)) {
      createDirectory(this.stateDir);
    }
  }

  public async ensureInstalled() {
    if (!fileExists(this.flakeFile)) {
      console.info('Installing server dependencies...');
      await this.buildFlakeFile();
    }

    await this.runNixCmd('echo "Server OK!"');
  }

  public start(sites: SiteHandler[]) {
    return new Promise(async (resolve, reject) => {
      await this.buildFlakeFile();

      await startProcess({
        name: 'nudx-server',
        script: `${this.binPath}/caddy run --config ${this.caddyConfigFile}`,
        interpreter: 'none',
        instance_var: 'nudx-server',
        error_file: join(this.stateDir, '.server-error.log'),
        out_file: join(this.stateDir, '.server-out.log'),
        pid_file: join(this.stateDir, '.server.pid'),
      });

      let attempt = 1;
      const intervalId = setInterval(async () => {
        try {
          await this.callCaddyApi('POST', 'load', (await this.generateCaddyConfig(sites)) as unknown as Json);
          clearInterval(intervalId);

          resolve(true);
        } catch (err) {
          if (attempt === 5) {
            throw new Error('Failed to load Server config: ' + err);
          }

          attempt++;

          reject(false);
        }
      }, 2000);
    });
  }

  public runNixCmd(cmd: string, opts: Dictionary<unknown> = {}) {
    return runNixDevelop(this.baseDir, `--command bash -c '${cmd}'`, {
      cwd: this.baseDir,
      ...opts,
    });
  }

  public addPlugin(plugin: ServerPlugin) {
    this.plugins.push(plugin);
    return this;
  }

  protected async updateCaddyConfig(id: string, config: CaddyConfig) {
    let tries = this.maxTries;
    const interval = 1000;

    const intervalInst = setInterval(async () => {
      try {
        const response = await fetch(`${this.caddyApiUrl}/load`, {
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

  public async buildFlakeFile(force = false) {
    if (force || !fileExists(this.flakeFile)) {
      const plugins = [];

      for (const plugin of this.plugins) {
        plugins.push({
          id: plugin.id,
          nixFile: plugin.nixFile,
          config: JSON.stringify(await plugin.onBuild()),
        });
      }

      const flake = Renderer.build(serverFlakeTpl, {
        plugins,
        binPath: this.binPath,
        generatedAt: new Date().toISOString(),
      });

      await writeFile(this.flakeFile, flake);
      await this.runNixCmd('echo "Dependencies installed!"');
    }
  }

  public async isRunning() {
    try {
      const response = await fetch(`${this.caddyApiUrl}/config`);
      return response.status === 200;
    } catch {
      return false;
    }
  }

  public async loadRoutes(routes: CaddyRoute[]) {
    const response = await this.callCaddyApi('PATCH', 'config/apps/http/servers/web/routes', routes);
    return response.ok;
  }

  public async unloadRoutes(routes: CaddyRoute[]) {
    for (const route of routes) {
      const response = await this.callCaddyApi('DELETE', `id/${route['@id']}`, {});
      return response.ok;
    }
  }

  public async generateCaddyConfig(siteConfigs: SiteHandler[]): Promise<CaddyConfig> {
    const routes: CaddyRoute[] = [];

    for (const siteConfig of siteConfigs) {
      if (fileExists(siteConfig.config.serverConfigPath)) {
        routes.push(...(await readJsonFile<CaddyRoute[]>(siteConfig.config.serverConfigPath)));
      }
    }

    return {
      apps: {
        http: {
          servers: {
            web: {
              listen: this.ports.map((port) => `:${port}`),
              routes: [],
            },
          },
        },
      },
    };
  }

  protected async callCaddyApi(method: string, endpoint: string, body: Json) {
    return await fetch(`${this.caddyApiUrl}/${endpoint}`, {
      method,
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
