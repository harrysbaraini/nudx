{ pkgs, system, config }:
let
  pkg = pkgs.minio;

  on_start = pkgs.writeShellScript "minio_on_start_hook" ''
    mkdir -p {${pkgs.lib.strings.concatStringsSep '','' (pkgs.lib.lists.forEach config.buckets (x: ''${config.dataDir}/${x}'' ))}}
  '';

  run = pkgs.writeShellScript "minio_run" ''
    exec ${pkg}/bin/minio server --address="${config.address}" ${config.dataDir}
  '';
in
{
  packages = [ pkg ];

  processes = [
    {
      name = "minio";
      script = run;
      on_start = on_start;
    }
  ];
}
