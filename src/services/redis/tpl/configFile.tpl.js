export default {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "port 0\nunixsocket "
    + alias4(((helper = (helper = lookupProperty(helpers,"REDIS_SOCKET") || (depth0 != null ? lookupProperty(depth0,"REDIS_SOCKET") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"REDIS_SOCKET","hash":{},"data":data,"loc":{"start":{"line":2,"column":11},"end":{"line":2,"column":27}}}) : helper)))
    + "\nunixsocketperm 700\ndir "
    + alias4(((helper = (helper = lookupProperty(helpers,"REDIS_DATA_DIR") || (depth0 != null ? lookupProperty(depth0,"REDIS_DATA_DIR") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"REDIS_DATA_DIR","hash":{},"data":data,"loc":{"start":{"line":4,"column":4},"end":{"line":4,"column":22}}}) : helper)))
    + "\n";
},"useData":true}