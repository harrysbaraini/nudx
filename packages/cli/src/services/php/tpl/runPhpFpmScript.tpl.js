export default {"compiler":[8,">= 4.3.0"],"main":function(container,depth0,helpers,partials,data) {
    var helper, lookupProperty = container.lookupProperty || function(parent, propertyName) {
        if (Object.prototype.hasOwnProperty.call(parent, propertyName)) {
          return parent[propertyName];
        }
        return undefined
    };

  return "TRAPPED_SIGNAL=false\n\n"
    + container.escapeExpression(((helper = (helper = lookupProperty(helpers,"pkgName") || (depth0 != null ? lookupProperty(depth0,"pkgName") : depth0)) != null ? helper : container.hooks.helperMissing),(typeof helper === "function" ? helper.call(depth0 != null ? depth0 : (container.nullContext || {}),{"name":"pkgName","hash":{},"data":data,"loc":{"start":{"line":3,"column":0},"end":{"line":3,"column":11}}}) : helper)))
    + "/bin/php-fpm -F -y ${fpmConfigFile} -c ${phpIniFile} 2>&1 &\nPHP_FPM_PID=$!\n\ntrap \"TRAPPED_SIGNAL=true; kill -15 $PHP_FPM_PID;\" SIGTERM SIGINT SIGKILL\n\nwhile :\ndo\n    kill -0 $PHP_FPM_PID 2> /dev/null\n    PHP_FPM_STATUS=$?\n\n    if [ \"$TRAPPED_SIGNAL\" = \"true\" ]; then\n        if [ $PHP_FPM_STATUS -eq 0 ]; then\n            kill -15 $PHP_FPM_PID;\n        fi\n\n        exit 1;\n    else\n        if [ $PHP_FPM_STATUS -ne 0 ]; then\n            exit 0;\n        fi\n    fi\n\n    sleep 1\ndone\n";
},"useData":true}