import { BuildProps } from '../commands/site/build';
import { CLICONF_ENV_PREFIX } from '../lib/flags';
import { ServiceFile } from '../lib/services';
import { buildOvermindNix } from './overmind-nix';

// config = BuildProps
export const buildSiteFlake = ({
  project,
  env,
  processes,
  files,
  packages,
  onStartHooks,
  onStopHooks,
  shellHooks,
}: BuildProps) => `{
    # Flake inputs
    inputs = {
        nixpkgs.url = "github:NixOS/nixpkgs";
        flake-utils = { url = "github:numtide/flake-utils"; };
        php-shell.url = "github:loophp/nix-shell";
    };

    # Flake outputs
    outputs = { self, nixpkgs, flake-utils, php-shell }:
    flake-utils.lib.eachDefaultSystem (system:
    let
        pkgs = import nixpkgs { inherit system; config.allowUnfree = true; };
        phps = php-shell.packages.\${system};

        ${buildOvermindNix({
          statePath: project.statePath,
          socketFile: 'overmind',
          processes,
        })}

        # SCRIPT : Find free port
        findPortScript = pkgs.writeShellScriptBin "findPort" ''
          if [[ -z $argv[1] ]]; then
            firstPort=$argv[1]
          else
            firstPort=50000
          fi

          netstat -aln | awk '
            $6 == "LISTEN" {
              if ($4 ~ "[.:][0-9]+$") {
                split($4, a, /[:.]/);
                port = a[length(a)];
                p[port] = 1
              }
            }
            END {
              for (i = $firstPort; i < 65000 && p[i]; i++){};
              if (i == 65000) {exit 1};
              print i
            }
          '
        '';

        # SCRIPT : Stop Project
        stopProjectScript = pkgs.writeShellScriptBin "stopProject" ''
            exec \${stopOvermindScript}/bin/stopOvermind

            ${onStopHooks.map((hook) => `
              ${hook}
            `.trimEnd()).join('')}
        '';

        # SCRIPT : Start Project
        startProjectScript = pkgs.writeShellScriptBin "startProject" ''
            ${onStartHooks.map((hook) => `
              ${hook}
            `.trimEnd()).join('')}

            exec \${startOvermindScript}/bin/startOvermind
        '';

        # SCRIPT : Print Info!
        printInfoScript = pkgs.writeShellScriptBin "printInfo" ''
            env | grep "^${CLICONF_ENV_PREFIX}_"
        '';

        # Files & Scripts
        ${files.map((f: ServiceFile) => `
          ${f.id} = ${f.type === 'file' ? 'pkgs.writeText' : 'pkgs.writeShellScriptBin'}  "${f.filename}" ''
          ${f.content}
          '';`).join('')}

        # Packages
        packages = with pkgs; [unixtools.netstat hostctl overmind findPortScript startOvermindScript stopOvermindScript getServicePidScript printInfoScript startProjectScript stopProjectScript ${packages.join(' ')}];
    in
    {
        devShell = pkgs.mkShell {
            src = null;
            buildInputs = packages;

            # Environment variables
            NUDX_PROCFILE="\${procfile}";

            ${Object.entries(env).map(([key, value]) => `
              ${CLICONF_ENV_PREFIX}_${key} = "${value}";
            `.trimEnd()).join('')}

            # Script that is executed when shell is open
            shellHook = ''${shellHooks.map((hook) => `
              ${hook}
              wait
            `.trimEnd()).join('')}'';
        };
    });
}`;
