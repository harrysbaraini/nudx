import { Command, Flags, Interfaces } from '@oclif/core';
import { Server } from './server';
import { Settings } from './cli';

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<T['flags']>;
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>;

export abstract class BaseCommand<T extends typeof Command> extends Command {
  // add the --json flag
  static enableJsonFlag = true;
  protected flags!: Flags<T>;
  protected args!: Args<T>;

  public settings!: Settings;
  public server!: Server;

  static examples = ['<%= config.bin %> <%= command.id %>'];

  public async init(): Promise<void> {
    await super.init();

    const { args, flags } = await this.parse({
      flags: this.ctor.flags,
      args: this.ctor.args,
      strict: this.ctor.strict,
    });

    this.flags = flags as Flags<T>;
    this.args = args as Args<T>;

    this.settings = new Settings(this.config);
    await this.settings.load();

    this.server = new Server(this.settings);
  }

  protected async catch(err: Error & { exitCode?: number }): Promise<unknown> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err);
  }

  protected async finally(_: Error | undefined): Promise<unknown> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_);
  }
}
