import { Plugin, ServiceSiteConfig } from '@nudx/cli'
import { join } from 'node:path'

interface Config extends ServiceSiteConfig {
  versions: string[]
  port: string
}

const availableVersions = ['19', '18', '16', '14']
const serviceId = 'nodejs'

export default {
  install(cli) {
    cli.registerService({
      id: serviceId,
      async onCreate() {
        return {
          version: await cli.prompts.select({
            message: 'Node.js Version',
            choices: availableVersions.map(value => ({ value })),
            validate: (value: string) => availableVersions.includes(value.trim()),
          })
        }
      },

      onBuild(options: Config, site) {
        const dataDir = join(site.statePath, serviceId)

        return Promise.resolve({
          nix: {
            file: join(__dirname, '..', 'files', `${serviceId}.nix`),
            config: {
              dataDir,
              ...options,
            },
          },
          serverRoutes: [],
        })
      },
    })
  }
} as Plugin
