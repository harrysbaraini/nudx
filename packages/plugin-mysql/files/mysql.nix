{ pkgs, system, config }:

let
  revisions = {
    "8.0" = {
      rev = "13513701a8f35ae6365ff84b996a4acef643802e";
      pkg = "mysql80";
    };
    "5.7" = {
      rev = "611bf8f183e6360c2a215fa70dfd659943a9857f";
      pkg = "mysql57";
    };
  };

  selectedVersion = revisions."${config.version}";

  importedPkgs = import
    (builtins.fetchTarball {
      url = "https://github.com/NixOS/nixpkgs/archive/${selectedVersion.rev}.tar.gz";
    })
    { };

  mysqlPkg = importedPkgs."${selectedVersion.pkg}";

  baseDir = "${config.statePath}/mysql";
  dataDir = "${baseDir}/data";
  pidFile = "${baseDir}/mysql.pid";
  logFile = "${baseDir}/mysql.log";
  socketFile = "${baseDir}/mysql.sock";
  initSql = "${baseDir}/init.sql";
  configFile = "${baseDir}/mysql.cnf";

  baseConfig = ''
    [mysqld]
    socket=${socketFile}
    port=${toString config.port}

    init-file=${initSql}
    basedir=${mysqlPkg}
    datadir=${dataDir}
    socket=${socketFile}
    pid-file=${pidFile}
    log-error=${logFile}
    max_allowed_packet=256M
    sql_mode="STRICT_TRANS_TABLES,ONLY_FULL_GROUP_BY,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION"

    innodb_log_buffer_size = 64M
    innodb_read_io_threads = 12
    innodb_write_io_threads = 12
    innodb_stats_on_metadata = 0
    innodb_file_per_table = 1

    max_connections = 500
    thread_cache_size = 128
    table_definition_cache = 65536
    table_open_cache = 65536

    wait_timeout = 10
    connect_timeout = 5
    interactive_timeout = 30

    tmp_table_size = 128M
    max_heap_table_size = 128M

    read_buffer_size = 256K
    join_buffer_size = 512K
    sort_buffer_size = 512K
    read_rnd_buffer_size = 512K

    ssl=0

    [mysql]
    max_allowed_packet = 256M

    [client]
    socket=${socketFile}
    port=${toString config.port}
  '';

  clientFlags = "--defaults-file=${configFile}";
  daemonFlags = "${clientFlags} --basedir=${mysqlPkg} --datadir=${dataDir}";

  scripts.on_build = pkgs.writeShellScript "mysql_on_build" ''
    if [[ ! -d  "${baseDir}" ]]; then
      mkdir -p ${baseDir}
    fi

    # Create the configuration file
    if [[ -f "${configFile}" ]]; then
      rm ${configFile}
    fi

    echo "${baseConfig}" > ${configFile}

    # Create the initial SQL file
    if [[ -f "${initSql}" ]]; then
      rm ${initSql}
    fi

    touch ${initSql}
    echo -e "${pkgs.lib.strings.concatStringsSep ''\n'' (pkgs.lib.lists.forEach config.databases (db: ''create database if not exists \`${db.name}\`;''))}" >> ${initSql}

    # TODO: Delete users that were removed from dev.json

    # Create user
    (echo "CREATE USER IF NOT EXISTS '${config.user}'@'localhost' IDENTIFIED BY '${config.password}';"
        echo "GRANT ALL PRIVILEGES ON *.* TO '${config.user}'@'localhost';"
    ) >> ${initSql}

    echo "FLUSH PRIVILEGES" >> ${initSql}

    # Create MySQL data directory
    if [[ ! -d "${dataDir}" || ! -f "${dataDir}/ibdata1" ]]; then
      mkdir -p ${dataDir}
      ${mysqlPkg}/bin/mysqld ${daemonFlags} --default-time-zone=SYSTEM --initialize-insecure
    fi
  '';

  scripts.run = pkgs.writeShellScript "mysql_run" ''
    exec ${mysqlPkg}/bin/mysqld ${daemonFlags}
  '';
in
{
  packages = [
    mysqlPkg
  ];

  env = [
    { name = "MYSQL_SOCKET"; value = socketFile; }
    { name = "MYSQL_USER"; value = config.user; }
    { name = "MYSQL_PASSWORD"; value = config.password; }
    { name = "MYSQL_ROOT_USER"; value = config.rootUser; }
    { name = "MYSQL_ROOT_PASSWORD"; value = config.rootPassword; }
    { name = "MYSQL_PORT"; value = toString config.port; }
  ] ++ config.dbEnvs;

  processes = [
    {
      name = "mysql";
      script = "${scripts.run}";
      on_build = "${scripts.on_build}";
    }
  ];
}
