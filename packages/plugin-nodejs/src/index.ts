import { CliInstance } from '@nudx/cli/lib/core/cli';
import { RegisterServiceHook, ServiceSiteConfig } from '@nudx/cli/lib/core/interfaces/services';
const inquirer = require('inquirer');
import { join } from 'node:path';

interface Config extends ServiceSiteConfig {
  buckets: string[];
  port: string;
}

const serviceId = 'nodejs';

export async function install(cli: CliInstance) {
  cli.registerService({
    id: serviceId,
    async onCreate() {
      const opts = await inquirer.prompt([
        {
          type: 'list',
          name: 'version',
          message: 'Node.js Version',
          default: '18',
          choices: ['19', '18', '16', '14'].map(
            (v: string) => ({ name: v })
          ),
        }
      ]);

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
