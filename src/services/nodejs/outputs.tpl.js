export default {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "services.nodejs = {\n  packages = [ pkgs."
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pkg") || (depth0 != null ? lookupProperty(depth0,"pkg") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pkg","hash":{},"data":data,"loc":{"start":{"line":2,"column":20},"end":{"line":2,"column":27}}}) : helper)))
    + " pkgs.yarn ];\n};\n";
},"useData":true}