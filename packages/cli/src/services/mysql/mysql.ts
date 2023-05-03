import { join } from 'path';
import { Service, ServiceConfig, OptionsState, makeFile, makeScript, Options } from '../../lib/services';
import { Renderer } from '../../lib/templates';
import { Site } from '../../lib/types';
import outputsTpl from './outputs.tpl';

interface MysqlDatabase {
  name: string;
  id?: string;
  schema?: string;
}

interface MysqlOptions {
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
        choices: [{ name: '8.0' }],
        prompt: true,
        onJsonByDefault: true,
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
          { name: 'mydb' }
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

  async install(options: OptionsState & MysqlOptions, site: Site): Promise<ServiceConfig> {
    return {
      inputs: {},
      outputs: Renderer.build(outputsTpl, {
        site,
        pkg: `mysql${options.version.replace('.', '')}`,
        options: {
          ...options,
          databases: (options.databases || []).map((db) => {
            const id = db.id || db.name;

            return {
              ...db,
              env: `MYSQL_DATABASE_${id.toUpperCase().replace('-', '_')}`,
            };
          }),
        },
      }),
    };
  }
}
