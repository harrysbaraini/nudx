{ pkgs, system, config }:
let
  pkg = pkgs.redis;
  dataDir = "${config.statePath}/redis";
  socketFile = "${config.statePath}/redis.sock";

  configFile = pkgs.writeText "redis.conf" ''
    port ${builtins.toString config.port}
    unixsocket ${socketFile}
    unixsocketperm 700
    dir ${dataDir}
  '';

  on_start = pkgs.writeShellScript "redis_on_start" ''
    if [[ ! -d "${dataDir}" ]]; then
      mkdir -p ${dataDir}
    fi
  '';

  run = pkgs.writeShellScript "redis_run" ''
    exec ${pkg}/bin/redis-server ${configFile}
  '';
in
{
  packages = [ pkg ];

  env = [
    { name = "REDIS_PORT"; value = builtins.toString config.port; }
    { name = "REDIS_SOCKET"; value = socketFile; }
  ];

  processes = [
    {
      name = "redis";
      script = run;
      on_start = on_start;
    }
  ];
}
