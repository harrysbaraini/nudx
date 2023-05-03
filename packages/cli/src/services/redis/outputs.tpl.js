export default {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "redis.pkg = pkgs.redis;\nredis.dataDir = \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"site") : depth0)) != null ? lookupProperty(stack1,"statePath") : stack1), depth0))
    + "/redis\";\nredis.socketFile = \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"site") : depth0)) != null ? lookupProperty(stack1,"statePath") : stack1), depth0))
    + "/redis.sock\";\n\nredis.configFile = pkgs.writeText \"redis.conf\" ''\n  port 0\n  unixsocket ${redis.socketFile}\n  unixsocketperm 700\n  dir ${redis.dataDir}\n'';\n\nservices.redis = {\n  packages = [ redis.pkg ];\n\n  processes = [\n    {\n      name = \""
    + alias2(alias1(((stack1 = (depth0 != null ? lookupProperty(depth0,"site") : depth0)) != null ? lookupProperty(stack1,"id") : stack1), depth0))
    + "-redis\";\n      value = {\n        command = \"${redis.pkg}/bin/redis-server ${redis.configFile}\";\n        availability = {\n          restart = \"always\";\n        };\n      };\n    }\n  ];\n\n  onStartHook = ''\n    if [[ ! -d \"${redis.dataDir}\" ]]; then\n      mkdir -p \"${redis.dataDir}\"\n    fi\n  '';\n};\n";
},"useData":true}