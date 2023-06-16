import { Flags } from '@oclif/core'
import { BaseCommand } from '../core/base-command.js'
import { CliFile } from '../core/interfaces/cli.js'
import { disconnectProcess } from '../core/pm2.js'
import { SiteHandler } from '../core/sites.js'
import Shutdown from './down.js'
import Start from './site/start.js'

export default class Up extends BaseCommand<typeof Up> {
  static description = 'Initialize the server and all configured sites'
  static examples = ['<%= config.bin %> <%= command.id %>']

  static flags = {
    verbose: Flags.boolean({ char: 'v' }),
  }

  async run(): Promise<unknown> {
    if (await this.cliInstance.getServer().isRunning()) {
      this.warn('Server is already running')
      return this.exit(1)
    }

    interface Ctx {
      sites: SiteHandler[];
      settings: CliFile;
    }

    interface UpCtx extends Ctx {
      sites: SiteHandler[];
    }

    await this.cliInstance.makeTaskList<UpCtx>(
      [
        {
          title: 'Load settings',
          task: async (ctx) => {
            const sites = this.cliInstance.getSites()

            const loadedSites = await Promise.all(
              Object.keys(sites)
                .filter((site: string) => !sites[site].disabled)
                .map((site) => SiteHandler.loadByPath(site, this.cliInstance))
            )

            ctx.sites = loadedSites.filter((site) => site.definition.autostart)
          },
        },
        {
          title: 'Start server',
          task: () => this.cliInstance.getServer().start()
        },

        {
          title: 'Load sites',
          enabled: ctx => ctx.sites.length > 0,
          task: ctx => {
            return this.cliInstance.makeConcurrentTaskList(
              ctx.sites.map((site: SiteHandler) => {
                return {
                  title: site.config.id,
                  enabled: () => site.definition.autostart,
                  task: async () => {
                    await Start.run(['--site', site.config.definition.project])
                  },
                }
              })
            )
          },
        },
      ]
    )

    disconnectProcess()
  }

  async catch(): Promise<void> {
    await Shutdown.run()
    disconnectProcess()
  }
}
