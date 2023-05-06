import { Service, ServiceConfig, OptionsState, Options } from '../../lib/services';
import { Renderer } from '../../lib/templates';
import { Site } from '../../lib/types';
import outputsTpl from './outputs.tpl';

export default class Redis implements Service {
  options(): Options {
    return [];
  }

  async install(options: OptionsState, site: Site): Promise<ServiceConfig> {
    return {
      outputs: Renderer.build(outputsTpl, {
        site,
      }),
    }
  }
}
