import { CliInstance } from '@nudx/cli/lib/core/cli';
import { ServiceSiteConfig } from '@nudx/cli/lib/core/interfaces/services';
import { join } from 'node:path';

const inquirer = require('inquirer');

interface Config extends ServiceSiteConfig {
  buckets: string[];
  port: string;
}

const SERVICE_ID = 'minio';
const DEFS = {
  port: '9000',
  buckets: ['files'],
};

export async function install(cli: CliInstance) {
  cli.registerService({
    id: SERVICE_ID,
    async onCreate() {
      const opts = await inquirer.prompt([
        {
          type: 'input',
          message: 'Port',
          name: 'port',
          default: DEFS.port,
        },
        {
          type: 'input',
          message: 'Buckets (separated by space)',
          name: 'buckets',
          default: DEFS.buckets.join(' '),
        },
      ]);

      return {
        port: opts.port,
        buckets: opts.buckets.split(' '),
      };
    },

    async onBuild(options: Config, site) {
      options = { ...DEFS, ...options };

      const dataDir = join(site.statePath, 'minio');
      const address = `127.0.0.1:${options.port}`;

      return {
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
      };
    },
  });
}
