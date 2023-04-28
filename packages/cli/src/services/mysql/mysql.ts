import { Service, ServiceConfig, ServiceOptions, makeFile, makeScript } from '../../lib/services';
import { Renderer } from '../../lib/templates';
import { Site } from '../../lib/types';
import configFileTpl from './tpl/configFile.tpl';
import initScriptTpl from './tpl/initScript.tpl';

interface Options extends ServiceOptions {
  version: string;
  user: string;
  password: string;
  databases: Array<{
    name: string;
    id?: string;
    schema?: string;
  }>;
}

export default class MySql implements Service {
  getDefaults(): Options {
    return {
      version: '8.0',
      user: 'dbuser',
      password: 'password',
      databases: [{ name: 'mydb', id: 'main' }],
    };
  }
  async install(options: Options, site: Site): Promise<ServiceConfig> {
    const config = {
      ...this.getDefaults(),
      ...options,
    };

    const pkg = `mysql${config.version.replace('.', '')}`;
    const nixPkg = '${pkgs.' + pkg + '}';
    const superUser = 'root';
    const HOME = `${site.statePath}/mysql`;
    const UNIX_PORT = `${site.statePath}/mysql.sock`;
    const CMD_FLAGS = '--defaults-file=${mysqlConfigFile} --basedir=' + nixPkg + `--datadir=${HOME}`;

    const cnfFile = makeFile(
      'mysqlConfigFile',
      'my.cnf',
      Renderer.build(configFileTpl, {
        site,
        HOME,
        UNIX_PORT,
      }),
    );

    const initMysql = makeScript(
      'initMysql',
      'initMysql',
      Renderer.build(initScriptTpl, {
        nixPkg,
        config,
        superUser,
        HOME,
        CMD_FLAGS,
        UNIX_PORT,
      }),
    );

    const databaseEnvs = (config.databases || []).reduce((envs, db) => {
      const id = db.id || db.name;
      return {
        ...envs,
        [`MYSQL_DATABASE_${id.toUpperCase().replace('-', '_')}`]: db.name,
      };
    }, {});

    return {
      files: [cnfFile, initMysql],
      env: {
        MYSQL_SOCKET: UNIX_PORT,
        MYSQL_USER: config.user,
        MYSQL_PASSWORD: config.password,
        ...databaseEnvs,
      },
      processes: {
        // It's in single quote because we want it to be passed as it is to flake.nix.
        mysql: `\${pkgs.${pkg}}/bin/mysqld ${CMD_FLAGS}`,
      },
      packages: [pkg],
      onStartedHook: '${initMysql}/bin/initMysql',
    };
  }
}
