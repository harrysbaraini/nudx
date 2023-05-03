export default {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    return "git.pkg = pkgs.git;\n\nservices.git = {\n  packages = [ git.pkg ];\n};\n";
},"useData":true}