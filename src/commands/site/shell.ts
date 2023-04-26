import { Command } from '@oclif/core';
import { runNixOnSite } from '../../lib/nix';

export default class Shell extends Command {
  static description = 'Enter the site shell';
  static examples: [`$ nudx app shell`];

  async run(): Promise<any> {
    // @todo Pass a 'site' argument to the first parameter to allow user to enter a project shell from any directory.
    await runNixOnSite('', '', {
      detached: false,
    });
  }
}
