export default {"1":function(container,depth0,helpers,partials,data,blockParams) {
    return " all."
    + container.escapeExpression(container.lambda(blockParams[0][0], depth0))
    + " ";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression, alias3=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "php.pkg = pkgs."
    + alias2(((helper = (helper = lookupProperty(helpers,"phpPkg") || (depth0 != null ? lookupProperty(depth0,"phpPkg") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"phpPkg","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":1,"column":15},"end":{"line":1,"column":25}}}) : helper)))
    + ".buildEnv {\nextensions = { enabled, all }: enabled ++ ["
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"extensions") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":2,"column":43},"end":{"line":2,"column":96}}})) != null ? stack1 : "")
    + "];\n  extraConfig = \"memory_limit=-1\";\n};\n\nphp.files.phpIni = pkgs.writeText \"php.ini\" ''\n  memory_limit=-1\n'';\n\nphp.files.fpmConfig = pkgs.writeText \"php-fpm.conf\" ''\n  [global]\n  pid="
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"fpm") : depth0)) != null ? lookupProperty(stack1,"pidFile") : stack1), depth0))
    + "\n  error_log="
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"site") : depth0)) != null ? lookupProperty(stack1,"statePath") : stack1), depth0))
    + "/php-fpm.log\n  emergency_restart_threshold=10\n  emergency_restart_interval=1m\n  process_control_timeout=10s\n\n  ["
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"site") : depth0)) != null ? lookupProperty(stack1,"id") : stack1), depth0))
    + "]\n  pm=dynamic\n  pm.max_children=2\n  pm.start_servers=1\n  pm.min_spare_servers=1\n  pm.max_spare_servers=1\n  pm.max_requests=100\n  listen="
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"fpm") : depth0)) != null ? lookupProperty(stack1,"socketFile") : stack1), depth0))
    + "\n'';\n\nphp.scripts.run = pkgs.writeShellScript \"php_run\" ''\n  exec ${php.pkg}/bin/php-fpm -F -y ${php.files.fpmConfig} -c ${php.files.phpIni}\n'';\n\nservices.php = {\n  packages = [\n    php.pkg\n    php.pkg.packages.composer\n  ];\n\n  env = [\n    { name = \"PHP_PATH\"; value = \"${php.pkg}/bin/php\"; }\n  ];\n\n  processes = [\n    {\n      name = \"phpfpm\";\n      script = \"${php.scripts.run}\";\n    }\n  ];\n};\n";
},"useData":true,"useBlockParams":true}