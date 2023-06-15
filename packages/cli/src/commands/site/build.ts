import { Flags } from '@oclif/core'
import { join } from 'path'
import { BaseCommand } from '../../core/base-command.js'
import { createDirectory, deleteDirectory, fileExists, writeFile, writeJsonFile } from '../../core/filesystem.js'
import { CLICONF_ENV_PREFIX } from '../../core/flags.js'
import { Dictionary, Task } from '../../core/interfaces/generic.js'
import { CaddyRoute } from '../../core/interfaces/server.js'
import { ServiceBuildConfig } from '../../core/interfaces/services.js'
import { SiteConfig } from '../../core/interfaces/sites.js'
import { services } from '../../core/services.js'
import { SiteHandler } from '../../core/sites.js'
import { Renderer } from '../../core/templates.js'
import siteEnvrcTpl from '../../templates/siteEnvrc.tpl.js'
import newSiteFlakeTpl from '../../templates/siteFlake.tpl.js'
import sourceEnvrcTpl from '../../templates/sourceEnvrc.tpl.js'
import Reload from '../reload.js'

interface BuildPropsService {
  name: string
  file: string
  config: string
}

export interface BuildProps {
  rootPath: string
  project: SiteConfig
  env: Dictionary<string>
  serverRoutes: CaddyRoute[]
  services: BuildPropsService[]
}

export default class Build extends BaseCommand<typeof Build> {
  static description = 'Build site definition'
  static examples = ['<%= config.bin %> <%= command.id %>', '<%= config.bin %> <%= command.id %> --force']

  static flags = {
    site: Flags.string({ char: 's', require: false }),
    path: Flags.string({ char: 'p', require: false }),
    force: Flags.boolean({ char: 'f' }),
    reload: Flags.boolean({ char: 'r' }),
  }

  async run(): Promise<void> {
    const site = await this.getSite()

    // Site already exists and hash is the same (so nothing changed in dev.json)
    if (!this.flags.force && site.checkHash()) {
      this.logWarning('Site already exists and its dev.json has not changed')
      this.exit(1)
    }

    interface BuildTasksCtx {
      buildProps: BuildProps
    }

    await this.cliInstance.makeTaskList<BuildTasksCtx>(
      [
        {
          title: 'Gather services',
          task: async (ctx) => {
            // Build project files
            const buildProps: BuildProps = {
              rootPath: this.config.home,
              project: {
                ...site.config,
              },
              env: {
                APP_MAIN_HOST: site.config.definition.hosts[0],
              },
              serverRoutes: [],
              services: [],
            }

            for (const [srvKey, srvConfig] of Object.entries<Dictionary>(site.config.definition.services)) {
              if (!services.has(srvKey)) {
                this.error(`${srvKey} is not a valid service!`)
              }

              if ('enable' in srvConfig && srvConfig.enable === false) {
                return
              }

              const srv = services.get(srvKey)
              const builtSrv: ServiceBuildConfig = await srv.onBuild(srvConfig, site.config)

              if (builtSrv.serverRoutes) {
                buildProps.serverRoutes.push(...builtSrv.serverRoutes)
              }

              buildProps.services.push({
                name: srvKey,
                file: builtSrv.nix.file,
                config: JSON.stringify(builtSrv.nix.config),
              })
            }

            ctx.buildProps = buildProps
          },
        },

        {
          title: 'Generate configuration files',
          task: async (ctx) => {
            // Clean up
            // @todo Instead of deleting, we could back up all site folder, so if something goes wrong
            //       we just revert it? We could even have a revision system.
            if (fileExists(site.config.configPath)) {
              deleteDirectory(site.config.configPath, {
                force: true,
              })
            }

            // Now we will ensure the required directories exist
            createDirectory(site.config.configPath)

            // Generate the Flake file
            const flakeContent = Renderer.build(newSiteFlakeTpl, {
              ...(ctx.buildProps as unknown as Dictionary),
              envPrefix: CLICONF_ENV_PREFIX,
              cliNix: join(this.config.root, 'files', 'cli.nix'),
              generatedAt: new Date().toISOString(),
            })

            await writeFile(site.config.flakePath, flakeContent)

            // Generate caddy server configuration
            if (fileExists(site.config.serverConfigPath)) {
              deleteDirectory(site.config.serverConfigPath)
            }

            await writeJsonFile(site.config.serverConfigPath, ctx.buildProps.serverRoutes)

            // Generate .envrc

            await writeFile(
              site.config.envrcPath,
              Renderer.build(siteEnvrcTpl, {
                flakeDir: site.config.configPath,
                flakePath: site.config.flakePath,
                statePath: site.config.statePath,
              }),
            )

            if (!fileExists(site.config.sourceEnvrcPath)) {
              await writeFile(
                site.config.sourceEnvrcPath,
                Renderer.build(sourceEnvrcTpl, {
                  envrcPath: site.config.envrcPath,
                }),
              )
            }

            // Finally update the cli settings fil
            const siteSettings = {
              hash: site.config.hash,
              project: site.config.definition.project,
              group: site.config.definition.group,
            }

            await this.cliInstance.updateSiteSettings(site.config.projectPath, siteSettings)
          },
        },

        {
          title: 'Build site dependencies',
          task: async () => {
            await site.runNixCmd('echo "Site dependencies built"')

            const postBuildSite = await SiteHandler.loadByPath(site.config.projectPath, this.cliInstance)

            await this.cliInstance.makeConcurrentTaskList(
              postBuildSite.config.processesConfig.processes.map((proc): Task => {
                return {
                  title: `on_build hook > ${proc.name}`,
                  enabled: () => Boolean(proc.on_build),
                  task: async () => site.runNixCmd(`run_hooks ${proc.on_build?.toString() || ''}`),
                }
              }),
            )
          },
        },

        {
          title: 'Load site hosts',
          task: async (ctx) => {
            const allHosts = site.config.definition.hosts

            ctx.buildProps.serverRoutes.forEach((route) => {
              route.match.forEach((match) => {
                allHosts.push(...match.host)
              })
            })

            return this.cliInstance
              .getServer()
              .runNixCmd(`create_hosts_profile ${site.config.id} ${allHosts.join(' ')}`, {
                stdio: 'ignore',
              })
          },
        },

        {
          title: 'Reload NUDX Server',
          enabled: () => this.flags.reload,
          task: async () => {
            await Reload.run()
          },
        },
      ]
    )

    this.logSuccess('Site configuration completed!')
    this.exit(0)
  }

  private getSite(): Promise<SiteHandler> {
    if (this.flags.path) {
      return SiteHandler.loadByPath(this.flags.path, this.cliInstance)
    }

    return SiteHandler.load(this.flags.site, this.cliInstance)
  }
}
