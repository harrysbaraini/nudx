import { ServiceSiteConfig, Plugin } from '@nudx/cli'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

interface Config extends ServiceSiteConfig {
  version: string
  port: string | number
}

const SERVICE_ID = 'elasticsearch'
const DEFAULT_OPTS = {
  version: '7',
  port: '9200',
}

export const plugin: Plugin = {
  install(cli) {
    cli.registerService({
      id: SERVICE_ID,
      async onCreate() {
        return {
          version: await cli.prompts.select({
            message: 'ElasticSearch Version',
            choices: [{ value: '6' }, { value: '7' }],
          }),
          port: await cli.prompts.input({
            message: 'ElasticSearch Port',
            default: DEFAULT_OPTS.port,
          }),
        }
      },

      onBuild(options: Config, site) {
        const dataDir = join(site.statePath, SERVICE_ID)

        options = {
          ...DEFAULT_OPTS,
          ...options,
        }

        const selectedPkg = {
          6: 'elasticsearch',
          7: 'elasticsearch7',
        }[options.version]

        if (!selectedPkg) {
          throw new Error('Wrong version selected for elasticsearch service')
        }

        const paths = {
          home: join(site.statePath, 'elasticsearch'),
          configDir: join(site.statePath, 'elasticsearch', 'config'),
          portsFile: join(site.statePath, 'elasticsearch-port.txt'),
        }

        return Promise.resolve({
          nix: {
            file: join(__dirname, '..', 'files', `${SERVICE_ID}.nix`),
            config: {
              dataDir,
              paths,
              ...options,
            },
          },
          serverRoutes: [],
        })
      },
    })
  }
}
