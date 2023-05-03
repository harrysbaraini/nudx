import { Service, ServiceConfig, OptionsState, Options } from '../../lib/services';
import { Renderer } from '../../lib/templates';
import { Site, SiteServiceDefinition } from '../../lib/types';
import outputsTpl from './outputs.tpl';

export default class Nodejs implements Service {
  options(): Options {
    return [
      {
        type: 'list',
        name: 'version',
        message: 'Node.js Version',
        default: 'latest',
        choices: ['latest', 19, 18, 17, 16, 15, 14, 13, 12].map(
          (v: string | number) => ({ name: v.toString() })
        ),
        prompt: true,
      }
    ];
  }

  async install(options: OptionsState & { version: string }, site: Site): Promise<ServiceConfig> {
    const pkg = options.version === 'latest'
      ? 'nodejs'
      : `nodejs-${options.version.replace('.', '')}_x`;

    return {
      outputs: Renderer.build(outputsTpl, {
        pkg,
      }),
    };
  }
}
