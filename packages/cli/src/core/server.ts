import { join } from 'path'
import serverFlakeTpl from '../templates/serverFlake.tpl'
import { createDirectory, fileExists, readJsonFile, writeFile } from './filesystem'
import { Dictionary, Json } from './interfaces/generic'
import { CaddyConfig, CaddyRoute, ServerPlugin } from './interfaces/server'
import { runNixDevelop } from './nix'
import { startProcess } from './pm2'
import { SiteHandler } from './sites'
import { Renderer } from './templates'
import { runCallbackWithRetries } from './utils'

export class Server {
  private isSetup = false
  private baseDir: string
  private stateDir: string
  private flakeFile: string
  private binPath: string
  private caddyConfigFile: string
  private ports: string[]
  private plugins: ServerPlugin[] = []

  private caddyApiUrl = 'http://127.0.0.1:2019'
  private maxTries = 5

  public constructor(ports: string[], dataPath: string) {
    if (this.isSetup) {
      throw new Error('Server Class Instance already setup')
    }

    this.ports = ports
    this.baseDir = join(dataPath, 'server')
    this.stateDir = join(this.baseDir, 'state')
    this.flakeFile = join(this.baseDir, 'flake.nix')
    this.binPath = join(this.baseDir, 'bin')
    this.caddyConfigFile = join(this.stateDir, 'caddy.json')

    // By creating the state dir, we also ensure baseDir exists.
    if (!fileExists(this.stateDir)) {
      createDirectory(this.stateDir)
    }
  }

  public async ensureInstalled() {
    if (!fileExists(this.flakeFile)) {
      console.info('Installing server dependencies...')
      await this.buildFlakeFile()
    }

    await this.runNixCmd('echo "Server OK!"')
  }

  public async start(sites: SiteHandler[]) {
    await this.buildFlakeFile()

    await startProcess({
      name: 'nudx-server',
      script: `${this.binPath}/caddy run --config ${this.caddyConfigFile}`,
      interpreter: 'none',
      // eslint-disable-next-line camelcase
      instance_var: 'nudx-server',
      // eslint-disable-next-line camelcase
      error_file: join(this.stateDir, '.server-error.log'),
      // eslint-disable-next-line camelcase
      out_file: join(this.stateDir, '.server-out.log'),
      // eslint-disable-next-line camelcase
      pid_file: join(this.stateDir, '.server.pid'),
    })

    try {
      await this.callCaddyApi('POST', 'load', (await this.generateCaddyConfig(sites)) as unknown as Json)
    } catch (err) {
      throw new Error(`Failed to load Server config.`)
    }
  }

  public runNixCmd(cmd: string, opts: Dictionary<unknown> = {}) {
    return runNixDevelop(this.baseDir, `--command bash -c '${cmd}'`, {
      cwd: this.baseDir,
      ...opts,
    })
  }

  public addPlugin(plugin: ServerPlugin) {
    this.plugins.push(plugin)
    return this
  }

  protected updateCaddyConfig(id: string, config: CaddyConfig) {
    return this.callCaddyApi('POST', 'load', config as unknown as Json, this.maxTries, 2000)
  }

  public async buildFlakeFile(force = false) {
    if (force || !fileExists(this.flakeFile)) {
      const plugins = []

      for (const plugin of this.plugins) {
        plugins.push({
          id: plugin.id,
          nixFile: plugin.nixFile,
          config: JSON.stringify(await plugin.onBuild()),
        })
      }

      const flake = Renderer.build(serverFlakeTpl, {
        plugins,
        binPath: this.binPath,
        generatedAt: new Date().toISOString(),
      })

      await writeFile(this.flakeFile, flake)
      await this.runNixCmd('echo "Dependencies installed!"')
    }
  }

  public async isRunning() {
    try {
      const response = await fetch(`${this.caddyApiUrl}/config`)
      return response.status === 200
    } catch {
      return false
    }
  }

  public async loadRoutes(routes: CaddyRoute[]) {
    const response = await this.callCaddyApi('PATCH', 'config/apps/http/servers/web/routes', routes)
    return response.ok
  }

  public async unloadRoutes(routes: CaddyRoute[]) {
    for (const route of routes) {
      const response = await this.callCaddyApi('DELETE', `id/${route['@id']}`, {})
      return response.ok
    }
  }

  public async generateCaddyConfig(siteConfigs: SiteHandler[]): Promise<CaddyConfig> {
    const routes: CaddyRoute[] = []

    for (const siteConfig of siteConfigs) {
      if (fileExists(siteConfig.config.serverConfigPath)) {
        routes.push(...(await readJsonFile<CaddyRoute[]>(siteConfig.config.serverConfigPath)))
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
    }
  }

  protected callCaddyApi(method: string, endpoint: string, body: Json, retries = 1, interval = 2000) {
    return runCallbackWithRetries<Response>(() => {
      return fetch(`${this.caddyApiUrl}/${endpoint}`, {
        method,
        body: JSON.stringify(body),
        headers: {
          'Content-Type': 'application/json',
        },
      })
    }, retries, interval)
  }
}
