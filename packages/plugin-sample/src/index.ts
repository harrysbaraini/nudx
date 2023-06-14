import { Plugin, ServiceSiteConfig } from '@nudx/cli'
import { join } from 'node:path'

interface Config extends ServiceSiteConfig {
  buckets: string[]
  port: string
}

const serviceId = 'sampleId'

export default {
  install(cli) {
    cli.registerService({
      id: serviceId,
      async onCreate() {
        return {
          name: await cli.prompts.input({
            message: 'Your Name',
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
