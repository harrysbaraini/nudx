import { resolve } from 'path';
import { Service, ServiceConfig, ServiceOptions, makeFile } from '../../lib/services';
import { Site } from '../../lib/types';
import loggingConfigFileTpl from './tpl/loggingConfigFile.tpl';
import onStartHookTpl from './tpl/onStartHook.tpl';
import shellHookTpl from './tpl/shellHook.tpl';
import { Renderer } from '../../lib/templates';

interface Options extends ServiceOptions {
  version: 6 | 7;
  port?: number;
}

export default class ElasticSearch implements Service {
  getDefaults(): Options {
    return {
      version: 7,
    };
  }
  async install(options: Options, site: Site): Promise<ServiceConfig> {
    const config: Options = {
      ...this.getDefaults(),
      ...options,
    };

    const ES_HOME = resolve(site.statePath, 'elasticsearch'); // cfg.dataDir
    const ES_PATH_CONF = resolve(ES_HOME, 'config'); // configDir
    const ES_JAVA_OPTS = '';

    const esPortFile = resolve(site.statePath, 'elasticsearch-port.txt');

    const pkg = {
      '6': 'elasticsearch',
      '7': 'elasticsearch7',
    }[config.version.toString()];

    if (!pkg) {
      throw new Error('Wrong version selected for elasticesearch service');
    }

    const esConfigBase = `
      network.host: _local_
      cluster.name: elasticsearch
      discovery.type: single-node
      ${config.version === 7
        ? 'gateway.auto_import_dangling_indices: true'
        : ''}
      http.port: $NUDX_ES_PORT
      transport.port: 0
    `;

    const loggingConfigFile = makeFile('loggingConfigFile', 'log4j2.properties', Renderer.build(loggingConfigFileTpl));
    const onStartHook = config.port && config.port > 0
      ? ''
      : Renderer.build(onStartHookTpl, { esPortFile });
    const onStopHook = config.port && config.port > 0
      ? ''
      : `rm ${esPortFile}`;

    return {
      packages: [pkg],
      files: [loggingConfigFile],
      env: {
        ES_HOME,
        ES_JAVA_OPTS,
        ES_PATH_CONF,
      },
      processes: {
        elasticsearch: `ES_HOME="${ES_HOME}" ES_JAVA_OPTS="${ES_JAVA_OPTS}" ES_PATH_CONF="${ES_PATH_CONF}" \${pkgs.${pkg}}/bin/elasticsearch`,
      },
      onStartHook,
      onStopHook,
      shellHook: Renderer.build(shellHookTpl, {
        pkgName: `\${pkgs.${pkg}}`,
        esPortFile,
        esConfigBase,
        ES_HOME,
        ES_PATH_CONF,
        loggingConfigFile: loggingConfigFile.filename,
      }),
    };
  }
}
