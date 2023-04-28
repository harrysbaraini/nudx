export default {"1":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var alias1=container.lambda, alias2=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "  if [[ ! -d \""
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"dataDir") : depths[1]), depth0))
    + "/"
    + alias2(alias1(depth0, depth0))
    + "\" ]]; then\n    mkdir -p \""
    + alias2(alias1((depths[1] != null ? lookupProperty(depths[1],"dataDir") : depths[1]), depth0))
    + "/"
    + alias2(alias1(depth0, depth0))
    + "\n  fi\n";
},"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data,blockParams,depths) {
    var stack1, helper, options, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    }, buffer = 
  "export NUDX_MINIO_ADDRESS="
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"minioAddress") || (depth0 != null ? lookupProperty(depth0,"minioAddress") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"minioAddress","hash":{},"data":data,"loc":{"start":{"line":1,"column":26},"end":{"line":1,"column":42}}}) : helper)))
    + "\n";
  stack1 = ((helper = (helper = lookupProperty(helpers,"buckets") || (depth0 != null ? lookupProperty(depth0,"buckets") : depth0)) != null ? helper : alias2),(options={"name":"buckets","hash":{},"fn":container.program(1, data, 0, blockParams, depths),"inverse":container.noop,"data":data,"loc":{"start":{"line":2,"column":0},"end":{"line":6,"column":12}}}),(typeof helper === alias3 ? helper.call(alias1,options) : helper));
  if (!lookupProperty(helpers,"buckets")) { stack1 = container.hooks.blockHelperMissing.call(depth0,stack1,options)}
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"useData":true,"useDepths":true}