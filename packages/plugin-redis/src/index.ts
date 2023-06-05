import { CliInstance } from '@nudx/cli/lib/core/cli';
import { RegisterServiceHook, ServiceSiteConfig } from '@nudx/cli/lib/core/interfaces/services';
const inquirer = require('inquirer');
import { join } from 'node:path';

interface Config extends ServiceSiteConfig {
  port: number | string;
}

const SERVICE_ID = 'redis';
const DEFS = {
  port: '6379',
};

export async function install(cli: CliInstance) {
  cli.registerService({
    id: SERVICE_ID,
    async onCreate() {
      const opts = await inquirer.prompt([
        {
          type: 'input',
          name: 'port',
          message: 'Redis Port',
          default: DEFS.port,
        },
      ]);

      return opts;
    },

    async onBuild(options: Config, site) {
      const dataDir = join(site.statePath, SERVICE_ID);

      options = { ...DEFS, ...options };

      return {
        nix: {
          file: join(__dirname, '..', 'files', `${SERVICE_ID}.nix`),
          config: {
            statePath: site.statePath,
            dataDir,
            ...options,
          },
        },
        serverRoutes: [],
      };
    },
  });
};
