import { Service, ServiceConfig, OptionsState, Options } from '../../lib/services';
import { Renderer } from '../../lib/templates';
import { Site } from '../../lib/types';
import outputsTpl from './outputs.tpl';

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
      outputs: Renderer.build(outputsTpl, {
        site,
        options,
      }),
    }
  }
}
