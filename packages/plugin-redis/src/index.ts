import { Plugin, ServiceSiteConfig } from '@nudx/cli'
import { join } from 'node:path'

interface Config extends ServiceSiteConfig {
  port: number | string
}

const SERVICE_ID = 'redis'
const DEFS = {
  port: '6379',
}

export const plugin: Plugin = {
  install(cli) {
    cli.registerService({
      id: SERVICE_ID,
      async onCreate() {
        return {
          port: await cli.prompts.input({
            message: 'Redis Port',
            default: DEFS.port,
          }),
        }
      },

      onBuild(options: Config, site) {
        const dataDir = join(site.statePath, SERVICE_ID)

        options = { ...DEFS, ...options }

        return Promise.resolve({
          nix: {
            file: join(__dirname, '..', 'files', `${SERVICE_ID}.nix`),
            config: {
              statePath: site.statePath,
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
