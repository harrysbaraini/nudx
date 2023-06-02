import { Command } from '@oclif/core';

export default class Shell extends Command {
  static description = 'Enter the site shell';
  static examples: [`$ nudx app shell`];

  async run(): Promise<any> {
    // @todo
  }
}
