import { Service, ServiceConfig, ServiceOptions, makeFile, makeScript } from '../lib/services';
import { Site, SiteServiceDefinition } from '../lib/types';

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
    const superUser = 'root';
    const HOME = `${site.statePath}/mysql`;
    const UNIX_PORT = `${site.statePath}/mysql.sock`;
    const CMD_FLAGS = `--defaults-file=\${mysqlConfigFile} --basedir=\${pkgs.${pkg}} --datadir=${HOME}`;

    const cnfFile = makeFile(
      'mysqlConfigFile',
      'my.cnf',
      `
        [mysqld]
        datadir=${HOME}
        socket=${UNIX_PORT}
        pid-file=${site.statePath}/mysql.pid
        log-error=${site.statePath}/mysql.log
        symbolic-links=0
        ssl=0

        [client]
        port=0
        socket=${UNIX_PORT}
    `.trim(),
    );

    const initMysql = makeScript(
      'initMysql',
      'initMysql',
      `
        if [[ ! -d "${HOME}" || ! -f "${HOME}/ibdata1" ]]; then
            echo "Creating MySQL Data Directory..."
            mkdir -p ${HOME}
            \${pkgs.${pkg}}/bin/mysqld ${CMD_FLAGS} --default-time-zone=SYSTEM --initialize-insecure
        fi

        # Create initial databases
        ${
          config.databases &&
          config.databases
            .map((db) =>
              `
        if ! test -e "${HOME}/${db.name}"; then
            echo "Creating initial database: ${db.name}"
            ( echo 'create database \`${db.name}\`;'
                ${
                  db.schema && db.schema.length > 0
                    ? `
                echo 'use \`${db.name}\`;'
                if [ -f "\${db.schema}" ]
                then
                    cat ${db.schema}
                elif [ -d "${db.schema}" ]
                then
                    cat ${db.schema}/*.sql
                fi
                `
                    : ''
                }
            ) | \${pkgs.${pkg}}/bin/mysql -u ${superUser} -N
        fi
        `.trimEnd(),
            )
            .join('')
        }

        # Ensure a user exists because we don't want to run this service as 'root'
        (echo "CREATE USER IF NOT EXISTS '${config.user}'@'localhost' IDENTIFIED WITH "auth_socket"};"
            echo "GRANT ALL PRIVILEGES ON *.* TO '${config.user}'@'localhost' WITH GRANT OPTION;"
        ) | \${pkgs.${pkg}}/bin/mysql -u ${superUser} -N
    `,
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
      shellHook: '${initMysql}/bin/initMysql',
    };
  }
}
