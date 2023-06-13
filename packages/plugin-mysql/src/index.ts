import { CliInstance } from '@nudx/cli/lib/core/cli';
import { ServiceSiteConfig } from '@nudx/cli/lib/core/interfaces/services';
import { join } from 'node:path';

const inquirer = require('inquirer');

interface Database {
  name: string;
  id?: string;
  schema?: string;
}

interface Config extends ServiceSiteConfig {
  version: string;
  user: string;
  password: string;
  databases: Database[];
}

const SERVICE_ID = 'mysql';

const DEFAULT_OPTS = {
  version: '8.0',
  port: 3306,
  databases: ['database', 'testing'],
  user: 'dbuser',
  password: 'password',
};

export async function install(cli: CliInstance) {
  cli.registerService({
    id: SERVICE_ID,
    async onCreate() {
      const opts = await inquirer.prompt([
        {
          type: 'list',
          name: 'version',
          message: 'MySQL Version',
          default: DEFAULT_OPTS.version,
          choices: [{ name: '8.0' }, { name: '5.7' }],
        },
        {
          type: 'input',
          name: 'port',
          message: 'MySQL Port',
          default: DEFAULT_OPTS.port,
        },
        {
          type: 'input',
          name: 'databases',
          message: 'Databases (separated by space)',
          default: DEFAULT_OPTS.databases.join(' '),
        },
      ]);

      return {
        ...opts,
        databases: opts.database.split(' ').map((name: string) => ({
          name,
        })),
      };
    },

    async onBuild(options: Config, site) {
      const dataDir = join(site.statePath, SERVICE_ID);

      options = {
        ...DEFAULT_OPTS,
        ...options,
      };

      options.databases = options.databases.map<Database>((db) => ({
        ...db,
        id: db.name.toLowerCase().replaceAll(/[^\da-z]/g, '_'),
      }));

      return {
        nix: {
          file: join(__dirname, '..', 'files', `${SERVICE_ID}.nix`),
          config: {
            ...options,
            dataDir,
            rootUser: 'root',
            rootPassword: '',
            statePath: site.statePath,
            dbEnvs: (options.databases || []).map((db) => ({
              name: `MYSQL_DATABASE_${db.id}`,
              value: db.name,
            })),
          },
        },
        serverRoutes: [],
      };
    },
  });
}
