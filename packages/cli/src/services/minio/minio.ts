import { join } from 'path';
import { Service, ServiceConfig, OptionsState, Options } from '../../lib/services';
import { Site } from '../../lib/types';

export default class Minio implements Service {
  options(): Options {
    return [
      {
        type: 'input',
        message: 'Minio Port',
        name: 'port',
        default: 9000,
      },
      {
        type: 'input',
        message: 'Minio Buckets (separated by space)',
        name: 'buckets',
        default: '',
        mutate(value: string): string[] {
          if (value.length === 0) return [];
          return value.split(' ');
        },
      }
    ];
  }

  async install(options: OptionsState & { buckets: string[] }, site: Site): Promise<ServiceConfig> {
    const dataDir = join(site.statePath, 'minio');
    const address = `127.0.0.1:${options.port}`;

    return {
      nix: {
        file: 'minio.nix',
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
  }
}
