import { Command, Flags, Interfaces } from '@oclif/core'
import { PJSON } from '@oclif/core/lib/interfaces'
import { dirname, join } from 'path'
import { CliInstance } from './cli'
import { createDirectory, deleteFile, fileExists, readJsonFile, writeJsonFile } from './filesystem'
import { CliFile, CliNodePackage } from './interfaces/cli'
import { Server } from './server'
import chalk from 'chalk'

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
    for (const plugin of this.config.plugins) {
      if ((plugin.pjson as PJSON.CLI).oclif.scope === 'nudx') {
        const imported = await import(plugin.root) as CliNodePackage

        if (! imported.plugin) {
          this.error(`Plugin ${plugin.name} is not a valid NUDX plugin`)
        }

        if (imported.plugin.install) {
          await imported.plugin.install(this.cliInstance)
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
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    this.log( chalk.red(`[${err.name}] ${err.message}`))

    return Promise.resolve(err)
  }

  protected async finally(_: Error | undefined): Promise<unknown> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }
}
