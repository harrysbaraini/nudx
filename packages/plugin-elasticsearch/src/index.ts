import { CliInstance } from '@nudx/cli/lib/core/cli';
import { ServiceSiteConfig } from '@nudx/cli/lib/core/interfaces/services';
import { CLIError } from '@oclif/core/lib/errors';
import { join } from 'node:path';

const inquirer = require('inquirer');

interface Config extends ServiceSiteConfig {
  version: string;
  port: string | number;
}

const SERVICE_ID = 'elasticsearch';
const DEFAULT_OPTS = {
  version: '7',
  port: 9200,
};

export async function install(cli: CliInstance) {
  cli.registerService({
    id: SERVICE_ID,
    async onCreate() {
      return await inquirer.prompt([
        {
          type: 'list',
          name: 'version',
          message: 'ElasticSearch Version',
          default: DEFAULT_OPTS.version,
          choices: [{ name: '6' }, { name: '7' }],
        },
        {
          type: 'input',
          name: 'port',
          message: 'ElasticSearch Port',
          default: DEFAULT_OPTS.port,
        },
      ]);
    },

    async onBuild(options: Config, site) {
      const dataDir = join(site.statePath, SERVICE_ID);

      options = {
        ...DEFAULT_OPTS,
        ...options,
      };

      const selectedPkg = {
        6: 'elasticsearch',
        7: 'elasticsearch7',
      }[options.version];

      if (!selectedPkg) {
        throw new CLIError('Wrong version selected for elasticsearch service');
      }

      const paths = {
        home: join(site.statePath, 'elasticsearch'),
        configDir: join(site.statePath, 'elasticsearch', 'config'),
        portsFile: join(site.statePath, 'elasticsearch-port.txt'),
      };

      return {
        nix: {
          file: join(__dirname, '..', 'files', `${SERVICE_ID}.nix`),
          config: {
            dataDir,
            paths,
            ...options,
          },
        },
        serverRoutes: [],
      };
    },
  });
}
