{ pkgs, system, config }:
let
  versions = {
    "6" = pkgs.elasticsearch;
    "7" = pkgs.elasticsearch7;
  };

  pkg = versions.${config.version};

  baseConfig = ''
    network.host: _local_
    cluster.name: elasticsearch
    discovery.type: single-node
    http.port: ${builtins.toString config.port}
    transport.port: 0
    ${if config.version == "7" then "gateway.auto_import_dangling_indices: true" else ""}
  '';

  files.logConfig = pkgs.writeText "log4j2.properties" ''
    logger.action.name = org.elasticsearch.action
    logger.action.level = info
    appender.console.type = Console
    appender.console.name = console
    appender.console.layout.type = PatternLayout
    appender.console.layout.pattern = [%d{ISO8601}][%-5p][%-25c{1.}] %marker%m%n
    rootLogger.level = info
    rootLogger.appenderRef.console.ref = console
  '';

  on_start_hook = pkgs.writeShellScript "onStartHook" ''
    if [[ ! -d "${config.paths.home}" ]]; then
      mkdir -m 0700 -p ${config.paths.home}

      # elasticsearch needs to create the elasticsearch.keystore in the config directory
      # so this directory needs to be writable.
      mkdir -m 0700 -p ${config.paths.configDir}

      # Make sure the logging configuration for old elasticsearch versions is removed:
      rm -f "${config.paths.configDir}/logging.yml"
      cp ${files.logConfig} ${config.paths.configDir}/log4j2.properties

      mkdir -p ${config.paths.configDir}/scripts
      mkdir -p ${config.paths.home}/plugins
      ln -sfT ${pkg}/lib ${config.paths.home}/lib
      ln -sfT ${pkg}/modules ${config.paths.home}/modules
      cp ${pkg}/config/jvm.options ${config.paths.configDir}/jvm.options

      # redirect jvm logs to the data directory
      mkdir -m 0700 -p ${config.paths.home}/logs
      ${pkgs.sd}/bin/sd 'logs/gc.log' '${config.paths.home}/logs/gc.log' ${config.paths.configDir}/jvm.options
    fi

    if [[ -f "${config.paths.configDir}/elasticsearch.yml" ]]; then
      rm -f ${config.paths.configDir}/elasticsearch.yml
    fi

    echo "${baseConfig}" > ${config.paths.configDir}/elasticsearch.yml
  '';

  run = pkgs.writeShellScript "elasticsearch_run" ''
    exec ${pkg}/bin/elasticsearch
  '';
in
{
  packages = [
    pkg
  ];

  env = [
    { name = "ES_PORT"; value = config.port; }
  ];

  processes = [
    {
      name = "elasticsearch";
      script = run;
      on_start = on_start_hook;
      env = {
        ES_HOME = config.paths.home;
        ES_PATH_CONF = config.paths.configDir;
        ES_JAVA_OPTS = "";
      };
    }
  ];
}
