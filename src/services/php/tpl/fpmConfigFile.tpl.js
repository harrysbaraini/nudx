export default {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "[global]\npid="
    + alias4(((helper = (helper = lookupProperty(helpers,"fpmPidFile") || (depth0 != null ? lookupProperty(depth0,"fpmPidFile") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fpmPidFile","hash":{},"data":data,"loc":{"start":{"line":2,"column":4},"end":{"line":2,"column":18}}}) : helper)))
    + "\nerror_log="
    + alias4(((helper = (helper = lookupProperty(helpers,"phpStateDir") || (depth0 != null ? lookupProperty(depth0,"phpStateDir") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"phpStateDir","hash":{},"data":data,"loc":{"start":{"line":3,"column":10},"end":{"line":3,"column":25}}}) : helper)))
    + "/php-fpm.log\nemergency_restart_threshold=10\nemergency_restart_interval=1m\nprocess_control_timeout=10s\n\n[web]\npm=dynamic\npm.max_children=5\npm.start_servers=3\npm.min_spare_servers=2\npm.max_spare_servers=4\npm.max_requests=100\nlisten="
    + alias4(((helper = (helper = lookupProperty(helpers,"fpmSocketFile") || (depth0 != null ? lookupProperty(depth0,"fpmSocketFile") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"fpmSocketFile","hash":{},"data":data,"loc":{"start":{"line":15,"column":7},"end":{"line":15,"column":24}}}) : helper)))
    + "\n";
},"useData":true}