import { resolve } from 'path';
import { Service, ServiceConfig, ServiceOptions, makeFile } from '../lib/services';
import { Site, SiteServiceDefinition } from '../lib/types';

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
      ${config.version === 7 ? 'gateway.auto_import_dangling_indices: true' : ''}
      http.port: \$NUDX_ES_PORT
      transport.port: 0
    `;

    const loggingConfigFile = makeFile(
      'loggingConfigFile',
      'log4j2.properties',
      `
        logger.action.name = org.elasticsearch.action
        logger.action.level = info
        appender.console.type = Console
        appender.console.name = console
        appender.console.layout.type = PatternLayout
        appender.console.layout.pattern = [%d{ISO8601}][%-5p][%-25c{1.}] %marker%m%n
        rootLogger.level = info
        rootLogger.appenderRef.console.ref = console
      `,
    );

    const onStartHook =
      config.port && config.port > 0
        ? ''
        : `if [[ ! -f "${esPortFile}" ]]; then
            # HTTP PORT
            port=$(\${findPortScript}/bin/findPort 50001)
            echo $port > ${esPortFile}
          fi`;

    const onStopHook = config.port && config.port > 0 ? '' : `rm ${esPortFile}`;

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
      shellHook: `
        export NUDX_ES_PORT=$(cat ${esPortFile} | head -n 1)

        if [[ ! -d "${ES_HOME}" ]]; then
          mkdir -m 0700 -p ${ES_HOME}

          # elasticsearch needs to create the elasticsearch.keystore in the config directory
          # so this directory needs to be writable.
          mkdir -m 0700 -p ${ES_PATH_CONF}

          # Make sure the logging configuration for old elasticsearch versions is removed:
          rm -f "${ES_PATH_CONF}/logging.yml"
          cp \${loggingConfigFile} ${ES_PATH_CONF}/${loggingConfigFile.filename}

          mkdir -p ${ES_PATH_CONF}/scripts
          mkdir -p ${ES_HOME}/plugins
          ln -sfT \${pkgs.${pkg}}/lib ${ES_HOME}/lib
          ln -sfT \${pkgs.${pkg}}/modules ${ES_HOME}/modules
          cp \${pkgs.${pkg}}/config/jvm.options ${ES_PATH_CONF}/jvm.options

          # redirect jvm logs to the data directory
          mkdir -m 0700 -p ${ES_HOME}/logs
          $\{pkgs.sd}/bin/sd 'logs/gc.log' '${ES_HOME}/logs/gc.log' ${ES_PATH_CONF}/jvm.options
        fi

        if [[ -f "${ES_PATH_CONF}/elasticsearch.yml" ]]; then
          rm -f ${ES_PATH_CONF}/elasticsearch.yml
        fi

        # Note that we copy config files from the nix store instead of symbolically linking them
        # because otherwise X-Pack Security will raise the following exception:
        # java.security.AccessControlException:
        # access denied ("java.io.FilePermission" "/var/lib/elasticsearch/config/elasticsearch.yml" "read")
        echo "${esConfigBase}" > ${ES_PATH_CONF}/elasticsearch.yml
      `,
    };
  }
}
