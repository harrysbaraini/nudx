export default {"1":function(container,depth0,helpers,partials,data) {
    return "  gateway.auto_import_dangling_indices: true\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression, alias3=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "elasticsearch.pkg = pkgs."
    + alias2(((helper = (helper = lookupProperty(helpers,"selectedPkg") || (depth0 != null ? lookupProperty(depth0,"selectedPkg") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"selectedPkg","hash":{},"data":data,"loc":{"start":{"line":1,"column":25},"end":{"line":1,"column":40}}}) : helper)))
    + ";\n\nelasticsearch.baseConfig = ''\n  network.host: _local_\n  cluster.name: elasticsearch\n  discovery.type: single-node\n  http.port: "
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"port") : stack1), depth0))
    + "\n  transport.port: 0\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"isVersion7") : depth0),{"name":"if","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":9,"column":2},"end":{"line":11,"column":9}}})) != null ? stack1 : "")
    + "'';\n\nelasticsearch.files.logConfig = pkgs.writeText \"log4j2.properties\" ''\n  logger.action.name = org.elasticsearch.action\n  logger.action.level = info\n  appender.console.type = Console\n  appender.console.name = console\n  appender.console.layout.type = PatternLayout\n  appender.console.layout.pattern = [%d{ISO8601}][%-5p][%-25c{1.}] %marker%m%n\n  rootLogger.level = info\n  rootLogger.appenderRef.console.ref = console\n'';\n\nelasticsearch.scripts.on_start_hook = pkgs.writeShellScript \"onStartHook\" ''\n  if [[ ! -d \""
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"home") : stack1), depth0))
    + "\" ]]; then\n    mkdir -m 0700 -p "
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"home") : stack1), depth0))
    + "\n\n    # elasticsearch needs to create the elasticsearch.keystore in the config directory\n    # so this directory needs to be writable.\n    mkdir -m 0700 -p "
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"configDir") : stack1), depth0))
    + "\n\n    # Make sure the logging configuration for old elasticsearch versions is removed:\n    rm -f \""
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"configDir") : stack1), depth0))
    + "/logging.yml\"\n    cp ${elasticsearch.files.logConfig} "
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"configDir") : stack1), depth0))
    + "/log4j2.properties\n\n    mkdir -p "
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"configDir") : stack1), depth0))
    + "/scripts\n    mkdir -p "
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"home") : stack1), depth0))
    + "/plugins\n    ln -sfT ${elasticsearch.pkg}/lib "
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"home") : stack1), depth0))
    + "/lib\n    ln -sfT ${elasticsearch.pkg}/modules "
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"home") : stack1), depth0))
    + "/modules\n    cp ${elasticsearch.pkg}/config/jvm.options "
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"configDir") : stack1), depth0))
    + "/jvm.options\n\n    # redirect jvm logs to the data directory\n    mkdir -m 0700 -p "
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"home") : stack1), depth0))
    + "/logs\n    ${pkgs.sd}/bin/sd 'logs/gc.log' '"
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"home") : stack1), depth0))
    + "/logs/gc.log' "
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"configDir") : stack1), depth0))
    + "/jvm.options\n  fi\n\n  if [[ -f \""
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"configDir") : stack1), depth0))
    + "/elasticsearch.yml\" ]]; then\n    rm -f "
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"configDir") : stack1), depth0))
    + "/elasticsearch.yml\n  fi\n\n  echo \"${elasticsearch.baseConfig}\" > "
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"configDir") : stack1), depth0))
    + "/elasticsearch.yml\n'';\n\nelasticsearch.scripts.run = pkgs.writeShellScript \"elasticsearch_run\" ''\n  exec ${elasticsearch.pkg}/bin/elasticsearch\n'';\n\nservices.elasticsearch = {\n  packages = [ elasticsearch.pkg ];\n\n  env = [\n    { name = \"ES_PORT\"; value = \""
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"port") : stack1), depth0))
    + "\"; }\n  ];\n\n  processes = [\n    {\n      name = \"elasticsearch\";\n      script = \"${elasticsearch.scripts.run}\";\n      on_start = \"${elasticsearch.scripts.on_start_hook}\";\n      env = {\n        ES_HOME = \""
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"home") : stack1), depth0))
    + "\";\n        ES_PATH_CONF = \""
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"paths") : depth0)) != null ? lookupProperty(stack1,"configDir") : stack1), depth0))
    + "\";\n        ES_JAVA_OPTS = \"\";\n      };\n    }\n  ];\n};\n";
},"useData":true}