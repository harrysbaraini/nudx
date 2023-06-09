import { Plugin, ServiceSiteConfig } from '@nudx/cli'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

interface Config extends ServiceSiteConfig {
  buckets: string[]
  port: string
}

const serviceId = 'sampleId'

export const plugin: Plugin = {
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
}
