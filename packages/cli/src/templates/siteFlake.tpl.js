export default {"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "    "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"key") || (data && lookupProperty(data,"key"))) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"key","hash":{},"data":data,"loc":{"start":{"line":6,"column":4},"end":{"line":6,"column":12}}}) : helper)))
    + " = "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + ";\n";
},"3":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ((stack1 = lookupProperty(helpers,"each").call(depth0 != null ? depth0 : (container.nullContext || {}),blockParams[0][0],{"name":"each","hash":{},"fn":container.program(4, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":23,"column":4},"end":{"line":25,"column":13}}})) != null ? stack1 : "");
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "    "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.escapeExpression, alias3=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "{\n  inputs = {\n    nixpkgs = { url = \"github:NixOS/nixpkgs\"; };\n    flake-utils = { url = \"github:numtide/flake-utils\"; };\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"inputs") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":5,"column":4},"end":{"line":7,"column":13}}})) != null ? stack1 : "")
    + "  };\n\n  outputs = { self, nixpkgs, flake-utils, "
    + alias2(((helper = (helper = lookupProperty(helpers,"inputsKeys") || (depth0 != null ? lookupProperty(depth0,"inputsKeys") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(alias1,{"name":"inputsKeys","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":10,"column":42},"end":{"line":10,"column":56}}}) : helper)))
    + " }:\n  flake-utils.lib.eachDefaultSystem (system:\n  let\n    pkgs = import nixpkgs { inherit system; config.allowUnfree = true; };\n    lib = pkgs.lib;\n\n    services = { };\n\n    ###\n    ### Services\n    ###\n\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"outputs") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":22,"column":4},"end":{"line":26,"column":13}}})) != null ? stack1 : "")
    + "\n    ###\n    ### Process runner\n    ###\n\n    env.PROJECT_SHELL_ENV=\""
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"project") : depth0)) != null ? lookupProperty(stack1,"shellenvPath") : stack1), depth0))
    + "\";\n    env.PROJECT_PROCFILE=\""
    + alias2(alias3(((stack1 = (depth0 != null ? lookupProperty(depth0,"project") : depth0)) != null ? lookupProperty(stack1,"configPath") : stack1), depth0))
    + "/processes.json\";\n\n    servicesValues = lib.attrsets.zipAttrs (lib.attrsets.attrValues services);\n\n    cli.state = {\n      names = servicesValues.name or [ ];\n      env = lib.lists.flatten (servicesValues.env or [ ]);\n      packages = defaultPackages ++ (lib.lists.flatten (servicesValues.packages or [ ]));\n      processes = lib.lists.flatten (servicesValues.processes or [ ]);\n      shellHooks = servicesValues.shellHook or [ ];\n    };\n\n    processesFile = pkgs.writeText \"processes.json\" (\n      builtins.toJSON {\n        environment = builtins.listToAttrs cli.state.env;\n        processes = cli.state.processes;\n      }\n    );\n\n    # SCRIPT : Hooks\n    run_hooks = pkgs.writeShellScriptBin \"run_hooks\" ''\n      for hook in \"$@\"\n      do\n        echo \"Running hook: $hook\"\n        $hook\n      done\n    '';\n\n    ###\n    ### Group all packages\n    ###\n\n    defaultPackages = with pkgs; [\n      unixtools.netstat\n      hostctl\n      run_hooks\n    ];\n  in\n  {\n    devShell = pkgs.mkShell {\n      buildInputs = cli.state.packages;\n\n      shellHook = ''\n        if [[ ! -f \"${env.PROJECT_PROCFILE}\" ]]; then\n          cp -f ${processesFile} ${env.PROJECT_PROCFILE}\n        fi\n\n        # Load environment variables\n        if [[ ! -f \"${env.PROJECT_SHELL_ENV}\" ]]; then\n          echo -e \"${lib.strings.concatStringsSep \"\\n\" (lib.lists.forEach cli.state.env (x: ''NUDX_${x.name}=${x.value}''))}\" >> ${env.PROJECT_SHELL_ENV}\n        fi\n\n        if [[ -f \"${env.PROJECT_SHELL_ENV}\" ]]; then\n          set -o allexport\n          source ${env.PROJECT_SHELL_ENV}\n          set +o allexport\n        fi\n\n        # Service hooks\n        ${lib.strings.concatStringsSep \"\\n\" cli.state.shellHooks}\n      '';\n    };\n  });\n}\n";
},"useData":true,"useBlockParams":true}