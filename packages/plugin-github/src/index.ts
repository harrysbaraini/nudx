import { CliInstance } from '@nudx/cli/lib/core/cli';
import { join } from "path";

async function install(cli: CliInstance) {
  cli.registerServerPlugin({
    id: 'github',
    nixFile: join(__dirname, '..', 'files', 'github.nix'),
    async onBuild() {
      return {};
    }
  });
}

export {install};
