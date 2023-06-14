import { Plugin } from '@nudx/cli'
import { join } from 'node:path'

export default {
  install(cli) {
    cli.registerServerPlugin({
      id: 'github',
      nixFile: join(__dirname, '..', 'files', 'github.nix'),
      onBuild() {
        return Promise.resolve({})
      },
    })
  }
} as Plugin
