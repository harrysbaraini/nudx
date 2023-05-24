export default {"1":function(container,depth0,helpers,partials,data) {
    return "  port=${mysql.port}\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "  skip_networking=1\n";
},"5":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    ( echo 'create database if not exists `"
    + container.escapeExpression(container.lambda(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "`;'\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"schema") : stack1),{"name":"if","hash":{},"fn":container.program(6, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":90,"column":6},"end":{"line":99,"column":13}}})) != null ? stack1 : "")
    + "    ) >> ${mysql.initSql}\n";
},"6":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        echo 'use `"
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "`;'\n        if [ -f \""
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"schema") : stack1), depth0))
    + "\" ]\n        then\n            cat "
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"schema") : stack1), depth0))
    + "\n        elif [ -d \""
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"schema") : stack1), depth0))
    + "\" ]\n        then\n            cat "
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"schema") : stack1), depth0))
    + "/*.sql\n        fi\n";
},"8":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    { name = \""
    + alias4(((helper = (helper = lookupProperty(helpers,"env") || (depth0 != null ? lookupProperty(depth0,"env") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"env","hash":{},"data":data,"loc":{"start":{"line":134,"column":14},"end":{"line":134,"column":21}}}) : helper)))
    + "\"; value = \""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":134,"column":33},"end":{"line":134,"column":41}}}) : helper)))
    + "\"; }\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression, alias3=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "mysql.pkg = pkgs."
    + alias2(((helper = (helper = lookupProperty(helpers,"pkg") || (depth0 != null ? lookupProperty(depth0,"pkg") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"pkg","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":1,"column":17},"end":{"line":1,"column":24}}}) : helper)))
    + ";\n\nmysql.baseDir = \""
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"site") : depth0)) != null ? lookupProperty(stack1,"statePath") : stack1), depth0))
    + "/mysql\";\nmysql.dataDir = \"${mysql.baseDir}/data\";\nmysql.pidFile = \"${mysql.baseDir}/mysql.pid\";\nmysql.logFile = \"${mysql.baseDir}/mysql.log\";\nmysql.socketFile = \"${mysql.baseDir}/mysql.sock\";\nmysql.initSql = \"${mysql.baseDir}/init.sql\";\nmysql.confFile = \"${mysql.baseDir}/mysql.cnf\";\n\nmysql.port = \""
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"port") : stack1), depth0))
    + "\";\n\nmysql.baseConfig = ''\n  [mysqld]\n  socket=${mysql.socketFile}\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"port") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams),"inverse":container.program(3, data, 0, blockParams),"data":data,"blockParams":blockParams,"loc":{"start":{"line":16,"column":2},"end":{"line":20,"column":9}}})) != null ? stack1 : "")
    + "\n  init-file=${mysql.initSql}\n  basedir=${mysql.pkg}\n  datadir=${mysql.dataDir}\n  socket=${mysql.socketFile}\n  pid-file=${mysql.pidFile}\n  log-error=${mysql.logFile}\n  max_allowed_packet=256M\n  sql_mode=\"STRICT_TRANS_TABLES,ONLY_FULL_GROUP_BY,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION\"\n\n  innodb_log_buffer_size = 64M\n  innodb_read_io_threads = 12\n  innodb_write_io_threads = 12\n  innodb_stats_on_metadata = 0\n  innodb_file_per_table = 1\n\n  max_connections = 500\n  thread_cache_size = 128\n  table_definition_cache = 65536\n  table_open_cache = 65536\n\n  wait_timeout = 10\n  connect_timeout = 5\n  interactive_timeout = 30\n\n  tmp_table_size = 128M\n  max_heap_table_size = 128M\n\n  read_buffer_size = 256K\n  join_buffer_size = 512K\n  sort_buffer_size = 512K\n  read_rnd_buffer_size = 512K\n\n  ssl=0\n\n  [mysql]\n  max_allowed_packet = 256M\n\n  [client]\n  socket=${mysql.socketFile}\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"port") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":61,"column":2},"end":{"line":63,"column":9}}})) != null ? stack1 : "")
    + "'';\n\nmysql.clientFlags = \"--defaults-file=${mysql.confFile}\";\nmysql.daemonFlags = \"${mysql.clientFlags} --basedir=${mysql.pkg} --datadir=${mysql.dataDir}\";\n\nmysql.scripts.on_build = pkgs.writeShellScript \"mysql_on_build\" ''\n  if [[ ! -d  \"${mysql.baseDir}\" ]]; then\n    mkdir -p ${mysql.baseDir}\n  fi\n\n  # Create the configuration file\n  if [[ -f \"${mysql.confFile}\" ]]; then\n    rm ${mysql.confFile}\n  fi\n\n  echo \"${mysql.baseConfig}\" > ${mysql.confFile}\n\n  # Create the initial SQL file\n  if [[ -f \"${mysql.initSql}\" ]]; then\n    rm ${mysql.initSql}\n  fi\n\n  touch ${mysql.initSql}\n\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"databases") : stack1),{"name":"each","hash":{},"fn":container.program(5, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":88,"column":2},"end":{"line":101,"column":11}}})) != null ? stack1 : "")
    + "\n  # TODO: Delete users that were removed from dev.json\n\n  # Create user\n  (echo \"CREATE USER IF NOT EXISTS '"
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"user") : stack1), depth0))
    + "'@'localhost' IDENTIFIED BY '"
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"password") : stack1), depth0))
    + "';\"\n      echo \"GRANT ALL PRIVILEGES ON *.* TO '"
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"user") : stack1), depth0))
    + "'@'localhost';\"\n  ) >> ${mysql.initSql}\n\n  echo \"FLUSH PRIVILEGES\" >> ${mysql.initSql}\n\n  # Create MySQL data directory\n  if [[ ! -d \"${mysql.dataDir}\" || ! -f \"${mysql.dataDir}/ibdata1\" ]]; then\n    mkdir -p ${mysql.dataDir}\n    ${mysql.pkg}/bin/mysqld ${mysql.daemonFlags} --default-time-zone=SYSTEM --initialize-insecure\n  fi\n'';\n\nmysql.scripts.run = pkgs.writeShellScript \"mysql_run\" ''\n  exec ${mysql.pkg}/bin/mysqld ${mysql.daemonFlags}\n'';\n\nservices.mysql = {\n  packages = [ mysql.pkg ];\n\n  env = [\n    { name = \"MYSQL_SOCKET\"; value = \"${mysql.socketFile}\"; }\n    { name = \"MYSQL_USER\"; value = \""
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"user") : stack1), depth0))
    + "\"; }\n    { name = \"MYSQL_PASSWORD\"; value = \""
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"password") : stack1), depth0))
    + "\"; }\n    { name = \"MYSQL_ROOT_USER\"; value = \"root\"; }\n    { name = \"MYSQL_ROOT_PASSWORD\"; value = \"\"; }\n    { name = \"MYSQL_PORT\"; value = \"${mysql.port}\"; }\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"databases") : stack1),{"name":"each","hash":{},"fn":container.program(8, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":133,"column":4},"end":{"line":135,"column":13}}})) != null ? stack1 : "")
    + "  ];\n\n  processes = [\n    {\n      name = \"mysql\";\n      script = \"${mysql.scripts.run}\";\n      on_build = \"${mysql.scripts.on_build}\";\n    }\n  ];\n\n};\n";
},"useData":true,"useBlockParams":true}