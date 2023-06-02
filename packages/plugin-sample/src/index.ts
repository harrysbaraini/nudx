import { RegisterServiceHook, ServiceSiteConfig } from '@nudx/cli/lib/core/interfaces/services';
const inquirer = require('inquirer');
import { join } from 'node:path';

interface Config extends ServiceSiteConfig {
  buckets: string[];
  port: string;
}

const serviceId = 'sampleId';

const hook = async function (options: RegisterServiceHook) {
  options.register(serviceId, {
    async onCreate() {
      const opts = await inquirer.prompt([]);

      return {
        // Options to save on dev.json
        ...opts,
      };
    },

    async onBuild(options: Config, site) {
      const dataDir = join(site.statePath, serviceId);

      return {
        nix: {
          file: join(__dirname, '..', 'files', `${serviceId}.nix`),
          config: {
            dataDir,
            ...options,
          },
        },
        serverRoutes: [],
      };
    },
  });
};

export default hook;
