import { CliInstance } from '@nudx/cli/lib/core/cli'
import { join } from 'node:path'

const SERVICE_ID = 'git'

export function install(cli: CliInstance) {
  cli.registerService({
    id: SERVICE_ID,

    onCreate() {
      return Promise.resolve({})
    },

    onBuild() {
      return Promise.resolve({
        nix: {
          file: join(__dirname, '..', 'files', `${SERVICE_ID}.nix`),
          config: {},
        },
      })
    },
  })
}
