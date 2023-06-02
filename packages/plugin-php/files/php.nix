{ pkgs, system, config }:
let
  revisions = {
    "8.0" = {
      rev = "39eab7bd4cba23e7b2189d6cb9e9d15b673d40ed";
      pkg = "php80";
    };
    "8.1" = {
      rev = "39eab7bd4cba23e7b2189d6cb9e9d15b673d40ed";
      pkg = "php81";
    };
    "8.2" = {
      rev = "39eab7bd4cba23e7b2189d6cb9e9d15b673d40ed";
      pkg = "php82";
    };
    "7.4" = {
      rev = "4426104c8c900fbe048c33a0e6f68a006235ac50";
      pkg = "php74";
    };
    "7.3" = {
      rev = "4426104c8c900fbe048c33a0e6f68a006235ac50";
      pkg = "php73";
    };
  };

  selectedVersion = revisions.${config.version};
  importedPkgs = import
    (builtins.fetchTarball {
      url = "https://github.com/NixOS/nixpkgs/archive/${selectedVersion.rev}.tar.gz";
    })
    { };

  pkg = importedPkgs.${selectedVersion.pkg}.buildEnv {
    extensions = { enabled, all }: with all; enabled ++ (pkgs.lib.lists.forEach config.extensions (ext: all.${ext}));
    extraConfig = "memory_limit=-1";
  };

  phpIni = pkgs.writeText "php.ini" ''
    memory_limit=-1
  '';

  fpmConfig = pkgs.writeText "php-fpm.conf" ''
    [global]
    pid=${config.fpm.pidFile}
    error_log=${config.statePath}/php-fpm.log
    emergency_restart_threshold=10
    emergency_restart_interval=1m
    process_control_timeout=10s

    [${config.fpm.name}]
    pm=dynamic
    pm.max_children=2
    pm.start_servers=1
    pm.min_spare_servers=1
    pm.max_spare_servers=1
    pm.max_requests=100
    listen=${config.fpm.socketFile}
  '';

  run = pkgs.writeShellScript "php_run" ''
    exec ${pkg}/bin/php-fpm -F -y ${fpmConfig} -c ${phpIni}
  '';
in
{
  packages = [
    pkg
    pkg.packages.composer
  ];

  env = [
    { name = "PHP_PATH"; value = "${pkg}/bin/php"; }
  ];

  processes = [
    {
      name = "phpfpm";
      script = run;
    }
  ];
}
