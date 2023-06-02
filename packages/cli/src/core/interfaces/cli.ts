import { Dictionary } from './generic';

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
