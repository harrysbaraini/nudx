import { ServerConfig } from '../lib/types';
import { buildOvermindNix } from './overmind-nix';

// config = ServerConfig
export const buildServerFlake = (config: ServerConfig) => `{
    # Flake inputs
    inputs = {
        nixpkgs.url = "github:NixOS/nixpkgs";
        flake-utils = { url = "github:numtide/flake-utils"; };
    };

    # Flake outputs
    outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
    let
        pkgs = import nixpkgs { inherit system; };

        # Build Caddy
        caddy = with pkgs; stdenv.mkDerivation rec {
            pname = "caddy";
            version = "2.6.4";
            dontUnpack = true;
            nativeBuildInputs = [ git go xcaddy ];
            plugins = [
                "github.com/mholt/caddy-l4/layer4"
                "github.com/mholt/caddy-l4/modules/l4http"
                "github.com/mholt/caddy-l4/modules/l4proxy"
            ];

            configurePhase = ''
                export GOCACHE=$TMPDIR/go-cache
                export GOPATH="$TMPDIR/go"
            '';

            buildPhase = let
                pluginArgs = lib.concatMapStringsSep " " (plugin: "--with \${plugin}") plugins;
            in ''
                runHook preBuild
                \${xcaddy}/bin/xcaddy build "v\${version}" \${pluginArgs}
                runHook postBuild
            '';

            installPhase = ''
                runHook preInstall
                mkdir -p $out/bin
                mv caddy $out/bin
                runHook postInstall
            '';
        };

        ${buildOvermindNix({
          statePath: config.statePath,
          socketFile: 'nudxserver',
          processes: {
            caddy: '${caddy}/bin/caddy run',
          },
        })}

        stopServer = pkgs.writeShellScriptBin "stopServer" ''
            exec \${stopOvermindScript}/bin/stopOvermind
        '';

        startServer = pkgs.writeShellScriptBin "startServer" ''
            exec \${startOvermindScript}/bin/startOvermind
            wait
        '';

        # Packages
        packages = with pkgs; [overmind startOvermindScript stopOvermindScript caddy startServer stopServer];
    in
    {
        devShell = pkgs.mkShell {
            buildInputs = packages;

            shellHook = ''
              # Mark variables which are modified or created for export.
              set -a
              source \${toString ./env.txt}
              set +a
            '';
        };
    });
}`;
