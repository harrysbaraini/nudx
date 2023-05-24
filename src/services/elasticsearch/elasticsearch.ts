import { join } from 'path';
import { Service, ServiceConfig, OptionsState, Options } from '../../lib/services';
import { Site } from '../../lib/types';
import { Renderer } from '../../lib/templates';
import outputsTpl from './outputs.tpl';
import { CLIError } from '@oclif/core/lib/errors';

export default class ElasticSearch implements Service {
  options(): Options {
    return [
      {
        type: 'list',
        name: 'version',
        message: 'ElasticSearch Version',
        default: '7',
        prompt: true,
        choices: [
          { name: '6' },
          { name: '7' },
        ],
      },
      {
        type: 'input',
        name: 'port',
        message: 'ElasticSearch Port',
        default: 9200,
      }
    ];
  }

  async install(options: OptionsState & { version: string; port: number; }, site: Site): Promise<ServiceConfig> {
    const selectedPkg = {
      '6': 'elasticsearch',
      '7': 'elasticsearch7',
    }[options.version];

    if (!selectedPkg) {
      throw new CLIError('Wrong version selected for elasticesearch service');
    }

    const paths = {
      home: join(site.statePath, 'elasticsearch'),
      configDir: join(site.statePath, 'elasticsearch', 'config'),
      portsFile: join(site.statePath, 'elasticsearch-port.txt'),
    };

    return {
      outputs: Renderer.build(outputsTpl, {
        isVersion7: selectedPkg === 'elasticsearch7',
        selectedPkg,
        options,
        paths,
        site,
      }),
    };
  }
}
