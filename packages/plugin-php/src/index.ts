import { CliInstance } from '@nudx/cli/lib/core/cli'
import { CaddyRoute } from '@nudx/cli/lib/core/interfaces/server'
import { ServiceSiteConfig } from '@nudx/cli/lib/core/interfaces/services'
import { SiteConfig } from '@nudx/cli/lib/core/interfaces/sites'
import { join } from 'node:path'

interface Config extends ServiceSiteConfig {
  version: '8.0' | '8.1' | '8.2'
  extensions: string[]
}

const SERVICE_ID = 'php'
const DEFS = {
  version: '8.2',
  extensions: [],
}

export function install(cli: CliInstance) {
  cli.registerService({
    id: SERVICE_ID,
    onCreate() {
      return cli.prompt([
        {
          type: 'list',
          name: 'version',
          message: 'PHP Version',
          default: DEFS.version,
          choices: [{ name: '8.2' }, { name: '8.1' }, { name: '8.0' }],
        },
      ])
    },

    onBuild(options: Config, site) {
      const dataDir = join(site.statePath, SERVICE_ID)
      const statePath = site.statePath

      options = { ...DEFS, ...options }

      const fpm = {
        statePath,
        name: site.id,
        socketFile: `${statePath}/php-fpm.sock`,
        pidFile: `${statePath}/php-fpm.pid`,
      }

      // Automatically add required extensions depending on selected services
      if ('redis' in site.definition.services && !options.extensions.includes('redis')) {
        options.extensions.push('redis')
      }

      return Promise.resolve({
        nix: {
          file: join(__dirname, '..', 'files', `${SERVICE_ID}.nix`),
          config: {
            ...options,
            dataDir,
            statePath,
            fpm,
          },
        },
        serverRoutes: generateCaddySiteConfig(site, fpm.socketFile),
      })
    },
  })
}

function generateCaddySiteConfig(site: SiteConfig, socket: string): CaddyRoute[] {
  let serverPath = site.projectPath

  if (site.definition.serve) {
    serverPath += `/${site.definition.serve}`
  }

  return [
    // Site Config
    {
      '@id': `${site.id}-php`,
      terminal: true,
      match: [
        {
          host: site.definition.hosts,
        },
      ],
      handle: [
        {
          handler: 'subroute',
          routes: [
            // Route : vars
            {
              handle: [
                {
                  handler: 'vars',
                  root: serverPath,
                },
                {
                  encodings: {
                    gzip: {},
                    zstd: {},
                  },
                  handler: 'encode',
                  prefer: ['zstd', 'gzip'],
                },
              ],
            },
            // Route : files
            {
              handle: [
                {
                  handler: 'static_response',
                  headers: {
                    Location: ['{http.request.orig_uri.path}/'],
                  },
                  // eslint-disable-next-line camelcase
                  status_code: 308,
                },
              ],
              match: [
                {
                  file: {
                    // eslint-disable-next-line camelcase
                    try_files: ['{http.request.uri.path}/index.php'],
                  },
                  not: [{ path: ['*/'] }],
                },
              ],
            },
            // Route : rewrite php
            {
              handle: [
                {
                  handler: 'rewrite',
                  uri: '{http.matchers.file.relative}',
                },
              ],
              match: [
                {
                  file: {
                    // eslint-disable-next-line camelcase
                    split_path: ['.php'],
                    // eslint-disable-next-line camelcase
                    try_files: ['{http.request.uri.path}', '{http.request.uri.path}/index.php', 'index.php'],
                  },
                },
              ],
            },
            // Route : php-fpm
            {
              handle: [
                {
                  handler: 'reverse_proxy',
                  transport: {
                    protocol: 'fastcgi',
                    // eslint-disable-next-line camelcase
                    split_path: ['.php'],
                  },

                  // eslint-disable-next-line camelcase
                  trusted_proxies: ['192.168.0.0/16', '172.16.0.0/12', '10.0.0.0/8', '127.0.0.1/8', 'fd00::/8', '::1'],
                  upstreams: [{ dial: `unix/${socket}` }],
                },
              ],
              match: [{ path: ['*.php'] }],
            },
            // Route : file server
            {
              handle: [
                {
                  handler: 'file_server',
                  hide: [],
                },
              ],
            },
          ],
        },
      ],
    },
  ]
}
