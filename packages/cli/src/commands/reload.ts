import { Command } from '@oclif/core';
import { APP_NAME } from '../lib/flags';
import Down from './down';
import Up from './up';

export default class Reload extends Command {
  static description = `Reload ${APP_NAME} server`;
  static examples: [];

  async run(): Promise<any> {
    await Down.run();
    await Up.run();
  }
}
