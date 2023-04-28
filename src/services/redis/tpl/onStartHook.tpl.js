export default {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "if [[ ! -d \""
    + alias4(((helper = (helper = lookupProperty(helpers,"REDIS_DATA_DIR") || (depth0 != null ? lookupProperty(depth0,"REDIS_DATA_DIR") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"REDIS_DATA_DIR","hash":{},"data":data,"loc":{"start":{"line":1,"column":12},"end":{"line":1,"column":30}}}) : helper)))
    + "\" ]]; then\n  mkdir -p \""
    + alias4(((helper = (helper = lookupProperty(helpers,"REDIS_DATA_DIR") || (depth0 != null ? lookupProperty(depth0,"REDIS_DATA_DIR") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"REDIS_DATA_DIR","hash":{},"data":data,"loc":{"start":{"line":2,"column":12},"end":{"line":2,"column":30}}}) : helper)))
    + "\"\nfi\n";
},"useData":true}