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
    + "/redis.sock\";\n\nredis.configFile = pkgs.writeText \"redis.conf\" ''\n  port 0\n  unixsocket ${redis.socketFile}\n  unixsocketperm 700\n  dir ${redis.dataDir}\n'';\n\nredis.scripts.on_start = pkgs.writeShellScript \"redis_on_start\" ''\n  if [[ ! -d \"${redis.dataDir}\" ]]; then\n    mkdir -p \"${redis.dataDir}\"\n  fi\n'';\n\nredis.scripts.run = pkgs.writeShellScript \"redis_run\" ''\n  exec ${redis.pkg}/bin/redis-server ${redis.configFile}\n'';\n\nservices.redis = {\n  packages = [ redis.pkg ];\n\n  processes = [\n    {\n      name = \"redis\";\n      script = \"${redis.scripts.run}\";\n      on_start = \"${redis.scripts.on_start}\";\n    }\n  ];\n};\n";
},"useData":true}