export default {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "if [[ ! -f \""
    + alias4(((helper = (helper = lookupProperty(helpers,"esPortFile") || (depth0 != null ? lookupProperty(depth0,"esPortFile") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"esPortFile","hash":{},"data":data,"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":26}}}) : helper)))
    + "\" ]]; then\n  # HTTP PORT\n  port=$(${findPortScript}/bin/findPort 50001)\n  echo $port > "
    + alias4(((helper = (helper = lookupProperty(helpers,"esPortFile") || (depth0 != null ? lookupProperty(depth0,"esPortFile") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"esPortFile","hash":{},"data":data,"loc":{"start":{"line":4,"column":15},"end":{"line":4,"column":29}}}) : helper)))
    + "\nfi\n";
},"useData":true}