import { Command, Flags, Interfaces } from '@oclif/core'
import { PJSON } from '@oclif/core/lib/interfaces/index.js'
import { dirname, join } from 'path'
import chalk from 'chalk'
import { createRequire } from 'module'
import { CliInstance } from './cli.js'
import { createDirectory, deleteFile, fileExists, readJsonFile, writeJsonFile } from './filesystem.js'
import { CliFile } from './interfaces/cli.js'
import { Server } from './server.js'
import { Plugin } from './interfaces/plugin.js'
import { exitCode } from 'process'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<T['flags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

export abstract class BaseCommand<T extends typeof Command> extends Command {
  // add the --json flag
  static enableJsonFlag = true
  protected flags!: Flags<T>
  protected args!: Args<T>

  public server!: Server
  public cliInstance!: CliInstance

  static examples = ['<%= config.bin %> <%= command.id %>']

  public async init(): Promise<void> {
    await super.init()

    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    })

    this.flags = flags as Flags<T>
    this.args = args as Args<T>

    // Create the CLI Instance and ensure it is properly installed
    const settingsFilePath = join(this.config.dataDir, 'settings.json')

    if (!fileExists(settingsFilePath)) {
      const settingsDir = dirname(settingsFilePath)
      if (!fileExists(settingsDir)) {
        createDirectory(settingsDir)
      }

      await writeJsonFile(this.cliInstance.getSettingsFilePath(), {
        server: {
          host: '127.0.0.1',
          ports: [80, 443],
        },
        sites: {},
      })
    }

    const settings = (await readJsonFile(settingsFilePath)) as unknown as CliFile

    if (!settings?.server?.ports || !settings.sites) {
      await deleteFile(settingsFilePath)
      this.error('Configuration file is blank or corrupted. We will delete it so you can run nudx.')
    }

    this.server = new Server(settings.server.ports, this.config.dataDir)
    this.cliInstance = new CliInstance(this.config, this.server, settings, settingsFilePath)

    // Initialize specific NUDX plugins
    const searchPluginObj = (mod: { plugin?: Plugin; default?: Plugin; }): Plugin | undefined => {
      if (mod.plugin?.install) {
        return mod.plugin
      }
      if (mod.default && typeof mod.default?.install) {
        return mod.default;
      }
      return undefined
    }

    for (const plugin of this.config.plugins) {
      if ((plugin.pjson as PJSON.CLI).oclif.scope === 'nudx') {
        // @todo By using require.resolve, plugin's package.json must have the "main" property set to the entry point.
        //       We should find a way to load the plugin without this requirement.
        const require = createRequire(import.meta.url)
        const module = await import(require.resolve(plugin.root)) as Plugin

        const pluginObj = searchPluginObj(module as { plugin?: Plugin; default?: Plugin; })

        if (! pluginObj) {
          this.error(`Plugin ${plugin.name} is not a valid NUDX plugin`)
        }

        if (pluginObj.install) {
          await pluginObj.install(this.cliInstance)
        }
      }
    }

    // Ensure server is properly installed
    try {
      await this.cliInstance.getServer().ensureInstalled()
    } catch (err: unknown) {
      this.error(`Failed to ensure server is properly installed: ${err?.toString() || 'unknown error'}`)
    }
  }

  protected catch(err: Error & { exitCode?: number }): Promise<unknown> {
    if (exitCode) {
      this.logError(err.message)
    }

    return Promise.resolve()
  }

  protected async finally(_: Error | undefined): Promise<unknown> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }

  protected logSuccess(message: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    this.log(chalk.green(message))
  }

  protected logWarning(message: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    this.log(chalk.yellow(`[WARNING]: ${message}`))
  }

  protected logError(message: string) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
    this.log(chalk.bold.red(`[ERROR]: ${message}`))
  }
}
