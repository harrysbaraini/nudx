export default {"1":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  if ! test -e \"${mysql.dataDir}/"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "\"; then\n      ( echo 'create database if not exists `"
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "`;'\n"
    + ((stack1 = lookupProperty(helpers,"if").call(depth0 != null ? depth0 : (container.nullContext || {}),((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"schema") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":63,"column":8},"end":{"line":72,"column":15}}})) != null ? stack1 : "")
    + "      ) >> ${mysql.initSql}\n  fi\n";
},"2":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "          echo 'use `"
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "`;'\n          if [ -f \""
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"schema") : stack1), depth0))
    + "\" ]\n          then\n              cat "
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"schema") : stack1), depth0))
    + "\n          elif [ -d \""
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"schema") : stack1), depth0))
    + "\" ]\n          then\n              cat "
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"schema") : stack1), depth0))
    + "/*.sql\n          fi\n";
},"4":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    { name = \""
    + alias4(((helper = (helper = lookupProperty(helpers,"env") || (depth0 != null ? lookupProperty(depth0,"env") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"env","hash":{},"data":data,"loc":{"start":{"line":91,"column":14},"end":{"line":91,"column":21}}}) : helper)))
    + "\"; value = \""
    + alias4(((helper = (helper = lookupProperty(helpers,"name") || (depth0 != null ? lookupProperty(depth0,"name") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"name","hash":{},"data":data,"loc":{"start":{"line":91,"column":33},"end":{"line":91,"column":41}}}) : helper)))
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
    + "/mysql\";\nmysql.dataDir = \"${mysql.baseDir}/data\";\nmysql.pidFile = \"${mysql.baseDir}/mysql.pid\";\nmysql.logFile = \"${mysql.baseDir}/mysql.log\";\nmysql.socketFile = \"${mysql.baseDir}/mysql.sock\";\nmysql.initSql = \"${mysql.baseDir}/init.sql\";\nmysql.confFile = \"${mysql.baseDir}/mysql.cnf\";\n\nmysql.address = \""
    + alias2(alias3(((stack1 = ((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"site") : stack1)) != null ? lookupProperty(stack1,"ip") : stack1), depth0))
    + "\";\nmysql.port = \""
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"port") : stack1), depth0))
    + "\";\n\nmysql.baseConfig = ''\n  [mysqld]\n  init-file=${mysql.initSql}\n  datadir=${mysql.dataDir}\n  socket=${mysql.socketFile}\n  pid-file=${mysql.pidFile}\n  log-error=${mysql.logFile}\n  symbolic-links=0\n  ssl=0\n\n  [client]\n  socket=${mysql.socketFile}\n  bind-address=${mysql.address}\n  port=${mysql.port}\n'';\n\nmysql.cmdFlags = \"--defaults-file=${mysql.confFile} --basedir=${mysql.pkg} --datadir=${mysql.dataDir}\";\n\nmysql.scripts.on_start = pkgs.writeShellScript \"mysql_on_start\" ''\n  if [[ ! -d  \"${mysql.baseDir}\" ]]; then\n    mkdir -p ${mysql.baseDir}\n  fi\n\n  if [[ -f \""
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"configDir") : stack1), depth0))
    + "/mysql.cnf\" ]]; then\n    rm -f "
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"configDir") : stack1), depth0))
    + "/mysql.cnf\n  fi\n\n  echo \"${mysql.baseConfig}\" > ${mysql.confFile}\n\n  # Create MySQL data directory\n  if [[ ! -d \"${mysql.dataDir}\" || ! -f \"${mysql.dataDir}/ibdata1\" ]]; then\n    mkdir -p ${mysql.dataDir}\n    ${mysql.pkg}/bin/mysqld ${mysql.cmdFlags} --default-time-zone=SYSTEM --initialize-insecure\n  fi\n\n  if [[ -f \"${mysql.initSql}\" ]]; then\n    rm -f ${mysql.initSql}\n  fi\n\n  touch ${mysql.initSql}\n\n  # Create user\n  (echo \"CREATE USER IF NOT EXISTS '"
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"user") : stack1), depth0))
    + "'@'localhost' IDENTIFIED WITH \"auth_socket\"};\"\n      echo \"GRANT ALL PRIVILEGES ON *.* TO '"
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"user") : stack1), depth0))
    + "'@'localhost' WITH GRANT OPTION;\"\n  ) >> ${mysql.initSql}\n\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"databases") : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":60,"column":2},"end":{"line":75,"column":11}}})) != null ? stack1 : "")
    + "'';\n\nmysql.scripts.run = pkgs.writeShellScript \"mysql_run\" ''\n  exec ${mysql.pkg}/bin/mysqld ${mysql.cmdFlags}\n'';\n\nservices.mysql = {\n  packages = [ mysql.pkg ];\n\n  env = [\n    { name = \"MYSQL_SOCKET\"; value = \"${mysql.socketFile}\"; }\n    { name = \"MYSQL_USER\"; value = \"dbuser\"; }\n    { name = \"MYSQL_PASSWORD\"; value = \"password\"; }\n    { name = \"MYSQL_PORT\"; value = mysql.port; }\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"databases") : stack1),{"name":"each","hash":{},"fn":container.program(4, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":90,"column":4},"end":{"line":92,"column":13}}})) != null ? stack1 : "")
    + "  ];\n\n  processes = [\n    {\n      name = \"mysql\";\n      script = \"${mysql.scripts.run}\";\n      on_start = \"${mysql.scripts.on_start}\";\n    }\n  ];\n\n};\n";
},"useData":true,"useBlockParams":true}