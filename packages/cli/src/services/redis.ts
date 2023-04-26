import { Service, ServiceConfig, ServiceOptions, makeFile } from '../lib/services';
import { Site, SiteServiceDefinition } from '../lib/types';

interface Options extends ServiceOptions {
  port: number;
}

export default class Redis implements Service {
  getDefaults(): ServiceOptions {
    return {
      // Don't bind any TCP port
      port: 0,
    };
  }
  async install(options: ServiceOptions, site: Site): Promise<ServiceConfig> {
    const REDIS_SOCKET = `${site.statePath}/redis.sock`;
    const REDIS_DATA_DIR = `${site.statePath}/redis`;

    return {
      packages: ['redis'],
      files: [
        makeFile(
          'redisConf',
          'redis.conf',
          `
        port 0
        unixsocket ${REDIS_SOCKET}
        unixsocketperm 700
        dir ${REDIS_DATA_DIR}
      `,
        ),
      ],
      env: {
        REDIS_SOCKET,
      },
      processes: {
        redis: '${pkgs.redis}/bin/redis-server ${redisConf}',
      },
      shellHook: `
        if [[ ! -d "${REDIS_DATA_DIR}" ]]; then
          mkdir -p "${REDIS_DATA_DIR}"
        fi
      `,
    };
  }
}
