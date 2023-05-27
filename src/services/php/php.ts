import { Service, ServiceConfig, OptionsState, Options } from '../../lib/services';
import { Site } from '../../lib/types';
import { CaddyRoute } from '../../lib/server';

interface PHPState extends OptionsState {
  version: '8.0' | '8.1' | '8.2';
  extensions: string[];
}

export class PHP implements Service {
  options(): Options {
    return [
      {
        type: 'list',
        name: 'version',
        message: 'PHP Version',
        default: '8.2',
        choices: [{ name: '8.2' }, { name: '8.1' }, { name: '8.0' }],
        prompt: true,
      },
      {
        type: 'checkbox',
        name: 'extensions',
        message: 'PHP Extensions',
        default: [],
        choices: [],
        prompt: false,
        onJsonByDefault: false,
      }
    ];
  }

  async install(options: PHPState, site: Site): Promise<ServiceConfig> {
    const statePath = site.statePath;

    const fpm = {
      statePath,
      name: site.id,
      socketFile: `${statePath}/php-fpm.sock`,
      pidFile: `${statePath}/php-fpm.pid`,
    }

    // Automatically add required extensions depending on selected services
    if ('redis' in site.definition.services && options.extensions.indexOf('redis') === -1) {
      options.extensions.push('redis');
    }

    return {
      serverRoutes: generateCaddySiteConfig(site, fpm.socketFile),
      nix: {
        file: 'php.nix',
        config: {
          ...options,
          version: options.version.replace('.', ''),
          statePath,
          fpm,
        },
      },
    }
  }
}
function generateCaddySiteConfig(site: Site, socket: string): CaddyRoute[] {
  let serverPath = site.projectPath;
  if (site.definition.serve) {
    serverPath += `/${site.definition.serve}`;
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
                    zstd: {}
                  },
                  handler: "encode",
                  prefer: [
                    "zstd",
                    "gzip"
                  ]
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
                  status_code: 308,
                },
              ],
              match: [
                {
                  file: {
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
                    split_path: ['.php'],
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
                    split_path: ['.php'],
                  },
                  trusted_proxies: ['192.168.0.0/16', '172.16.0.0/12', '10.0.0.0/8', '127.0.0.1/8', 'fd00::/8', '::1'],
                  upstreams: [{ dial: `unix/${socket}` }],
                },
              ],
              match: [{ path: ['*.php'] }],
            },
            // Route : file server
            {
              "handle": [
                {
                  "handler": "file_server",
                  "hide": []
                }
              ]
            }
          ],
        },
      ],
    },
  ];
}
