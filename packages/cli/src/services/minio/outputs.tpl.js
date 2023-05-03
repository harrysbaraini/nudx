export default {"1":function(container,depth0,helpers,partials,data) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  PORT="
    + container.escapeExpression(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"port") : stack1), depth0))
    + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    return "  PORT=$(exec ${findPort}/bin/findPort)\n";
},"5":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    if [[ ! -d \""
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"dataDir") : depths[1]), depth0))
    + "/"
    + alias2(alias1(blockParams[0][0], depth0))
    + "\" ]]; then\n      mkdir -p \""
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"dataDir") : depths[1]), depth0))
    + "/"
    + alias2(alias1(blockParams[0][0], depth0))
    + "\n    fi\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "minio.pkg = pkgs.minio;\nminio.host = \"127.0.0.1\";\n\nminio.scripts.run = pkgs.writeShellScript \"runMinio\" ''\n  # We look for a free port if no port is provided\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"port") : stack1),{"name":"if","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.program(3, data, 0, blockParams, depths),"data":data,"blockParams":blockParams,"loc":{"start":{"line":6,"column":2},"end":{"line":10,"column":9}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"buckets") : stack1),{"name":"each","hash":{},"fn":container.program(5, data, 1, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":12,"column":2},"end":{"line":16,"column":11}}})) != null ? stack1 : "")
    + "\n  ADDRESS=\"${minio.host}:$PORT\"\n  echo \"NUDX_MINIO_ADDRESS=$ADDRESS\" >> ${env.PROJECT_SHELL_ENV}\n\n  ${minio.pkg}/bin/minio server --address $ADDRESS "
    + alias2(((helper = (helper = lookupProperty(helpers,"dataDir") || (depth0 != null ? lookupProperty(depth0,"dataDir") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"dataDir","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":21,"column":51},"end":{"line":21,"column":62}}}) : helper)))
    + "\n'';\n\nservices.minio = {\n  packages = [ minio.pkg ];\n\n  processes = [\n    {\n      name = \""
    + alias2(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"site") : depth0)) != null ? lookupProperty(stack1,"id") : stack1), depth0))
    + "-minio\";\n      value = {\n        command = \"${minio.scripts.run}\";\n        availability = {\n          restart = \"always\";\n        };\n      };\n    }\n  ];\n};\n";
},"useData":true,"useDepths":true,"useBlockParams":true}