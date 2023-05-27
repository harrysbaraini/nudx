#!/usr/bin/env bash

if [[ $(${pkgs.curl}/bin/curl -s -o /dev/null -w '%{http_code}' localhost:2019/id/{{vh.id}}) != "200" ]]; then
  ${pkgs.curl}/bin/curl localhost:2019/config/apps/http/servers/srvHttp/routes \
      -X POST \
      -H "Content-Type: application/json" \
      -d '{{{vh.json}}}'
fi
