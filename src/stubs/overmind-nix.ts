import { OvermindConfig } from '../lib/types';

export const buildOvermindNix = (config: OvermindConfig) => `
    procfile = pkgs.writeText "Procfile" ''${Object.entries(config.processes)
      .map(([key, value]) =>
        `
        ${key}: ${value}
    `.trimEnd(),
      )
      .join('')}
    '';

    env.OVERMIND_SOCKET="${config.statePath}/${config.socketFile}.sock";

    # SCRIPT : Stop Overmind
    stopOvermindScript = pkgs.writeShellScriptBin "stopOvermind" ''
        OVERMIND_PROCFILE=\${procfile}

        if [[ -S "\${env.OVERMIND_SOCKET}" ]]; then
            \${pkgs.overmind}/bin/overmind kill -s \${env.OVERMIND_SOCKET}
        fi
    '';

    # SCRIPT : Start Overmind
    startOvermindScript = pkgs.writeShellScriptBin "startOvermind" ''
        OVERMIND_PROCFILE=\${procfile}

        if [[ -S "\${env.OVERMIND_SOCKET}" ]]; then
            exec \${stopOvermindScript}/bin/stopOvermind
        fi

        \${pkgs.overmind}/bin/overmind start \\
            --procfile \$OVERMIND_PROCFILE \\
            --daemonize \\
            --no-port \\
            -s \${env.OVERMIND_SOCKET}
    '';

    # SCRIPT : Get service PID
    getServicePidScript = pkgs.writeShellScriptBin "getServicePid" ''
      \${pkgs.overmind}/bin/overmind status -s \${env.OVERMIND_SOCKET} | awk -v service="$1" '$1 == service { print $2 }'
  '';
`;
