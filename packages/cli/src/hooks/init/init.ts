import {Hook} from '@oclif/core'
import { Settings } from '../../core/cli';
import { services } from '../../core/services';
import { ServiceDefinition } from '../../core/interfaces/services';
import { Server } from '../../core/server';

const hook: Hook<'init'> = async function (opts) {
  const cli = new Settings(opts.config);
  await cli.load();

  const server = new Server(cli);

  try {
    await server.ensureInstalled();
  } catch (err: unknown) {
    this.error(`Failed to ensure server is properly installed: ${err}`);
  }

  await opts.config.runHook('register_service', {
    register: (name: string, service: ServiceDefinition) => {
      services.register(name, service);
    }
  });
}

export default hook
