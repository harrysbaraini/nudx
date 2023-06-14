import { Plugin, ServiceSiteConfig } from '@nudx/cli'
import { join } from 'node:path'

interface Database {
  name: string
  id?: string
  schema?: string
}

interface PromptAnswers {
  databases: string
  version: string
  port: string
}

interface Config extends ServiceSiteConfig {
  version: string
  user: string
  password: string
  databases: Database[]
}

const SERVICE_ID = 'mysql'

const DEFAULT_OPTS = {
  version: '8.0',
  port: '3306',
  databases: ['database', 'testing'],
  user: 'dbuser',
  password: 'password',
}

export default {

  install(cli) {
    cli.registerService({
      id: SERVICE_ID,
      async onCreate() {
        const opts = {
          version: await cli.prompts.select({
            message: 'MySQL Version',
            choices: [{ name: '8.0' }, { name: '5.7' }],
            validate: (value: string) => value.trim().length > 0,
          }),
          port: await cli.prompts.input({
            message: 'MySQL Port',
            default: DEFAULT_OPTS.port,
          }),
          databases: await cli.prompts.input({
            message: 'Databases (separated by space)',
            default: DEFAULT_OPTS.databases.join(' '),
          }),
        }

        return {
          ...opts,
          databases: opts.databases.split(' ').map((name: string) => ({
            name,
          })),
        }
      },

      onBuild(options: Config, site) {
        const dataDir = join(site.statePath, SERVICE_ID)

        options = {
          ...DEFAULT_OPTS,
          ...options,
        }

        options.databases = options.databases.map<Database>(db => ({
          ...db,
          id: db.name.toLowerCase().replaceAll(/[^\da-z]/, '_'),
        }))

        return Promise.resolve({
          nix: {
            file: join(__dirname, '..', 'files', `${SERVICE_ID}.nix`),
            config: {
              ...options,
              dataDir,
              rootUser: 'root',
              rootPassword: '',
              statePath: site.statePath,
              dbEnvs: (options.databases || []).map(db => ({
                name: `MYSQL_DATABASE_${db.id || ''}`,
                value: db.name,
              })),
            },
          },
          serverRoutes: [],
        })
      },
    })
  }
} as Plugin
