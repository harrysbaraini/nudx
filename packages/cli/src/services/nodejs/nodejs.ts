import { Service, ServiceConfig, OptionsState, Options } from '../../lib/services';
import { Site } from '../../lib/types';

interface NodejsState extends OptionsState {
  version: string;
}

export default class Nodejs implements Service {
  options(): Options {
    return [
      {
        type: 'list',
        name: 'version',
        message: 'Node.js Version',
        default: '18',
        choices: ['19', '18', '16', '14'].map(
          (v: string) => ({ name: v })
        ),
        prompt: true,
      }
    ];
  }

  async install(options: NodejsState, site: Site): Promise<ServiceConfig> {
    return {
      nix: {
        file: 'nodejs.nix',
        config: options,
      }
    };
  }
}
