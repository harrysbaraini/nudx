import { ProcessFile } from '../processes';
import { Dictionary } from './generic';

export interface SiteConfig {
  id: string;
  projectPath: string;
  basePath: string;
  serverConfigPath: string;
  statePath: string;
  flakePath: string;
  shellenvPath: string;
  envrcPath: string;
  sourceEnvrcPath: string;
  configPath: string;
  mainHost: string;
  hash: string;
  processesConfig: ProcessFile;
  definition: SiteFile;
}

export interface SiteFile {
  // @todo Rename to 'name' in all places it's used
  project: string;
  group?: string;
  hosts: string[];
  autostart: boolean;
  serve: string;
  services: Dictionary<Dictionary<unknown>>;
}
