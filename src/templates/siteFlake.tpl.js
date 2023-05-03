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
},"6":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      if [[ $(${pkgs.curl}/bin/curl -s -o /dev/null -w '%{http_code}' localhost:2019/id/"
    + container.escapeExpression(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"id") : stack1), depth0))
    + ") != \"200\" ]]; then\n        ${pkgs.curl}/bin/curl localhost:2019/config/apps/http/servers/srvHttp/routes \\\n            -X POST \\\n            -H \"Content-Type: application/json\" \\\n            -d '"
    + ((stack1 = alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"json") : stack1), depth0)) != null ? stack1 : "")
    + "'\n      fi\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "{\n  inputs = {\n    nixpkgs = { url = \"github:NixOS/nixpkgs\"; };\n    flake-utils = { url = \"github:numtide/flake-utils\"; };\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"inputs") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":5,"column":4},"end":{"line":7,"column":13}}})) != null ? stack1 : "")
    + "  };\n\n  outputs = { self, nixpkgs, flake-utils, "
    + alias4(((helper = (helper = lookupProperty(helpers,"inputsKeys") || (depth0 != null ? lookupProperty(depth0,"inputsKeys") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"inputsKeys","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":10,"column":42},"end":{"line":10,"column":56}}}) : helper)))
    + " }:\n  flake-utils.lib.eachDefaultSystem (system:\n  let\n    pkgs = import nixpkgs { inherit system; config.allowUnfree = true; };\n    lib = pkgs.lib;\n\n    services = { };\n\n    ###\n    ### Services\n    ###\n\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"outputs") : depth0),{"name":"each","hash":{},"fn":container.program(3, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":22,"column":4},"end":{"line":26,"column":13}}})) != null ? stack1 : "")
    + "\n    ###\n    ### Process runner\n    ###\n\n    env.PROJECT_SOCKET=\""
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"project") : depth0)) != null ? lookupProperty(stack1,"statePath") : stack1), depth0))
    + "/project.sock\";\n    env.PROJECT_SHELL_ENV=\""
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"project") : depth0)) != null ? lookupProperty(stack1,"shellenvPath") : stack1), depth0))
    + "\";\n    env.PROJECT_PROCFILE=\""
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"project") : depth0)) != null ? lookupProperty(stack1,"configPath") : stack1), depth0))
    + "/processes.json\";\n    env.CLI_PORTS=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"cliStatePath") || (depth0 != null ? lookupProperty(depth0,"cliStatePath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"cliStatePath","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":35,"column":19},"end":{"line":35,"column":35}}}) : helper)))
    + "/ports.txt\";\n\n    # SCRIPT : Find free port\n    findPort = pkgs.writeShellScriptBin \"findPort\" ''\n      if [[ -z $1 ]]; then\n        startPort=50000\n      else\n        startPort=$1\n      fi\n\n      if [[ -z $2 ]]; then\n        endPort=65000\n      else\n        endPort=$2\n      fi\n\n      for ((p=$startPort;p<$endPort;p++)); do\n        reserved=$(cat ${env.CLI_PORTS} | grep -x $p)\n        state=$(lsof -iTCP:$p -sTCP:LISTEN)\n\n        if [[ $reserved == \"\" && \"$state\" == \"\" ]]; then\n          echo $p\n          break\n        fi\n      done\n    '';\n\n    # SCRIPT : Start Project\n    startProject = pkgs.writeShellScriptBin \"startProject\" ''\n      # Create shell env file\n      if [[ -f \"${env.PROJECT_SHELL_ENV}\" ]]; then\n        rm -f ${env.PROJECT_SHELL_ENV}\n      fi\n\n      touch ${env.PROJECT_SHELL_ENV}\n\n      # Create ports file\n      if [[ -f \"${env.CLI_PORTS}\" ]]; then\n        rm -f ${env.CLI_PORTS}\n      fi\n\n      touch ${env.CLI_PORTS}\n\n      set -o allexport\n      source ${env.PROJECT_SHELL_ENV}\n      set +o allexport\n\n      # Start process-compose on background so we can run more stuff\n      set -m\n\n      ${lib.strings.concatStringsSep \"\\n\" cli.state.onStartHooks}\n      ${pkgs.process-compose}/bin/process-compose up -t=false -f ${env.PROJECT_PROCFILE} &\n      ${lib.strings.concatStringsSep \"\\n\" cli.state.onStartedHooks}\n\n      # Load virtualhosts to the server\n      sleep 5\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"virtualHosts") : depth0),{"name":"each","hash":{},"fn":container.program(6, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":91,"column":6},"end":{"line":98,"column":15}}})) != null ? stack1 : "")
    + "      jobs -l\n      fg %1\n    '';\n\n    ###\n    ### Group all packages\n    ###\n\n    defaultPackages = with pkgs; [\n      unixtools.netstat\n      hostctl\n      process-compose\n      findPort\n      startProject\n    ];\n\n    servicesValues = lib.attrsets.zipAttrs (lib.attrsets.attrValues services);\n\n    cli.state = {\n      names = servicesValues.name or [ ];\n      env = lib.lists.flatten (servicesValues.env or [ ]);\n      packages = defaultPackages ++ (lib.lists.flatten (servicesValues.packages or [ ]));\n      processes = lib.lists.flatten (servicesValues.processes or [ ]);\n      onStartHooks = servicesValues.onStartHook or [ ];\n      onStartedHooks = servicesValues.onStartedHook or [ ];\n      shellHooks = servicesValues.shellHook or [ ];\n    };\n\n    processesFile = pkgs.writeText \"processes.json\" (\n      builtins.toJSON {\n        environment = lib.lists.forEach cli.state.env (x: ''${x.name}=\\\"${x.value}\\\"'');\n        processes = builtins.listToAttrs cli.state.processes;\n      }\n    );\n  in\n  {\n    devShell = pkgs.mkShell {\n      buildInputs = cli.state.packages;\n\n      shellHook = ''\n        if [[ ! -f \"${env.PROJECT_PROCFILE}\" ]]; then\n          cp -f ${processesFile} ${env.PROJECT_PROCFILE}\n        fi\n\n        # Load environment variables\n        if [[ ! -f \"${env.PROJECT_SHELL_ENV}\" ]]; then\n          echo -e \"${lib.strings.concatStringsSep \"\\n\" (lib.lists.forEach cli.state.env (x: ''NUDX_${x.name}=${x.value}''))}\" >> ${env.PROJECT_SHELL_ENV}\n        fi\n\n        if [[ -f \"${env.PROJECT_SHELL_ENV}\" ]]; then\n          set -o allexport\n          source ${env.PROJECT_SHELL_ENV}\n          set +o allexport\n        fi\n\n        # Service hooks\n        ${lib.strings.concatStringsSep \"\\n\" cli.state.shellHooks}\n      '';\n    };\n  });\n}\n";
},"useData":true,"useBlockParams":true}