import { Flags } from '@oclif/core'
import { BaseCommand } from '../core/base-command.js'
import { CliFile } from '../core/interfaces/cli.js'
import { disconnectProcess } from '../core/pm2.js'
import { SiteHandler } from '../core/sites.js'
import Shutdown from './down.js'
import Start from './site/start.js'
import { TaskList, TaskObject } from '../core/tasks.js'

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

    await new TaskList<UpCtx>(
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
          title: 'Auto start sites',
          enabled: ctx => Boolean(ctx?.sites?.length),
          task: (ctx, task) => TaskList.subTasks<Ctx>(
            task as TaskObject<Ctx>,
            ctx.sites.map((site: SiteHandler) => {
              return {
                title: site.config.id,
                enabled: () => site.definition.autostart,
                task: async () => {
                  await Start.run(['--site', site.config.definition.project])
                },
              }
            })
          ).build()
        }
      ]
    ).run()

    disconnectProcess()
  }

  async catch(): Promise<void> {
    await Shutdown.run()
    disconnectProcess()
  }
}
