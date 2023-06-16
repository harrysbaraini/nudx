import { Plugin } from '@nudx/cli'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
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
