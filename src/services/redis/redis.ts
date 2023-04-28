import { Service, ServiceConfig, ServiceOptions, makeFile } from '../../lib/services';
import { Renderer } from '../../lib/templates';
import { Site } from '../../lib/types';
import configFileTpl from './tpl/configFile.tpl';
import onStartHookTpl from './tpl/onStartHook.tpl';

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
          Renderer.build(configFileTpl, {
            REDIS_SOCKET,
            REDIS_DATA_DIR,
          }),
        ),
      ],
      env: {
        REDIS_SOCKET,
      },
      processes: {
        redis: '${pkgs.redis}/bin/redis-server ${redisConf}',
      },
      onStartHook: Renderer.build(onStartHookTpl, {
        REDIS_DATA_DIR,
      }),
    };
  }
}
