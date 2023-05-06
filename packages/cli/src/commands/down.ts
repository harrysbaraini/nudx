import { Command } from '@oclif/core';
import * as Listr from 'listr';
import { loadSettings } from '../lib/sites';
import { killProcessManager } from '../lib/pm2';

export default class Down extends Command {
  static description = 'Shutdown the server and all configured sites';
  static examples = ['$ nudx shutdown'];

  async run(): Promise<any> {
    const settings = await loadSettings();

    const tasks = new Listr([
      {
        title: 'Stop server',
        task: async () => {
          await killProcessManager();
        },
      },
    ]);

    await tasks.run();

    this.log('Server stopped!');
    this.exit(0);
  }
}
