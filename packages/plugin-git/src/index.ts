import { CliInstance } from '@nudx/cli/lib/core/cli';
import { ServiceSiteConfig } from '@nudx/cli/lib/core/interfaces/services';
import { join } from 'node:path';

interface Config extends ServiceSiteConfig {}

const SERVICE_ID = 'git';

export async function install(cli: CliInstance) {
  cli.registerService({
    id: SERVICE_ID,
    async onCreate() {
      return {};
    },

    async onBuild(options: Config, site) {
      return {
        nix: {
          file: join(__dirname, '..', 'files', `${SERVICE_ID}.nix`),
          config: {},
        }
      };
    },
  });
};
