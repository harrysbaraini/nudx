export default {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, alias5=container.lambda, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "[mysqld]\ndatadir="
    + alias4(((helper = (helper = lookupProperty(helpers,"HOME") || (depth0 != null ? lookupProperty(depth0,"HOME") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"HOME","hash":{},"data":data,"loc":{"start":{"line":2,"column":8},"end":{"line":2,"column":16}}}) : helper)))
    + "\nsocket="
    + alias4(((helper = (helper = lookupProperty(helpers,"UNIX_PORT") || (depth0 != null ? lookupProperty(depth0,"UNIX_PORT") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"UNIX_PORT","hash":{},"data":data,"loc":{"start":{"line":3,"column":7},"end":{"line":3,"column":20}}}) : helper)))
    + "\npid-file="
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"site") : depth0)) != null ? lookupProperty(stack1,"statePath") : stack1), depth0))
    + "/mysql.pid\nlog-error="
    + alias4(alias5(((stack1 = (depth0 != null ? lookupProperty(depth0,"site") : depth0)) != null ? lookupProperty(stack1,"statePath") : stack1), depth0))
    + "/mysql.log\nsymbolic-links=0\nssl=0\n\n[client]\nport=0\nsocket="
    + alias4(((helper = (helper = lookupProperty(helpers,"UNIX_PORT") || (depth0 != null ? lookupProperty(depth0,"UNIX_PORT") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"UNIX_PORT","hash":{},"data":data,"loc":{"start":{"line":11,"column":7},"end":{"line":11,"column":20}}}) : helper)))
    + "\n";
},"useData":true}