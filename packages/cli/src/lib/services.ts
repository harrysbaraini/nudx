import { CaddyRoute } from './server';
import { Dictionary, Site, SiteServiceDefinition } from './types';

export const makeFile = (id: string, filename: string, content: string): ServiceFile => {
  return {
    type: 'pkgs.writeText',
    id,
    filename,
    content: content.split('\n'),
  };
};

export const makeScript = (id: string, filename: string, content: string): ServiceFile => {
  return {
    type: 'pkgs.writeShellScriptBin',
    id,
    filename,
    content: content.split('\n'),
  };
};

export type ServiceOptions = SiteServiceDefinition

export interface ServiceFile {
  type: string;
  id: string;
  filename: string;
  content: string[];
}

export interface ServiceConfig {
  env?: Dictionary<string>;
  processes?: Dictionary<string>;
  packages?: string[];
  files?: ServiceFile[]; // @todo add interface
  virtualHosts?: CaddyRoute[]; // @todo add interface
  onStartHook?: string;
  onStartedHook?: string;
  onStopHook?: string;
  shellHook?: string;
}

export interface Service {
  getDefaults(): SiteServiceDefinition;
  install(options: ServiceOptions, site: Site): Promise<ServiceConfig>;
  prompt?(): Dictionary[];
}
