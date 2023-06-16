import { Flags } from '@oclif/core'
import { CommandError } from '@oclif/core/lib/interfaces/index.js'
import { BaseCommand } from '../../core/base-command.js'
import { fileExists, readJsonFile } from '../../core/filesystem.js'
import { CaddyRoute } from '../../core/interfaces/server.js'
import { disconnectProcess, startProcess } from '../../core/pm2.js'
import { SiteHandler } from '../../core/sites.js'
import { Task, TaskContext } from '../../core/interfaces/generic.js'

export default class Start extends BaseCommand<typeof Start> {
  static description = 'Start site'
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
      // @todo Ask if user wants to start nudx...
      this.error('Nudx Server is not running. Run `nudx up` first.')
    }

    const site = await this.getSite()

    // ---
    // @todo Check if site needs to be rebuilt and inform user about it, asking if they want to rebuild it.
    // ---
    if (
      this.cliInstance.getSites()[site.config.projectPath].hash !== site.config.hash
      || !fileExists(site.config.flakePath)
    ) {
      this.error('Site dependencies are not built')
    }

    interface StartTasksCtx extends TaskContext {
      serverRoutes: CaddyRoute[]
    }

    await this.cliInstance.makeTaskList<StartTasksCtx>(
      site.config.processesConfig.processes
        .map<Task<StartTasksCtx>>((proc) => {
          return {
            title: `Start ${proc.name}`,
            task: async () => {
              if (proc.on_start) {
                await site.runNixCmd(`run_hooks ${proc.on_start}`)
              }

              await startProcess(proc)

              if (proc.after_start) {
                await site.runNixCmd(`run_hooks ${proc.after_start}`)
              }
            },
          }
        })
        .concat([
          {
            title: 'Load server routes',
            enabled: () => fileExists(site.config.serverConfigPath),
            task: async (ctx) => {
              ctx.serverRoutes = await readJsonFile<CaddyRoute[]>(site.config.serverConfigPath)

              await this.server.loadRoutes(ctx.serverRoutes)
            },
          },
          {
            title: 'Load hosts',
            task: async (ctx) => {
              const allHosts: string[] = []
              ctx.serverRoutes.forEach((route) => {
                route.match.forEach((match) => {
                  allHosts.push(...match.host)
                })
              })

              await this.cliInstance
                .getServer()
                .runNixCmd(`create_hosts_profile ${site.config.id} ${allHosts.join(' ')}`, {
                  stdio: 'ignore',
                })
            },
          },
        ])
    )

    this.logSuccess('Site started!')
  }

  catch(err: CommandError) {
    disconnectProcess()

    return super.catch(err)
  }
}
