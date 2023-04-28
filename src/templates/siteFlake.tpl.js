export default {"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"key") || (data && lookupProperty(data,"key"))) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"key","hash":{},"data":data,"loc":{"start":{"line":27,"column":8},"end":{"line":27,"column":16}}}) : helper)))
    + ": "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\n";
},"3":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = "";

  stack1 = ((helper = (helper = lookupProperty(helpers,"onStopHooks") || (depth0 != null ? lookupProperty(depth0,"onStopHooks") : depth0)) != null ? helper : container.hooks.helperMissing),(options={"name":"onStopHooks","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":77,"column":6},"end":{"line":81,"column":22}}}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!lookupProperty(helpers,"onStopHooks")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"4":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.hooks.blockHelperMissing.call(depth0,container.lambda(depth0, depth0),{"name":".","hash":{},"fn":container.program(5, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":78,"column":8},"end":{"line":80,"column":14}}})) != null ? stack1 : "");
},"5":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "        "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\n";
},"7":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = "";

  stack1 = ((helper = (helper = lookupProperty(helpers,"onStartHooks") || (depth0 != null ? lookupProperty(depth0,"onStartHooks") : depth0)) != null ? helper : container.hooks.helperMissing),(options={"name":"onStartHooks","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":88,"column":6},"end":{"line":92,"column":23}}}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!lookupProperty(helpers,"onStartHooks")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"9":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = "";

  stack1 = ((helper = (helper = lookupProperty(helpers,"onStartedHooks") || (depth0 != null ? lookupProperty(depth0,"onStartedHooks") : depth0)) != null ? helper : container.hooks.helperMissing),(options={"name":"onStartedHooks","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":108,"column":6},"end":{"line":112,"column":25}}}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!lookupProperty(helpers,"onStartedHooks")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"11":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = 
  "    # Files & Scripts\n";
  stack1 = ((helper = (helper = lookupProperty(helpers,"files") || (depth0 != null ? lookupProperty(depth0,"files") : depth0)) != null ? helper : container.hooks.helperMissing),(options={"name":"files","hash":{},"fn":container.program(12, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":123,"column":4},"end":{"line":130,"column":14}}}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!lookupProperty(helpers,"files")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"12":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = 
  "    "
    + alias4(((helper = (helper = lookupProperty(helpers,"id") || (depth0 != null ? lookupProperty(depth0,"id") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"id","hash":{},"data":data,"loc":{"start":{"line":124,"column":4},"end":{"line":124,"column":10}}}) : helper)))
    + " = "
    + alias4(((helper = (helper = lookupProperty(helpers,"type") || (depth0 != null ? lookupProperty(depth0,"type") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"type","hash":{},"data":data,"loc":{"start":{"line":124,"column":13},"end":{"line":124,"column":21}}}) : helper)))
    + " \""
    + alias4(((helper = (helper = lookupProperty(helpers,"filename") || (depth0 != null ? lookupProperty(depth0,"filename") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"filename","hash":{},"data":data,"loc":{"start":{"line":124,"column":23},"end":{"line":124,"column":35}}}) : helper)))
    + "\" ''\n";
  stack1 = ((helper = (helper = lookupProperty(helpers,"content") || (depth0 != null ? lookupProperty(depth0,"content") : depth0)) != null ? helper : alias2),(options={"name":"content","hash":{},"fn":container.program(13, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":125,"column":6},"end":{"line":127,"column":18}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"content")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    '';\n\n";
},"13":function(container,depth0,helpers,partials,data) {
    var stack1;

  return "      "
    + ((stack1 = container.lambda(depth0, depth0)) != null ? stack1 : "")
    + "\n";
},"15":function(container,depth0,helpers,partials,data) {
    return "      "
    + container.escapeExpression(container.lambda(depth0, depth0))
    + "\n";
},"17":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      "
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"envPrefix") : depths[1]), depth0))
    + "_"
    + alias2(((helper = (helper = lookupProperty(helpers,"key") || (data && lookupProperty(data,"key"))) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"key","hash":{},"data":data,"loc":{"start":{"line":156,"column":23},"end":{"line":156,"column":31}}}) : helper)))
    + "=\""
    + ((stack1 = alias1(depth0, depth0)) != null ? stack1 : "")
    + "\";\n";
},"19":function(container,depth0,helpers,partials,data) {
    var stack1, helper, options, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = 
  "      # Script that is executed when shell is open\n      shellHook = ''\n";
  stack1 = ((helper = (helper = lookupProperty(helpers,"shellHooks") || (depth0 != null ? lookupProperty(depth0,"shellHooks") : depth0)) != null ? helper : container.hooks.helperMissing),(options={"name":"shellHooks","hash":{},"fn":container.program(4, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":162,"column":8},"end":{"line":166,"column":23}}}),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),options) : helper));
  if (!lookupProperty(helpers,"shellHooks")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "      '';\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = 
  "{\n  # Flake inputs\n  inputs = {\n    nixpkgs.url = \"github:NixOS/nixpkgs\";\n    flake-utils = { url = \"github:numtide/flake-utils\"; };\n    php-shell.url = \"github:loophp/nix-shell\";\n  };\n\n  # Flake outputs\n  outputs = { self, nixpkgs, flake-utils, php-shell }:\n  flake-utils.lib.eachDefaultSystem (system:\n  let\n    pkgs = import nixpkgs { inherit system; config.allowUnfree = true; };\n    phps = php-shell.packages.${system};\n\n    cliProcesses = [];\n\n    cliProcesses = cliProcesses ++ [\n      {\n        name=\"myprocess\";\n        cmd=\"/bin/myprocess start\";\n      }\n    ];\n\n    procfile = pkgs.writeText \"Procfile\" ''\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"processes") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":26,"column":6},"end":{"line":28,"column":15}}})) != null ? stack1 : "")
    + "    '';\n\n    env.OVERMIND_SOCKET=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"overmindSocketPath") || (depth0 != null ? lookupProperty(depth0,"overmindSocketPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"overmindSocketPath","hash":{},"data":data,"loc":{"start":{"line":31,"column":25},"end":{"line":31,"column":47}}}) : helper)))
    + ".sock\";\n\n    # SCRIPT : Get service PID\n    getServicePidScript = pkgs.writeShellScriptBin \"getServicePid\" ''\n      ${pkgs.overmind}/bin/overmind status -s ${env.OVERMIND_SOCKET} | awk -v service=\"$1\" '$1 == service { print $2 }'\n    '';\n\n    # SCRIPT : Find free port\n    findPortScript = pkgs.writeShellScriptBin \"findPort\" ''\n      if [[ -z $argv[1] ]]; then\n        startPort=$argv[1]\n      else\n        startPort=50000\n      fi\n\n      if [[ -z $argv[2] ]]; then\n        endPort=$argv[2]\n      else\n        endPort=65000\n      fi\n\n      netstat -aln | awk -v startPort=$startPort -v endPort=$endPort '\n        $6 == \"LISTEN\" {\n          if ($4 ~ \"[.:][0-9]+$\") {\n            split($4, a, /[:.]/);\n            port = a[length(a)];\n            p[port] = 1\n          }\n        }\n        END {\n          for (i = startPort; i < endPort && p[i]; i++){};\n          if (i == 65000) {exit 1};\n          print i\n        }\n      '\n    '';\n\n    # SCRIPT : Stop Project\n    stopProjectScript = pkgs.writeShellScriptBin \"stopProject\" ''\n      OVERMIND_PROCFILE=${procfile}\n\n      if [[ -S \"${env.OVERMIND_SOCKET}\" ]]; then\n          ${pkgs.overmind}/bin/overmind kill -s ${env.OVERMIND_SOCKET}\n      fi\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"onStopHooks") : depth0),{"name":"if","hash":{},"fn":container.program(3, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":76,"column":6},"end":{"line":82,"column":13}}})) != null ? stack1 : "")
    + "    '';\n\n    # SCRIPT : Start Project\n    startProjectScript = pkgs.writeShellScriptBin \"startProject\" ''\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"onStartHooks") : depth0),{"name":"if","hash":{},"fn":container.program(7, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":87,"column":6},"end":{"line":93,"column":13}}})) != null ? stack1 : "")
    + "\n      OVERMIND_PROCFILE=${procfile}\n\n      if [[ -S \"${env.OVERMIND_SOCKET}\" ]]; then\n          exec ${stopProjectScript}/bin/stopProject\n      fi\n\n      ${pkgs.overmind}/bin/overmind start \\\n          --procfile $OVERMIND_PROCFILE \\\n          --daemonize \\\n          --no-port \\\n          -s ${env.OVERMIND_SOCKET}\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"onStartedHooks") : depth0),{"name":"if","hash":{},"fn":container.program(9, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":107,"column":6},"end":{"line":113,"column":13}}})) != null ? stack1 : "")
    + "    '';\n\n    # SCRIPT : Print Info!\n    printInfoScript = pkgs.writeShellScriptBin \"printInfo\" ''\n      env | grep \"^"
    + alias4(((helper = (helper = lookupProperty(helpers,"envPrefix") || (depth0 != null ? lookupProperty(depth0,"envPrefix") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"envPrefix","hash":{},"data":data,"loc":{"start":{"line":118,"column":19},"end":{"line":118,"column":32}}}) : helper)))
    + "_\"\n    '';\n\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"files") : depth0),{"name":"if","hash":{},"fn":container.program(11, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":121,"column":4},"end":{"line":131,"column":11}}})) != null ? stack1 : "")
    + "\n    # Packages\n    packages = with pkgs; [\n      unixtools.netstat\n      hostctl\n      overmind\n      findPortScript\n      getServicePidScript\n      printInfoScript\n      startProjectScript\n      stopProjectScript\n";
  stack1 = ((helper = (helper = lookupProperty(helpers,"packages") || (depth0 != null ? lookupProperty(depth0,"packages") : depth0)) != null ? helper : alias2),(options={"name":"packages","hash":{},"fn":container.program(15, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":143,"column":6},"end":{"line":145,"column":19}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"packages")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    ];\n  in\n  {\n    devShell = pkgs.mkShell {\n      src = null;\n      buildInputs = packages;\n\n      # Environment variables\n      NUDX_PROCFILE=\"${procfile}\";\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"env") : depth0),{"name":"each","hash":{},"fn":container.program(17, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":155,"column":6},"end":{"line":157,"column":15}}})) != null ? stack1 : "")
    + "\n"
    + ((stack1 = lookupProperty(helpers,"if").call(alias1,(depth0 != null ? lookupProperty(depth0,"shellHooks") : depth0),{"name":"if","hash":{},"fn":container.program(19, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":159,"column":6},"end":{"line":168,"column":13}}})) != null ? stack1 : "")
    + "    };\n  });\n}\n";
},"useData":true,"useDepths":true}