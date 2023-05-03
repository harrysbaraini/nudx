export default {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "source_env_if_exists "
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"envrcPath") || (depth0 != null ? lookupProperty(depth0,"envrcPath") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"envrcPath","hash":{},"data":data,"loc":{"start":{"line":1,"column":21},"end":{"line":1,"column":34}}}) : helper)))
    + "\n";
},"useData":true}