import { Config } from '@oclif/core/lib/interfaces/index.js'
import { join } from 'path'
import { writeJsonFile } from './filesystem.js'
import { CliFile, CliSite } from './interfaces/cli.js'
import { ServerPlugin } from './interfaces/server.js'
import { ServiceDefinition, Services } from './interfaces/services.js'
import { Server } from './server.js'
import { services } from './services.js'
import { Listr } from 'listr2'
import prompts from './prompts.js'
import { Task, TaskContext, TaskListRenderer } from './interfaces/generic.js'

export class CliInstance {
  private oclifConfig: Config

  /** settings.json file */
  private settingsFilePath: string
  private settings: CliFile

  /** Server instance */
  private server: Server

  private services: Services

  public prompts: typeof prompts = prompts

  /**
   * Set up the class instance.
   * @param config
   */
  public constructor(config: Config, server: Server, settings: CliFile, settingsFilePath: string) {
    this.settingsFilePath = settingsFilePath
    this.settings = settings
    this.oclifConfig = config
    this.services = services
    this.server = server
  }

  /**
   * Path to the settings.json file.
   * @returns
   */
  public getSettingsFilePath(): string {
    return this.settingsFilePath
  }

  /**
   * Generate a path relative to the data directory.
   * @param path
   * @returns
   */
  public getDataPath(path?: string): string {
    if (!path) {
      return this.oclifConfig.dataDir
    }

    return join(...[this.oclifConfig.dataDir, ...path.split('/')])
  }

  /**
   * Get settings read from the settings.json file.
   * @returns
   */
  public getSettings() {
    return this.settings
  }

  /**
   * Get sites read from the settings.json file.
   * @returns
   */
  public getSites() {
    return this.settings.sites
  }

  /**
   * Get server instance.
   * @returns Server
   */
  public getServer(): Server {
    return this.server
  }

  public registerServerPlugin(plugin: ServerPlugin) {
    this.server.addPlugin(plugin)
    return this
  }

  public registerService(service: ServiceDefinition) {
    this.services.register(service.id, service)
    return this
  }

  /**
   * Get registered services.
   * @returns Services
   */
  public getServices(): Services {
    return this.services
  }

  /**
   * Update settings.json file.
   * @param projectPath
   * @param settings
   * @returns
   */
  public updateSiteSettings(projectPath: string, settings: CliSite): Promise<void> {
    this.settings.sites[projectPath] = settings

    return writeJsonFile(this.getSettingsFilePath(), this.settings)
  }

  /**
   * Create a new Listr instance.
   * @param tasks
   * @returns
   */
  public async makeTaskList<Ctx = TaskContext>(tasks: Task<Ctx>[], renderer: TaskListRenderer = 'verbose'): Promise<Ctx> {
    return await (new Listr(tasks, { renderer })).run()
  }

  /**
   * Create a new Listr instance.
   * @param tasks
   * @returns
   */
  public async makeConcurrentTaskList<Ctx = TaskContext>(tasks: Task<Ctx>[], renderer: TaskListRenderer = 'verbose'): Promise<Ctx> {
    return await (new Listr(tasks, { concurrent: true, renderer })).run()
  }
}
