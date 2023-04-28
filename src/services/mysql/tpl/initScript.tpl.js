export default {"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression, alias3=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "if ! test -e \""
    + alias2(((helper = (helper = lookupProperty(helpers,"HOME") || (depth0 != null ? lookupProperty(depth0,"HOME") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"HOME","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":9,"column":14},"end":{"line":9,"column":22}}}) : helper)))
    + "/"
    + alias2(alias3(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "\"; then\n    echo \"Creating initial database: "
    + alias2(alias3(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "\"\n    ( echo 'create database \\`"
    + alias2(alias3(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "\\`;'\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"schema") : stack1),{"name":"if","hash":{},"fn":container.program(2, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":12,"column":6},"end":{"line":21,"column":13}}})) != null ? stack1 : "")
    + "    ) | "
    + alias2(alias3((depths[1] != null ? lookupProperty(depths[1],"pkgName") : depths[1]), depth0))
    + "/bin/mysql -u "
    + alias2(alias3((depths[1] != null ? lookupProperty(depths[1],"superUser") : depths[1]), depth0))
    + " --socket "
    + alias2(alias3((depths[1] != null ? lookupProperty(depths[1],"UNIX_PORT") : depths[1]), depth0))
    + " -N\nfi\n";
},"2":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        echo 'use \\`"
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + "\\`;'\n        if [ -f \""
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"schema") : stack1), depth0))
    + "\" ]\n        then\n            cat "
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"schema") : stack1), depth0))
    + "\n        elif [ -d \""
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"schema") : stack1), depth0))
    + "\" ]\n        then\n            cat "
    + alias2(alias1(((stack1 = blockParams[1][0]) != null ? lookupProperty(stack1,"schema") : stack1), depth0))
    + "/*.sql\n        fi\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "if [[ ! -d \""
    + alias4(((helper = (helper = lookupProperty(helpers,"HOME") || (depth0 != null ? lookupProperty(depth0,"HOME") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"HOME","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":20}}}) : helper)))
    + "\" || ! -f \""
    + alias4(((helper = (helper = lookupProperty(helpers,"HOME") || (depth0 != null ? lookupProperty(depth0,"HOME") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"HOME","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":1,"column":31},"end":{"line":1,"column":39}}}) : helper)))
    + "/ibdata1\" ]]; then\n    echo \"Creating MySQL Data Directory...\"\n    mkdir -p "
    + alias4(((helper = (helper = lookupProperty(helpers,"HOME") || (depth0 != null ? lookupProperty(depth0,"HOME") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"HOME","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":3,"column":13},"end":{"line":3,"column":21}}}) : helper)))
    + "\n    "
    + alias4(((helper = (helper = lookupProperty(helpers,"pkgName") || (depth0 != null ? lookupProperty(depth0,"pkgName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pkgName","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":15}}}) : helper)))
    + "/bin/mysqld "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"CMD_FLAGS") || (depth0 != null ? lookupProperty(depth0,"CMD_FLAGS") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"CMD_FLAGS","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":4,"column":27},"end":{"line":4,"column":42}}}) : helper))) != null ? stack1 : "")
    + " --default-time-zone=SYSTEM --initialize-insecure\nfi\n\n# Create initial databases\n"
    + ((stack1 = container.hooks.blockHelperMissing.call(depth0,alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"databases") : stack1), depth0),{"name":"config.databases","hash":{},"fn":container.program(1, data, 1, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":8,"column":0},"end":{"line":24,"column":21}}})) != null ? stack1 : "")
    + "\n# Ensure a user exists because we don't want to run this service as 'root'\n(echo \"CREATE USER IF NOT EXISTS '"
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"user") : stack1), depth0))
    + "'@'localhost' IDENTIFIED WITH \"auth_socket\"};\"\n    echo \"GRANT ALL PRIVILEGES ON *.* TO '"
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"config") : depth0)) != null ? lookupProperty(stack1,"user") : stack1), depth0))
    + "'@'localhost' WITH GRANT OPTION;\"\n) | "
    + alias4(((helper = (helper = lookupProperty(helpers,"pkgName") || (depth0 != null ? lookupProperty(depth0,"pkgName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pkgName","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":29,"column":4},"end":{"line":29,"column":15}}}) : helper)))
    + "/bin/mysql -u "
    + alias4(((helper = (helper = lookupProperty(helpers,"superUser") || (depth0 != null ? lookupProperty(depth0,"superUser") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"superUser","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":29,"column":29},"end":{"line":29,"column":42}}}) : helper)))
    + " -N\n";
},"useData":true,"useDepths":true,"useBlockParams":true}