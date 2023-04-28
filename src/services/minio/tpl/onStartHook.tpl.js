export default {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "if [[ ! -f \""
    + alias4(((helper = (helper = lookupProperty(helpers,"minioAddressFile") || (depth0 != null ? lookupProperty(depth0,"minioAddressFile") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"minioAddressFile","hash":{},"data":data,"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":32}}}) : helper)))
    + "\" ]]; then\n  foundport=$(${findPortScript}/bin/findPort)\n  echo \"127.0.0.1:$foundport\" > "
    + alias4(((helper = (helper = lookupProperty(helpers,"minioAddressFile") || (depth0 != null ? lookupProperty(depth0,"minioAddressFile") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"minioAddressFile","hash":{},"data":data,"loc":{"start":{"line":3,"column":32},"end":{"line":3,"column":52}}}) : helper)))
    + "\nfi\n";
},"useData":true}