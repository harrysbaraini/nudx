import { resolve } from 'path';
import { CaddyRoute, CaddySiteConfig } from '../../lib/server';
import { Service, ServiceConfig, ServiceOptions, makeFile, makeScript } from '../../lib/services';
import { Dictionary, Site } from '../../lib/types';
import fpmConfigFileTpl from './tpl/fpmConfigFile.tpl';
import runPhpFpmScriptTpl from './tpl/runPhpFpmScript.tpl';
import { Renderer } from '../../lib/templates';

function generateCaddySiteConfig(siteConfig: CaddySiteConfig): CaddyRoute[] {
  let serverPath = siteConfig.projectPath;
  if (siteConfig.definition.serve) {
    serverPath += `/${siteConfig.definition.serve}`;
  }

  return [
    // Site Config
    {
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

interface Options extends ServiceOptions {
  version: string;
  extensions: string[];
  packages: string[];
}

export class PHP implements Service {
  prompt(): Dictionary[] {
    return [
      {
        type: 'list',
        name: 'version',
        default: '8.2',
        choices: [{ name: '8.2' }, { name: '8.1' }, { name: '8.0' }],
      },
      // @todo Would it be a good idea to add all extensions available in NixOs Search? List would be extensive!
      // {
      //   type: 'checkbox',
      //   name: 'extensions',
      //   default: [],
      //   choices: [{ name: 'imagick' }, { name: 'gd' }, { name: 'couchbase' }],
      // },
    ];
  }

  getDefaults(): Options {
    return {
      version: '8.2',
      extensions: [],
      packages: [],
    };
  }

  async install(options: Options, project: Site): Promise<ServiceConfig> {
    const config = {
      ...this.getDefaults(),
      ...options,
    };

    const phpStateDir = project.statePath;
    const fpmSocketFile = `${phpStateDir}/php-fpm.sock`;
    const fpmPidFile = `${phpStateDir}/php-fpm.pid`;

    // Automatically add required extensions depending on selected services
    if ('redis' in project.definition.services && config.extensions.indexOf('redis') === -1) {
      config.extensions.push('redis');
    }

    // Available versions: 80 / 81 / 82
    const pkgName = `php${config.version.replace('.', '')}`;
    const mainPkg = `phps.${pkgName}`;
    const extensionPkgs: string[] = config.extensions.map((pkg) => `${pkgName}Extensions.${pkg}`);
    const packagePkgs: string[] = config.packages.map((pkg) => `${pkgName}Packages.${pkg}`);

    const fpmConfigFile = makeFile(
      'fpmConfigFile',
      'phpfpm-web.conf',
      Renderer.build(fpmConfigFileTpl, {
        fpmSocketFile,
        fpmPidFile,
        phpStateDir,
      }),
    );

    const phpIniFile = makeFile('phpIniFile', 'php.ini', `memory_limit=1G`.trim());
    const runPhpFpm = makeScript(
      'runPhpFpm',
      'runPhpFpm',
      Renderer.build(runPhpFpmScriptTpl, {
        pkgName: `\${phps.${pkgName}}`
      }),
    );

    return {
      packages: ['runPhpFpm', mainPkg, 'phpPackages.composer', ...extensionPkgs, ...packagePkgs],
      files: [fpmConfigFile, phpIniFile, runPhpFpm],
      env: {
        PHP_PATH: `phps.${pkgName}/bin/php`,
      },
      virtualHosts: generateCaddySiteConfig({
        ...project,
        socket: fpmSocketFile,
      }),
      processes: {
        phpfpm: '${runPhpFpm}/bin/runPhpFpm',
      },
    };
  }
}
