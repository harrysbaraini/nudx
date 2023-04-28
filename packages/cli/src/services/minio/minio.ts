import { resolve } from 'path';
import { Service, ServiceConfig, ServiceOptions } from '../../lib/services';
import { Site } from '../../lib/types';
import onStartHookTpl from './tpl/onStartHook.tpl';
import shellHookTpl from './tpl/shellHook.tpl';
import { Renderer } from '../../lib/templates';

interface Options extends ServiceOptions {
  user: string;
  password: string;
  buckets: string[];
  port?: string;
}

export default class Minio implements Service {
  getDefaults(): Options {
    return {
      user: 'admin',
      password: 'password',
      buckets: [],
    };
  }
  async install(options: Options, site: Site): Promise<ServiceConfig> {
    const config = {
      ...this.getDefaults(),
      ...options,
    };

    const dataDir = resolve(site.statePath, 'minio');
    const minioAddressFile = resolve(site.statePath, 'minio-addr.txt');
    const minioAddress = config.port
      ? `127.0.0.1:${config.port}`
      : `$(cat ${minioAddressFile})`;

    const env = {
      MINIO_ROOT_USER: 'admin',
      MINIO_ROOT_PASSWORD: 'password',
    };

    const onStartHook = config.port
      ? ''
      : Renderer.build(onStartHookTpl, { minioAddressFile });

    const onStopHook = config.port
      ? ''
      : `rm ${minioAddressFile}`;

    return {
      packages: ['minio'],
      env,
      processes: {
        minio: `MINIO_ROOT_USER="${env.MINIO_ROOT_USER}" MINIO_ROOT_PASSWORD="${env.MINIO_ROOT_PASSWORD}" MINIO_ADDRESS="${minioAddress}" \${pkgs.minio}/bin/minio server ${dataDir}`,
      },
      virtualHosts: [
        {
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
      onStartHook,
      onStopHook,
      shellHook: Renderer.build(shellHookTpl, {
        dataDir,
        minioAddress,
        buckets: config.buckets,
      }),
    };
  }
}
