import { InputQuestion, Question } from 'inquirer';
import { CaddyRoute } from './server';
import { Dictionary, Site, SiteServiceDefinition } from './types';

export const makeFile = (id: string, filename: string, content: string): ServiceFile => {
  return {
    type: 'file',
    id,
    filename,
    content,
  };
};

export const makeScript = (id: string, filename: string, content: string): ServiceFile => {
  return {
    type: 'script',
    id,
    filename,
    content,
  };
};

export interface ServiceOptions extends SiteServiceDefinition {}

export interface ServiceFile {
  type: string;
  id: string;
  filename: string;
  content: string;
}

export interface ServiceConfig {
  env?: Dictionary<string>;
  processes?: Dictionary<string>;
  packages?: string[];
  files?: ServiceFile[]; // @todo add interface
  virtualHosts?: CaddyRoute[]; // @todo add interface
  onStartHook?: string;
  onStopHook?: string;
  shellHook?: string;
}

export interface Service {
  getDefaults(): SiteServiceDefinition;
  install(options: ServiceOptions, site: Site): Promise<ServiceConfig>;
  prompt?(): Dictionary[];
}
