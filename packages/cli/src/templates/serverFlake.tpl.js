export default {"1":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "      "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"id") : stack1), depth0))
    + " = import "
    + alias2(alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"nixFile") : stack1), depth0))
    + " {\n        inherit pkgs;\n        inherit system;\n        config = builtins.fromJSON ''"
    + ((stack1 = alias1(((stack1 = blockParams[0][0]) != null ? lookupProperty(stack1,"config") : stack1), depth0)) != null ? stack1 : "")
    + "'';\n      };\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "{\n  # Flake inputs\n  inputs = {\n      nixpkgs.url = \"github:NixOS/nixpkgs\";\n      flake-utils = { url = \"github:numtide/flake-utils\"; };\n  };\n\n  # Flake outputs\n  outputs = { self, nixpkgs, flake-utils }:\n  flake-utils.lib.eachDefaultSystem (system:\n  let\n    pkgs = import nixpkgs { inherit system; };\n\n    # Build Caddy\n    caddy = with pkgs; stdenv.mkDerivation rec {\n      pname = \"caddy\";\n      version = \"2.6.4\";\n      dontUnpack = true;\n      nativeBuildInputs = [ git go xcaddy ];\n      plugins = [];\n\n      configurePhase = ''\n        export GOCACHE=$TMPDIR/go-cache\n        export GOPATH=\"$TMPDIR/go\"\n      '';\n\n      buildPhase = let\n        pluginArgs = lib.concatMapStringsSep \" \" (plugin: \"--with ${plugin}\") plugins;\n      in ''\n        runHook preBuild\n        ${xcaddy}/bin/xcaddy build \"v${version}\" ${pluginArgs}\n        runHook postBuild\n      '';\n\n      installPhase = ''\n        runHook preInstall\n        mkdir -p $out/bin\n        mv caddy $out/bin\n        runHook postInstall\n      '';\n    };\n\n    # Hostctl\n    remove_hosts_profile = pkgs.writeShellScriptBin \"remove_hosts_profile\" ''\n      sudo ${pkgs.hostctl}/bin/hostctl remove $@\n    '';\n\n    status_hosts_profile = pkgs.writeShellScriptBin \"status_hosts_profile\" ''\n      enabled=$(sudo ${pkgs.hostctl}/bin/hostctl status --raw) | awk -v profile=$1 '(NR>1 && $1==profile) {print 1}'\n      if [[ \"$enabled\" == \"1\" ]]; then\n        echo \"on\"\n      else\n        echo \"off\"\n      fi\n    '';\n\n    create_hosts_profile = pkgs.writeShellScriptBin \"create_hosts_profile\" ''\n      status=(${status_hosts_profile}/bin/status_hosts_profile $1)\n      if [[$status == \"on\"]]; then\n        ${remove_hosts_profile}/bin/remove_hosts_profile $1\n      fi\n\n      sudo ${pkgs.hostctl}/bin/hostctl add domains $@\n    '';\n\n    enable_hosts_profile = pkgs.writeShellScriptBin \"enable_hosts_profile\" ''\n      sudo ${pkgs.hostctl}/bin/hostctl enable $@\n    '';\n\n    disable_hosts_profile = pkgs.writeShellScriptBin \"disable_hosts_profile\" ''\n      sudo ${pkgs.hostctl}/bin/hostctl disable $@\n    '';\n\n    # Import plugins\n    plugins = {\n"
    + ((stack1 = lookupProperty(helpers,"each").call(alias1,(depth0 != null ? lookupProperty(depth0,"plugins") : depth0),{"name":"each","hash":{},"fn":container.program(1, data, 1, blockParams),"inverse":container.noop,"data":data,"blockParams":blockParams,"loc":{"start":{"line":76,"column":6},"end":{"line":82,"column":15}}})) != null ? stack1 : "")
    + "    };\n\n    pluginsValues = pkgs.lib.attrsets.zipAttrs (pkgs.lib.attrsets.attrValues plugins);\n\n    generated_at = \""
    + alias4(((helper = (helper = lookupProperty(helpers,"generatedAt") || (depth0 != null ? lookupProperty(depth0,"generatedAt") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"generatedAt","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":87,"column":20},"end":{"line":87,"column":35}}}) : helper)))
    + "\";\n  in\n  {\n    devShell = pkgs.mkShell {\n      packages = [\n        pkgs.hostctl\n        caddy\n        create_hosts_profile\n        remove_hosts_profile\n        enable_hosts_profile\n        disable_hosts_profile\n      ] ++ (pkgs.lib.lists.flatten (pkgs.lib.attrsets.attrByPath [\"packages\"] [] pluginsValues));\n\n      shellHook = ''\n        if [[ -d \""
    + alias4(((helper = (helper = lookupProperty(helpers,"binPath") || (depth0 != null ? lookupProperty(depth0,"binPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"binPath","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":101,"column":18},"end":{"line":101,"column":29}}}) : helper)))
    + "\" ]]; then\n          rm -rf "
    + alias4(((helper = (helper = lookupProperty(helpers,"binPath") || (depth0 != null ? lookupProperty(depth0,"binPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"binPath","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":102,"column":17},"end":{"line":102,"column":28}}}) : helper)))
    + "\n        fi\n\n        mkdir -p "
    + alias4(((helper = (helper = lookupProperty(helpers,"binPath") || (depth0 != null ? lookupProperty(depth0,"binPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"binPath","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":105,"column":17},"end":{"line":105,"column":28}}}) : helper)))
    + "\n        ln -s ${caddy}/bin/caddy "
    + alias4(((helper = (helper = lookupProperty(helpers,"binPath") || (depth0 != null ? lookupProperty(depth0,"binPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"binPath","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":106,"column":33},"end":{"line":106,"column":44}}}) : helper)))
    + "/caddy\n        ln -s ${pkgs.hostctl}/bin/hostctl "
    + alias4(((helper = (helper = lookupProperty(helpers,"binPath") || (depth0 != null ? lookupProperty(depth0,"binPath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"binPath","hash":{},"data":data,"blockParams":blockParams,"loc":{"start":{"line":107,"column":42},"end":{"line":107,"column":53}}}) : helper)))
    + "/hostctl\n      '';\n    };\n  });\n}\n";
},"useData":true,"useBlockParams":true}