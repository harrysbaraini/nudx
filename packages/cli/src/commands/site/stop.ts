import { Flags } from '@oclif/core'
import { BaseCommand } from '../../core/base-command.js'
import { fileExists, readJsonFile } from '../../core/filesystem.js'
import { CaddyRoute } from '../../core/interfaces/server.js'
import { stopProcess } from '../../core/pm2.js'
import { SiteHandler } from '../../core/sites.js'
import { Task } from '../../core/interfaces/generic.js'

export default class Stop extends BaseCommand<typeof Stop> {
  static description = 'Stop site'
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %>']

  static flags = {
    site: Flags.string({ char: 's', require: false }),
    path: Flags.string({ char: 'p', require: false }),
  }

  // @todo Refactor because it's duplicated
  private getSite(): Promise<SiteHandler> {
    if (this.flags.path) {
      return SiteHandler.loadByPath(this.flags.path, this.cliInstance)
    }

    return SiteHandler.load(this.flags.site, this.cliInstance)
  }

  async run(): Promise<void> {
    if (! await this.cliInstance.getServer().isRunning()) {
      this.warn('Server is not running')
      this.exit(1)
    }

    const site = await this.getSite()

    await this.cliInstance.makeTaskList(
      site.config.processesConfig.processes
        .map<Task>(proc => {
          return {
            title: `Stop ${proc.name}`,
            task: async () => {
              // @todo Add a before_stop hook

              try {
                await stopProcess(proc)
              } catch (err) {
                this.warn(`[${proc.name}] ${err?.toString() || 'Unknown error'}`)
              }

              // @todo Add a after_stop hook
            },
          }
        })
        .concat([
          {
            title: 'Unload server routes',
            enabled: () => fileExists(site.config.serverConfigPath),
            task: async () => {
              await this.server.unloadRoutes(await readJsonFile<CaddyRoute[]>(site.config.serverConfigPath))
            },
          },
          {
            title: 'Unload hosts',
            task: async () => {
              await this.cliInstance.getServer().runNixCmd(`remove_hosts_profile '${site.config.id}'`, {
                stdio: 'ignore',
              })
            },
          },
        ])
    )

    this.exit(0)
  }
}
