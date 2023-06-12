import { Config, Interfaces } from '@oclif/core';
import { Dictionary } from './generic';
import { PJSON } from '@oclif/core/lib/interfaces/pjson';
import { CliInstance } from '../cli';

export interface CliSite {
  hash: string;
  project: string;
  group?: string;
  disabled?: boolean;
}

export interface CliFile {
  server: {
    ports: string[];
  };
  sites: Dictionary<CliSite>;
}

export interface CliPlugin extends Interfaces.Plugin {
  pjson: PJSON.CLI;
  install(cli: CliInstance): Promise<void>;
}
