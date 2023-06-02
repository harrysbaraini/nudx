import { RegisterServiceHook, ServiceSiteConfig } from '@nudx/cli/lib/core/interfaces/services';
import { join } from 'node:path';

interface Config extends ServiceSiteConfig {}

const serviceId = 'git';

const hook = async function (options: RegisterServiceHook) {
  options.register(serviceId, {
    async onCreate() {
      return {};
    },

    async onBuild(options: Config, site) {
      return {
        nix: {
          file: join(__dirname, '..', 'files', `${serviceId}.nix`),
          config: {},
        }
      };
    },
  });
};

export default hook;
