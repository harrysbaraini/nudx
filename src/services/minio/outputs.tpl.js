export default {"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  if [[ ! -d \""
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"dataDir") : depths[1]), depth0))
    + "/"
    + alias2(alias1(blockParams[0][0], depth0))
    + "\" ]]; then\n    mkdir -p "
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"dataDir") : depths[1]), depth0))
    + "/"
    + alias2(alias1(blockParams[0][0], depth0))
    + "\n  fi\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "minio.pkg = pkgs.minio;\n\nminio.scripts.on_start = pkgs.writeShellScript \"minio_on_start_hook\" ''\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,((stack1 = (depth0 != null ? lookupProperty(depth0,"options") : depth0)) != null ? lookupProperty(stack1,"buckets") : stack1),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams, depths),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":4,"column":2},"end":{"line":8,"column":11}}})) != null ? stack1 : "")
    + "'';\n\nminio.scripts.run = pkgs.writeShellScript \"minio_run\" ''\n  exec ${minio.pkg}/bin/minio server --address "
    + alias4(((helper = (helper = lookupProperty(helpers,"address") || (depth0 != null ? lookupProperty(depth0,"address") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"address","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":12,"column":47},"end":{"line":12,"column":58}}}) : helper)))
    + " "
    + alias4(((helper = (helper = lookupProperty(helpers,"dataDir") || (depth0 != null ? lookupProperty(depth0,"dataDir") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"dataDir","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":12,"column":59},"end":{"line":12,"column":70}}}) : helper)))
    + "\n'';\n\nservices.minio = {\n  packages = [ minio.pkg ];\n\n  processes = [\n    {\n      name = \"minio\";\n      script = \"${minio.scripts.run}\";\n      on_start = \"${minio.scripts.on_start}\";\n    }\n  ];\n};\n";
},"useData":true,"useDepths":true,"useBlockParams":true}