export default {"1":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "        # ENV - "
    + alias1(container.lambda(((stack1 = (depth0 != null ? lookupProperty(depth0,"site") : depth0)) != null ? lookupProperty(stack1,"id") : stack1), depth0))
    + "\n        set -o allexport\n        source "
    + alias1(((helper = (helper = lookupProperty(helpers,"shellenvPath") || (depth0 != null ? lookupProperty(depth0,"shellenvPath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"shellenvPath","hash":{},"data":data,"loc":{"start":{"line":89,"column":15},"end":{"line":89,"column":31}}}) : helper)))
    + "\n        set +o allexport\n\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "{\n  # Flake inputs\n  inputs = {\n      nixpkgs.url = \"github:NixOS/nixpkgs\";\n      flake-utils = { url = \"github:numtide/flake-utils\"; };\n  };\n\n  # Flake outputs\n  outputs = { self, nixpkgs, flake-utils }:\n  flake-utils.lib.eachDefaultSystem (system:\n  let\n    pkgs = import nixpkgs { inherit system; };\n\n    # Build Caddy\n    caddy = with pkgs; stdenv.mkDerivation rec {\n      pname = \"caddy\";\n      version = \"2.6.4\";\n      dontUnpack = true;\n      nativeBuildInputs = [ git go xcaddy ];\n      plugins = [\n        \"github.com/mholt/caddy-l4/layer4\"\n        \"github.com/mholt/caddy-l4/modules/l4http\"\n        \"github.com/mholt/caddy-l4/modules/l4proxy\"\n      ];\n\n      configurePhase = ''\n        export GOCACHE=$TMPDIR/go-cache\n        export GOPATH=\"$TMPDIR/go\"\n      '';\n\n      buildPhase = let\n        pluginArgs = lib.concatMapStringsSep \" \" (plugin: \"--with ${plugin}\") plugins;\n      in ''\n        runHook preBuild\n        ${xcaddy}/bin/xcaddy build \"v${version}\" ${pluginArgs}\n        runHook postBuild\n      '';\n\n      installPhase = ''\n        runHook preInstall\n        mkdir -p $out/bin\n        mv caddy $out/bin\n        runHook postInstall\n      '';\n    };\n\n    basicCaddyConfig = pkgs.writeText \"Caddyfile\" ''\n      "
    + ((stack1 = ((helper = (helper = lookupProperty(helpers,"basicCaddyConfig") || (depth0 != null ? lookupProperty(depth0,"basicCaddyConfig") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"basicCaddyConfig","hash":{},"data":data,"loc":{"start":{"line":48,"column":6},"end":{"line":48,"column":28}}}) : helper))) != null ? stack1 : "")
    + "\n    '';\n\n    env.CLI_SOCKET=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"statePath") || (depth0 != null ? lookupProperty(depth0,"statePath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"statePath","hash":{},"data":data,"loc":{"start":{"line":51,"column":20},"end":{"line":51,"column":33}}}) : helper)))
    + "/nudxserver.sock\";\n    env.CLI_PID=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"statePath") || (depth0 != null ? lookupProperty(depth0,"statePath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"statePath","hash":{},"data":data,"loc":{"start":{"line":52,"column":17},"end":{"line":52,"column":30}}}) : helper)))
    + "/nudx.pid\";\n    env.CLI_LOCK=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"statePath") || (depth0 != null ? lookupProperty(depth0,"statePath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"statePath","hash":{},"data":data,"loc":{"start":{"line":53,"column":18},"end":{"line":53,"column":31}}}) : helper)))
    + "/nudx.lock\";\n    env.CLI_PROCESSES_FILE=\""
    + alias4(((helper = (helper = lookupProperty(helpers,"configPath") || (depth0 != null ? lookupProperty(depth0,"configPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"configPath","hash":{},"data":data,"loc":{"start":{"line":54,"column":28},"end":{"line":54,"column":42}}}) : helper)))
    + "/processes.json\";\n\n    # SCRIPT - Run Caddy\n    runCaddy = pkgs.writeShellScriptBin \"runCaddy\" ''\n      exec ${caddy}/bin/caddy run --config ${basicCaddyConfig}\n    '';\n\n    # SCRIPT - Start Server\n    startServer = pkgs.writeShellScriptBin \"startServer\" ''\n      if [[ ! -d \""
    + alias4(((helper = (helper = lookupProperty(helpers,"statePath") || (depth0 != null ? lookupProperty(depth0,"statePath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"statePath","hash":{},"data":data,"loc":{"start":{"line":63,"column":18},"end":{"line":63,"column":31}}}) : helper)))
    + "\" ]]; then\n        mkdir -p "
    + alias4(((helper = (helper = lookupProperty(helpers,"statePath") || (depth0 != null ? lookupProperty(depth0,"statePath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"statePath","hash":{},"data":data,"loc":{"start":{"line":64,"column":17},"end":{"line":64,"column":30}}}) : helper)))
    + "\n      fi\n\n      if [[ \"$1\" == \"daemon\" ]]; then\n        ${pkgs.daemonize}/bin/daemonize -p ${env.CLI_PID} -l ${env.CLI_LOCK} -c "
    + alias4(((helper = (helper = lookupProperty(helpers,"statePath") || (depth0 != null ? lookupProperty(depth0,"statePath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"statePath","hash":{},"data":data,"loc":{"start":{"line":68,"column":80},"end":{"line":68,"column":93}}}) : helper)))
    + " ${pkgs.process-compose}/bin/process-compose up $2 -t=false -f ${env.CLI_PROCESSES_FILE}\n        echo \"Server started!\"\n      elif [[ \"$1\" == \"tui\" ]]; then\n        exec ${pkgs.process-compose}/bin/process-compose up $2 -f ${env.CLI_PROCESSES_FILE}\n      else\n        echo \"First argument cannot be processed! It must be 'daemon' or 'tui'\"\n        exit 1;\n      fi\n    '';\n\n    # Packages\n    packages = with pkgs; [process-compose caddy startServer runCaddy];\n  in\n  {\n    devShell = pkgs.mkShell {\n      buildInputs = packages;\n\n      shellHook = ''\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"sites") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data,"loc":{"start":{"line":86,"column":8},"end":{"line":92,"column":17}}})) != null ? stack1 : "")
    + "      '';\n    };\n  });\n}\n";
},"useData":true}