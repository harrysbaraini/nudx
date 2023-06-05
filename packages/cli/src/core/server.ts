import { CLIError } from '@oclif/core/lib/errors';
import { join } from 'path';
import serverFlakeTpl from '../templates/serverFlake.tpl';
import { CliInstance } from './cli';
import { createDirectory, fileExists, readJsonFile, writeFile, writeJsonFile } from './filesystem';
import { Dictionary, Json } from './interfaces/generic';
import { runNixDevelop } from './nix';
import { startProcess } from './pm2';
import { SiteHandler } from './sites';
import { Renderer } from './templates';
import { CaddyConfig, CaddyRoute, CaddyServer } from './interfaces/server';

export class Server {
  private isSetup = false;
  private baseDir: string;
  private stateDir: string;
  private flakeFile: string;
  private binPath: string;
  private caddyConfigFile: string;
  private ports: string[];

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
    if (! fileExists(this.flakeFile)) {
      console.info('Installing server dependencies...');
      await this.buildFlakeFile();
    }

    await this.runNixCmd('echo \"Server OK!\"');
  }

  public async start(sites: SiteHandler[]) {
    await this.buildFlakeFile();

    await writeJsonFile(this.caddyConfigFile, (await this.generateCaddyConfig(sites)) as unknown as Json);

    await startProcess({
      name: 'nudx-server',
      script: `${this.binPath}/caddy run --config ${this.caddyConfigFile}`,
      interpreter: 'none',
      instance_var: 'nudx-server',
      error_file: join(this.stateDir, '.server-error.log'),
      out_file: join(this.stateDir, '.server-out.log'),
      pid_file: join(this.stateDir, '.server.pid'),
    });
  }

  public runNixCmd(cmd: string, opts: Dictionary<unknown> = {}) {
    return runNixDevelop(this.baseDir, `--command bash -c '${cmd}'`, {
      cwd: this.baseDir,
      ...opts,
    });
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
      const flake = Renderer.build(serverFlakeTpl, {
        binPath: this.binPath,
      });

      await writeFile(this.flakeFile, flake);
      await this.runNixCmd('echo \"Dependencies installed!\"');
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
              routes,
            },
          },
        },
      },
    };
  }
}
