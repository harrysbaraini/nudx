import { Command } from '@oclif/core';
import Down from './down';
import Up from './up';

export default class Reload extends Command {
  static description = `Reload server`;
  static examples: [];

  async run(): Promise<any> {
    await Down.run();
    await Up.run();
  }
}
