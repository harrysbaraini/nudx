export default {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, alias1=depth0 != null ? depth0 : (container.nullContext || {}), alias2=container.hooks.helperMissing, alias3="function", alias4=container.escapeExpression, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "export NUDX_ES_PORT=$(cat "
    + alias4(((helper = (helper = lookupProperty(helpers,"esPortFile") || (depth0 != null ? lookupProperty(depth0,"esPortFile") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"esPortFile","hash":{},"data":data,"loc":{"start":{"line":1,"column":26},"end":{"line":1,"column":40}}}) : helper)))
    + " | head -n 1)\n\nif [[ ! -d \""
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_HOME") || (depth0 != null ? lookupProperty(depth0,"ES_HOME") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_HOME","hash":{},"data":data,"loc":{"start":{"line":3,"column":12},"end":{"line":3,"column":23}}}) : helper)))
    + "\" ]]; then\n  mkdir -m 0700 -p "
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_HOME") || (depth0 != null ? lookupProperty(depth0,"ES_HOME") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_HOME","hash":{},"data":data,"loc":{"start":{"line":4,"column":19},"end":{"line":4,"column":30}}}) : helper)))
    + "\n\n  # elasticsearch needs to create the elasticsearch.keystore in the config directory\n  # so this directory needs to be writable.\n  mkdir -m 0700 -p "
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_PATH_CONF") || (depth0 != null ? lookupProperty(depth0,"ES_PATH_CONF") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_PATH_CONF","hash":{},"data":data,"loc":{"start":{"line":8,"column":19},"end":{"line":8,"column":35}}}) : helper)))
    + "\n\n  # Make sure the logging configuration for old elasticsearch versions is removed:\n  rm -f \""
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_PATH_CONF") || (depth0 != null ? lookupProperty(depth0,"ES_PATH_CONF") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_PATH_CONF","hash":{},"data":data,"loc":{"start":{"line":11,"column":9},"end":{"line":11,"column":25}}}) : helper)))
    + "/logging.yml\"\n  cp ${loggingConfigFile} "
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_PATH_CONF") || (depth0 != null ? lookupProperty(depth0,"ES_PATH_CONF") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_PATH_CONF","hash":{},"data":data,"loc":{"start":{"line":12,"column":26},"end":{"line":12,"column":42}}}) : helper)))
    + "/"
    + alias4(((helper = (helper = lookupProperty(helpers,"loggingConfigFile") || (depth0 != null ? lookupProperty(depth0,"loggingConfigFile") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"loggingConfigFile","hash":{},"data":data,"loc":{"start":{"line":12,"column":43},"end":{"line":12,"column":64}}}) : helper)))
    + "\n\n  mkdir -p "
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_PATH_CONF") || (depth0 != null ? lookupProperty(depth0,"ES_PATH_CONF") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_PATH_CONF","hash":{},"data":data,"loc":{"start":{"line":14,"column":11},"end":{"line":14,"column":27}}}) : helper)))
    + "/scripts\n  mkdir -p "
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_HOME") || (depth0 != null ? lookupProperty(depth0,"ES_HOME") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_HOME","hash":{},"data":data,"loc":{"start":{"line":15,"column":11},"end":{"line":15,"column":22}}}) : helper)))
    + "/plugins\n  ln -sfT "
    + alias4(((helper = (helper = lookupProperty(helpers,"pkgName") || (depth0 != null ? lookupProperty(depth0,"pkgName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pkgName","hash":{},"data":data,"loc":{"start":{"line":16,"column":10},"end":{"line":16,"column":21}}}) : helper)))
    + "/lib "
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_HOME") || (depth0 != null ? lookupProperty(depth0,"ES_HOME") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_HOME","hash":{},"data":data,"loc":{"start":{"line":16,"column":26},"end":{"line":16,"column":37}}}) : helper)))
    + "/lib\n  ln -sfT "
    + alias4(((helper = (helper = lookupProperty(helpers,"pkgName") || (depth0 != null ? lookupProperty(depth0,"pkgName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pkgName","hash":{},"data":data,"loc":{"start":{"line":17,"column":10},"end":{"line":17,"column":21}}}) : helper)))
    + "/modules "
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_HOME") || (depth0 != null ? lookupProperty(depth0,"ES_HOME") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_HOME","hash":{},"data":data,"loc":{"start":{"line":17,"column":30},"end":{"line":17,"column":41}}}) : helper)))
    + "/modules\n  cp "
    + alias4(((helper = (helper = lookupProperty(helpers,"pkgName") || (depth0 != null ? lookupProperty(depth0,"pkgName") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"pkgName","hash":{},"data":data,"loc":{"start":{"line":18,"column":5},"end":{"line":18,"column":16}}}) : helper)))
    + "/config/jvm.options "
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_PATH_CONF") || (depth0 != null ? lookupProperty(depth0,"ES_PATH_CONF") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_PATH_CONF","hash":{},"data":data,"loc":{"start":{"line":18,"column":36},"end":{"line":18,"column":52}}}) : helper)))
    + "/jvm.options\n\n  # redirect jvm logs to the data directory\n  mkdir -m 0700 -p "
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_HOME") || (depth0 != null ? lookupProperty(depth0,"ES_HOME") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_HOME","hash":{},"data":data,"loc":{"start":{"line":21,"column":19},"end":{"line":21,"column":30}}}) : helper)))
    + "/logs\n  ${pkgs.sd}/bin/sd 'logs/gc.log' '"
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_HOME") || (depth0 != null ? lookupProperty(depth0,"ES_HOME") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_HOME","hash":{},"data":data,"loc":{"start":{"line":22,"column":35},"end":{"line":22,"column":46}}}) : helper)))
    + "/logs/gc.log' "
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_PATH_CONF") || (depth0 != null ? lookupProperty(depth0,"ES_PATH_CONF") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_PATH_CONF","hash":{},"data":data,"loc":{"start":{"line":22,"column":60},"end":{"line":22,"column":76}}}) : helper)))
    + "/jvm.options\nfi\n\nif [[ -f \""
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_PATH_CONF") || (depth0 != null ? lookupProperty(depth0,"ES_PATH_CONF") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_PATH_CONF","hash":{},"data":data,"loc":{"start":{"line":25,"column":10},"end":{"line":25,"column":26}}}) : helper)))
    + "/elasticsearch.yml\" ]]; then\n  rm -f "
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_PATH_CONF") || (depth0 != null ? lookupProperty(depth0,"ES_PATH_CONF") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_PATH_CONF","hash":{},"data":data,"loc":{"start":{"line":26,"column":8},"end":{"line":26,"column":24}}}) : helper)))
    + "/elasticsearch.yml\nfi\n\n# Note that we copy config files from the nix store instead of symbolically linking them\n# because otherwise X-Pack Security will raise the following exception:\n# java.security.AccessControlException:\n# access denied (\"java.io.FilePermission\" \"/var/lib/elasticsearch/config/elasticsearch.yml\" \"read\")\necho \""
    + alias4(((helper = (helper = lookupProperty(helpers,"esConfigBase") || (depth0 != null ? lookupProperty(depth0,"esConfigBase") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"esConfigBase","hash":{},"data":data,"loc":{"start":{"line":33,"column":6},"end":{"line":33,"column":22}}}) : helper)))
    + "\" > "
    + alias4(((helper = (helper = lookupProperty(helpers,"ES_PATH_CONF") || (depth0 != null ? lookupProperty(depth0,"ES_PATH_CONF") : depth0)) != null ? helper : alias2),(typeof helper === alias3 ? helper.call(alias1,{"name":"ES_PATH_CONF","hash":{},"data":data,"loc":{"start":{"line":33,"column":26},"end":{"line":33,"column":42}}}) : helper)))
    + "/elasticsearch.yml\n";
},"useData":true}