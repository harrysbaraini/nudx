{ pkgs, system, envPrefix, directory, services }:
let
  ENV_PREFIX = envPrefix;
  PROJECT_PROCFILE = "${directory}/config/processes.json";
  PROJECT_SHELL_ENV = "${directory}/config/shellenv.txt";

  servicesValues = pkgs.lib.attrsets.zipAttrs (pkgs.lib.attrsets.attrValues services);
  serviceNames = servicesValues.name or [ ];
  env = pkgs.lib.lists.flatten (servicesValues.env or [ ]);
  processes = pkgs.lib.lists.flatten (servicesValues.processes or [ ]);
  shellHooks = servicesValues.shellHook or [ ];

  lib.mkShell = pkgs.mkShell.override {
    stdenv = pkgs.stdenvNoCC.override {
      cc = null;
      preHook = "";
      allowedRequisites = null;
      initialPath = pkgs.lib.filter
        (a: pkgs.lib.hasPrefix "coreutils" a.name)
        pkgs.stdenvNoCC.initialPath;
      extraNativeBuildInputs = [ ];
    };
  };

  files.processesFile = pkgs.writeText "processes.json" (
    builtins.toJSON {
      environment = builtins.listToAttrs env;
      processes = processes;
    }
  );

  # Script to run hooks
  run_hooks = pkgs.writeShellScriptBin "run_hooks" ''
    for hook in "$@"
    do
      exec $hook
    done
  '';
in
{
  inherit PROJECT_SHELL_ENV;
  inherit PROJECT_PROCFILE;
  inherit ENV_PREFIX;
  inherit env;
  inherit lib;
  inherit files;
  inherit shellHooks;

  packages = [
    # Packages common to all projects
    run_hooks
  ] ++ (pkgs.lib.lists.flatten (servicesValues.packages or [ ]));
}
