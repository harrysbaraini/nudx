import { Service, ServiceConfig, OptionsState, Options } from '../../lib/services';
import { Site } from '../../lib/types';

interface RedisOptionsState extends OptionsState {
  port: number;
}

export default class Redis implements Service {
  options(): Options {
    return [
      {
        type: 'input',
        name: 'port',
        message: 'Redis Port',
        default: 0
      },
    ];
  }

  async install(options: RedisOptionsState, site: Site): Promise<ServiceConfig> {
    return {
      nix: {
        file: 'redis.nix',
        config: {
          statePath: site.statePath,
          ...options,
        }
      },
    }
  }
}
