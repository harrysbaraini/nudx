import { Service, ServiceConfig, OptionsState, Options } from '../../lib/services';
import { Site } from '../../lib/types';

interface MysqlDatabase {
  name: string;
  id?: string;
  schema?: string;
}

interface MysqlOptions extends OptionsState {
  version: string;
  user: string;
  password: string;
  databases: MysqlDatabase[];
}

export default class MySql implements Service {
  options(): Options {
    return [
      {
        type: 'list',
        name: 'version',
        message: 'MySQL Version',
        default: '8.0',
        choices: [{ name: '8.0' }, { name: '5.7' }],
        prompt: true,
        onJsonByDefault: true,
      },
      {
        type: 'input',
        name: 'port',
        message: 'MySQL Port',
        default: 3306
      },
      {
        type: 'input',
        name: 'user',
        default: 'dbuser',
        prompt: false,
      },
      {
        type: 'input',
        name: 'password',
        default: 'password',
        prompt: false,
      },
      {
        type: 'input',
        name: 'databases',
        default: [
          { name: 'appdb', id: 'main' },
          { name: 'testdb', id: 'test' }
        ],
        prompt: false,
        onJsonByDefault: true,
        mutate(value: string): MysqlDatabase[] {
          return value.split(' ').map((name: string) => ({
            name,
          }));
        },
      },
    ];
  }

  async install(options: MysqlOptions, site: Site): Promise<ServiceConfig> {
    return {
      nix: {
        file: 'mysql.nix',
        config: {
          ...options,
          rootUser: 'root',
          rootPassword: '',
          statePath: site.statePath,
          dbEnvs: (options.databases || []).map((db) => {
            const id = db.id || db.name;

            return {
              name: `MYSQL_DATABASE_${id.toUpperCase().replace('-', '_')}`,
              value: db.name,
            };
          }),
        }
      },
    };
  }
}
