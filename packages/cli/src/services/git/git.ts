import { Service, ServiceConfig, ServiceOptions } from '../../lib/services';
import { Site } from '../../lib/types';

export class Git implements Service {
  getDefaults() {
    return {};
  }
  async install(options: ServiceOptions, site: Site): Promise<ServiceConfig> {
    return {
      packages: ['pkgs.git'],
      // @todo - Add options to import keys, github-cli...
    };
  }
}
