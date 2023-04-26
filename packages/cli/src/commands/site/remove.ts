import { Command } from '@oclif/core';
import { APP_NAME } from '../../lib/flags';

export default class Remove extends Command {
  static description: string | undefined = `Remove app from ${APP_NAME}`;
  static examples: Command.Example[] = [`$ nudx app remove`];

  async run(): Promise<any> {
    throw new Error('Not implemented');
  }
}
