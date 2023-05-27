#!/usr/bin/env bash

file=$1
startPort=50000
endPort=65000

for ((p=$startPort;p<$endPort;p++)); do
  reserved=$(cat $file | grep -x $p)
  state=$(lsof -iTCP:$p -sTCP:LISTEN)

  if [[ $reserved == "" && "$state" == "" ]]; then
    echo $p >> $file
    echo $p
    break
  fi
done
