import { join } from 'path';
import { Service, ServiceConfig, OptionsState, Options } from '../../lib/services';
import { Site } from '../../lib/types';
import { CLIError } from '@oclif/core/lib/errors';

interface ESState extends OptionsState {
  version: string;
  port: number;
}

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

  async install(options: ESState, site: Site): Promise<ServiceConfig> {
    const selectedPkg = {
      '6': 'elasticsearch',
      '7': 'elasticsearch7',
    }[options.version];

    if (!selectedPkg) {
      throw new CLIError('Wrong version selected for elasticsearch service');
    }

    const paths = {
      home: join(site.statePath, 'elasticsearch'),
      configDir: join(site.statePath, 'elasticsearch', 'config'),
      portsFile: join(site.statePath, 'elasticsearch-port.txt'),
    };

    return {
      nix: {
        file: 'elasticsearch.nix',
        config: {
          ...options,
          paths,
        },
      },
    };
  }
}
