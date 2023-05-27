{ pkgs, system, config }:
let
  revisions = {
    "19" = {
      rev = "8ad5e8132c5dcf977e308e7bf5517cc6cc0bf7d8";
      pkg = "nodejs-19_x";
    };
    "18" = {
      rev = "8ad5e8132c5dcf977e308e7bf5517cc6cc0bf7d8";
      pkg = "nodejs-18_x";
    };
    "16" = {
      rev = "8ad5e8132c5dcf977e308e7bf5517cc6cc0bf7d8";
      pkg = "nodejs-16_x";
    };
    "14" = {
      rev = "8ad5e8132c5dcf977e308e7bf5517cc6cc0bf7d8";
      pkg = (pkgs: pkgs.elmPackages.nodejs);
    };
  };

  selectedVersion = revisions.${config.version};
  importedPkgs = import
    (builtins.fetchTarball {
      url = "https://github.com/NixOS/nixpkgs/archive/${selectedVersion.rev}.tar.gz";
    })
    { };
in
{
  packages = [
    # Import the proper version for the nodejs package
    (selectedVersion.pkg importedPkgs)
    pkgs.yarn
  ];
}
