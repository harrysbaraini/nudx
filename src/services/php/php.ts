import { CaddyRoute, CaddySiteConfig } from '../../lib/server';
import { Service, ServiceConfig, OptionsState, Options, Inputs, VirtualHost } from '../../lib/services';
import { Site } from '../../lib/types';
import { Renderer } from '../../lib/templates';
import outputsTpl from './outputs.tpl';

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

  inputs(): Inputs {
    return {
      phpShell: '{ url = "github:loophp/nix-shell"; }',
    }
  }

  virtualHosts(site: Site, socket: string): VirtualHost[] {
    return generateCaddySiteConfig({
      ...site,
      socket,
    });
  }

  async install(options: OptionsState & { version: '8.0' | '8.1' | '8.2'; extensions: string[] }, site: Site): Promise<ServiceConfig> {
    const stateDir = site.statePath;

    const fpm = {
      stateDir,
      socketFile: `${stateDir}/php-fpm.sock`,
      pidFile: `${stateDir}/php-fpm.pid`,
    }

    // Automatically add required extensions depending on selected services
    if ('redis' in site.definition.services && options.extensions.indexOf('redis') === -1) {
      options.extensions.push('redis');
    }

    return {
      virtualHosts: this.virtualHosts(site, fpm.socketFile),
      inputs: this.inputs(),
      outputs: Renderer.build(outputsTpl, {
        phpPkg: `php${options.version.replace('.', '')}`,
        extensions: options.extensions,
        site,
        stateDir,
        fpm,
      }),
    }
  }
}
function generateCaddySiteConfig(siteConfig: CaddySiteConfig): VirtualHost[] {
  let serverPath = siteConfig.projectPath;
  if (siteConfig.definition.serve) {
    serverPath += `/${siteConfig.definition.serve}`;
  }

  return [
    // Site Config
    {
      '@id': `${siteConfig.id}-php`,
      terminal: true,
      match: [
        {
          host: Object.keys(siteConfig.definition.hosts).filter((h) => siteConfig.definition.hosts[h] === '127.0.0.1'),
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
                  upstreams: [{ dial: `unix/${siteConfig.socket}` }],
                },
              ],
              match: [{ path: ['*.php'] }],
            },
          ],
        },
      ],
    },
  ];
}
