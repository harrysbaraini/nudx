export default {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return ": ${XDG_CACHE_HOME:=$HOME/.cache}\ndeclare -A direnv_layout_dirs\ndirenv_layout_dir() {\n	echo \"${direnv_layout_dirs[$PWD]:=$(\n		echo \""
    + alias4(((helper = (helper = lookupProperty(helpers,"statePath") || (depth0 != null ? lookupProperty(depth0,"statePath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"statePath","hash":{},"data":data,"loc":{"start":{"line":5,"column":8},"end":{"line":5,"column":21}}}) : helper)))
    + "/.direnv\"\n	)}\"\n}\n\necho \"Loading nudx env\"\n\nif ! has nix_direnv_version || ! nix_direnv_version 2.2.1; then\n  source_url \"https://raw.githubusercontent.com/nix-community/nix-direnv/2.2.1/direnvrc\" \"sha256-zelF0vLbEl5uaqrfIzbgNzJWGmLzCmYAkInj/LNxvKs=\"\nfi\n\nnix_direnv_watch_file "
    + alias4(((helper = (helper = lookupProperty(helpers,"flakePath") || (depth0 != null ? lookupProperty(depth0,"flakePath") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"flakePath","hash":{},"data":data,"loc":{"start":{"line":15,"column":22},"end":{"line":15,"column":35}}}) : helper)))
    + "\nuse flake "
    + alias4(((helper = (helper = lookupProperty(helpers,"flakeDir") || (depth0 != null ? lookupProperty(depth0,"flakeDir") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"flakeDir","hash":{},"data":data,"loc":{"start":{"line":16,"column":10},"end":{"line":16,"column":22}}}) : helper)))
    + " --impure 2>&1\n";
},"useData":true}