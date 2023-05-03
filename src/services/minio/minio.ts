import { join, resolve } from 'path';
import { Service, ServiceConfig, OptionsState, Options } from '../../lib/services';
import { Site } from '../../lib/types';
import { Renderer } from '../../lib/templates';
import outputsTpl from './outputs.tpl';

export default class Minio implements Service {
  options(): Options {
    return [
      {
        type: 'input',
        name: 'port',
        default: '',
      },
      {
        type: 'input',
        name: 'buckets',
        default: '',
        mutate(value: string): string[] {
          return value.split(' ');
        },
      }
    ];
  }

  async install(options: OptionsState & { buckets: string[] }, site: Site): Promise<ServiceConfig> {
    const dataDir = join(site.statePath, 'minio');
    const addressFile = resolve(site.statePath, 'minio-addr.txt');

    return {
      inputs: {},
      outputs: Renderer.build(outputsTpl, {
        dataDir,
        addressFile,
        options,
        site,
      }),
      virtualHosts: [
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
                      upstreams: [{ dial: '{env.NUDX_MINIO_ADDRESS}' }],
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