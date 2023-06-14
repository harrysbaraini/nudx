import { Plugin, ServiceSiteConfig } from '@nudx/cli'
import { join } from 'node:path'

interface Config extends ServiceSiteConfig {
  buckets: string[]
  port: string
}

interface PromptAnswers {
  buckets: string
  port: string
}

const SERVICE_ID = 'minio'
const DEFS = {
  port: '9000',
  buckets: ['files'],
}

export default {
  install(cli) {
    cli.registerService({
      id: SERVICE_ID,
      async onCreate() {
        const opts = {
          port: await cli.prompts.input({
            message: 'Port',
            default: DEFS.port,
          }),
          buckets: await cli.prompts.input({
            message: 'Buckets (separated by space)',
            default: DEFS.buckets.join(' '),
          })
        }

        return {
          port: opts.port,
          buckets: opts.buckets.split(' '),
        }
      },

      onBuild(options: Config, site) {
        options = { ...DEFS, ...options }

        const dataDir = join(site.statePath, 'minio')
        const address = `127.0.0.1:${options.port}`

        return Promise.resolve({
          nix: {
            file: join(__dirname, '..', 'files', 'minio.nix'),
            config: {
              dataDir,
              address,
              ...options,
            },
          },
          serverRoutes: [
            {
              '@id': `${site.id}-minio`,
              terminal: true,
              match: [
                {
                  host: [`minio.${site.mainHost}`],
                },
              ],
              handle: [
                {
                  handler: 'subroute',
                  routes: [
                    {
                      handle: [
                        {
                          handler: 'reverse_proxy',
                          upstreams: [{ dial: address }],
                        },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        })
      },
    })
  }
} as Plugin
