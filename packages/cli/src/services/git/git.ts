import { Service, ServiceConfig, OptionsState, Options } from '../../lib/services';
import { Site } from '../../lib/types';

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
      nix: {
        file: 'git.nix',
        config: options,
      },
    };
  }
}
