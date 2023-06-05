import {run} from "@oclif/core";
import { CliInstance } from '@nudx/cli/lib/core/cli';
import { join } from "path";

async function install(cli: CliInstance) {
  // cli.addFlakeToServer(join(__dirname, '..', 'files', 'github.nix'));
}

export {run, install};
