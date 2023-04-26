import { Service, ServiceConfig, ServiceOptions } from '../lib/services';
import { Site, SiteServiceDefinition } from '../lib/types';

interface NodejsOptions extends SiteServiceDefinition {
  version: string;
}

export default class Nodejs implements Service {
  getDefaults(): NodejsOptions {
    return {
      version: 'latest',
    };
  }
  async install(options: ServiceOptions, site: Site): Promise<ServiceConfig> {
    const config: NodejsOptions = {
      ...this.getDefaults(),
      ...options,
    };

    const mainPkg = config.version !== 'latest' ? `nodejs-${config.version.replace('.', '')}_x` : 'nodejs';

    return {
      packages: [mainPkg, 'yarn'],
    };
  }
}
