import { Command } from '@oclif/core';
import * as Listr from 'listr';
import { CLICONF_SERVER } from '../lib/flags';
import { runNixDevelop, runNixOnSite } from '../lib/nix';
import { isServerRunning } from '../lib/server';
import { loadSettings } from '../lib/sites';

export default class Down extends Command {
  static description = 'Shutdown the server and all configured sites';
  static examples = ['$ nudx shutdown'];

  async run(): Promise<any> {
    const settings = await loadSettings();

    const tasks = new Listr([
      {
        title: 'Stop sites',
        enabled: () => Object.keys(settings.sites).length > 0,
        task: () => {
          return new Listr(
            Object.keys(settings.sites).map((path) => {
              return {
                title: `Stop site: ${settings.sites[path].project}`,
                task: () => {
                  return runNixOnSite(settings.sites[path].project, '--command bash -c "stopProject"');
                },
              };
            }),
            { concurrent: true },
          );
        },
      },
      {
        title: 'Stop proxy server',
        task: async () => {
          if (!(await isServerRunning())) {
            this.log('Server is not running.');
            this.exit(1);
          }

          await runNixDevelop(CLICONF_SERVER, '--command bash -c "stopServer"', {
            cwd: CLICONF_SERVER,
            stdio: 'ignore',
          });
        },
      },
    ]);

    await tasks.run();

    this.log('Server stopped!');
  }
}
