export default {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "{\n  # Flake inputs\n  inputs = {\n      nixpkgs.url = \"github:NixOS/nixpkgs\";\n      flake-utils = { url = \"github:numtide/flake-utils\"; };\n  };\n\n  # Flake outputs\n  outputs = { self, nixpkgs, flake-utils }:\n  flake-utils.lib.eachDefaultSystem (system:\n  let\n    pkgs = import nixpkgs { inherit system; };\n\n    # Build Caddy\n    caddy = with pkgs; stdenv.mkDerivation rec {\n      pname = \"caddy\";\n      version = \"2.6.4\";\n      dontUnpack = true;\n      nativeBuildInputs = [ git go xcaddy ];\n      plugins = [];\n\n      configurePhase = ''\n        export GOCACHE=$TMPDIR/go-cache\n        export GOPATH=\"$TMPDIR/go\"\n      '';\n\n      buildPhase = let\n        pluginArgs = lib.concatMapStringsSep \" \" (plugin: \"--with ${plugin}\") plugins;\n      in ''\n        runHook preBuild\n        ${xcaddy}/bin/xcaddy build \"v${version}\" ${pluginArgs}\n        runHook postBuild\n      '';\n\n      installPhase = ''\n        runHook preInstall\n        mkdir -p $out/bin\n        mv caddy $out/bin\n        runHook postInstall\n      '';\n    };\n\n    # Packages\n    packages = with pkgs; [caddy];\n  in\n  {\n    devShell = pkgs.mkShell {\n      buildInputs = packages;\n\n      shellHook = ''\n        ln -s ${caddy}/bin/caddy "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"caddyPath") || (depth0 != null ? lookupProperty(depth0,"caddyPath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"caddyPath","hash":{},"data":data,"loc":{"start":{"line":51,"column":33},"end":{"line":51,"column":46}}}) : helper)))
    + "\n      '';\n    };\n  });\n}\n";
},"useData":true}