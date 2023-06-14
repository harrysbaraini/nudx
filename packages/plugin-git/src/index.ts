import { Plugin } from '@nudx/cli'
import { join } from 'node:path'

const SERVICE_ID = 'git'

export const plugin: Plugin = {
  install(cli) {
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
}
