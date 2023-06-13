import { CliInstance } from '@nudx/cli/lib/core/cli'
import { ServiceSiteConfig } from '@nudx/cli/lib/core/interfaces/services'
import { join } from 'node:path'

interface Config extends ServiceSiteConfig {
  port: number | string
}

const SERVICE_ID = 'redis'
const DEFS = {
  port: '6379',
}

export function install(cli: CliInstance) {
  cli.registerService({
    id: SERVICE_ID,
    async onCreate() {
      const opts = await cli.prompt([
        {
          type: 'input',
          name: 'port',
          message: 'Redis Port',
          default: DEFS.port,
        },
      ])

      return opts
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
