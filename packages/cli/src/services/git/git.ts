import { Service, ServiceConfig, OptionsState, Options } from '../../lib/services';
import { Renderer } from '../../lib/templates';
import { Site } from '../../lib/types';
import outputsTpl from './outputs.tpl';

// @todo - Add options to import keys, github-cli...
export class Git implements Service {
  options(): Options {
    return [];
  }
  getDefaults() {
    return {};
  }
  async install(options: OptionsState, site: Site): Promise<ServiceConfig> {
    return {
      outputs: Renderer.build(outputsTpl, {}),
    };
  }
}
