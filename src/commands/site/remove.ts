import { Command } from '@oclif/core';
import { APP_NAME } from '../../lib/flags';
import { CLIError } from '@oclif/core/lib/errors';

export default class Remove extends Command {
  static description: string | undefined = `Remove app from ${APP_NAME}`;
  static examples: Command.Example[] = [`$ nudx app remove`];

  async run(): Promise<any> {
    throw new CLIError('Not implemented');
  }
}
