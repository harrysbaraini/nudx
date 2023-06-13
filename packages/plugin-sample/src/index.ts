import { CliInstance } from '@nudx/cli/lib/core/cli';
import { ServiceSiteConfig } from '@nudx/cli/lib/core/interfaces/services';
import { join } from 'node:path';

const inquirer = require('inquirer');

interface Config extends ServiceSiteConfig {
  buckets: string[];
  port: string;
}

const serviceId = 'sampleId';

export async function install(cli: CliInstance) {
  cli.registerService({
    id: serviceId,
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
}
