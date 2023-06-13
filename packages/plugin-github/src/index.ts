import { CliInstance } from '@nudx/cli/lib/core/cli'
import { join } from 'node:path'

function install(cli: CliInstance) {
  cli.registerServerPlugin({
    id: 'github',
    nixFile: join(__dirname, '..', 'files', 'github.nix'),
    onBuild() {
      return Promise.resolve({})
    },
  })
}

export { install }
