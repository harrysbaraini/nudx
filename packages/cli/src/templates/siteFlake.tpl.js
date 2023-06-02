export default {"1":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"name") : stack1), depth0))
    + " = import "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"file") : stack1), depth0))
    + " {\n          inherit pkgs;\n          inherit system;\n          config = builtins.fromJSON ''"
    + ((stack1 = alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"config") : stack1), depth0)) != null ? stack1 : "")
    + "'';\n      };\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "{\n  inputs = {\n    nixpkgs = { url = \"github:NixOS/nixpkgs\"; };\n    flake-utils = { url = \"github:numtide/flake-utils\"; };\n  };\n\n  outputs = { self, nixpkgs, flake-utils }:\n  flake-utils.lib.eachDefaultSystem (system:\n  let\n    pkgs = import nixpkgs {\n      inherit system;\n\n      # Makes the config pure as well.\n      config.allowBroken = true;\n      config.allowUnfree = true;\n      config.permittedInsecurePackages = [\n        \"openssl-1.1.1t\"\n      ];\n    };\n\n    ### Services\n    services = {\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"services") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":23,"column":6},"end":{"line":29,"column":15}}})) != null ? stack1 : "")
    + "    };\n\n    cli = import "
    + alias4(((helper = (helper = lookupProperty(helpers,"cliNix") || (depth0 != null ? lookupProperty(depth0,"cliNix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cliNix","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":32,"column":17},"end":{"line":32,"column":27}}}) : helper)))
    + " {\n        inherit pkgs;\n        inherit system;\n        envPrefix = \""
    + alias4(((helper = (helper = lookupProperty(helpers,"envPrefix") || (depth0 != null ? lookupProperty(depth0,"envPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"envPrefix","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":35,"column":21},"end":{"line":35,"column":34}}}) : helper)))
    + "\";\n        directory = \""
    + alias4(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"project") : depth0)) != null ? lookupProperty(stack1,"basePath") : stack1), depth0))
    + "\";\n        services = services;\n    };\n  in\n  {\n    packages = cli.packages;\n\n    devShell = cli.lib.mkShell {\n      name = \""
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":44,"column":14},"end":{"line":44,"column":20}}}) : helper)))
    + "\";\n      packages = cli.packages;\n\n      shellHook = ''\n         if [[ ! -f \"${cli.PROJECT_PROCFILE}\" ]]; then\n           cp -f ${cli.files.processesFile} ${cli.PROJECT_PROCFILE}\n         fi\n\n         # Load environment variables\n         if [[ ! -f \"${cli.PROJECT_SHELL_ENV}\" ]]; then\n          touch ${cli.PROJECT_SHELL_ENV}\n          echo -e \"${pkgs.lib.strings.concatStringsSep ''\\n'' (pkgs.lib.lists.forEach cli.env (x: ''${cli.ENV_PREFIX}_${x.name}=${builtins.toString x.value}''))}\" > ${cli.PROJECT_SHELL_ENV}\n         fi\n\n         set -o allexport\n         source ${cli.PROJECT_SHELL_ENV}\n         set +o allexport\n\n         # Service hooks\n         ${pkgs.lib.strings.concatStringsSep \"\\n\" cli.shellHooks}\n      '';\n    };\n  });\n}\n";
},"useData":true,"useBlockParams":true}