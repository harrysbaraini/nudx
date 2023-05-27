import { ProcessComposeProcess } from './server';
import { CaddyRoute } from './server';
import { Dictionary, Site } from './types';

// @deprecated
export const makeFile = (id: string, filename: string, content: string): ServiceFile => {
  return {
    type: 'pkgs.writeText',
    id,
    filename,
    content: content.split('\n'),
  };
};

// @deprecated
export const makeScript = (id: string, filename: string, content: string): ServiceFile => {
  return {
    type: 'pkgs.writeShellScriptBin',
    id,
    filename,
    content: content.split('\n'),
  };
};

// @deprecated
export interface ServiceFile {
  type: string;
  id: string;
  filename: string;
  content: string[];
}

export interface Option extends Dictionary {
  type: string;
  name: string;
  message?: string;
  default?: unknown;
  prompt?: boolean;
  onJsonByDefault?: boolean;
  mutate?(value: unknown): unknown,
}

export interface WithChoicesServiceOption extends Option {
  choices: { name: string; }[];
}

export type Options = Option[];
export type OptionsState = Dictionary<unknown>;
export type Outputs = string;
export type NixConfig = {
  name?: string;
  file: string;
  config: OptionsState;
};
export interface ServiceConfig {
  nix: NixConfig;
  serverRoutes?: CaddyRoute[];
  processes?: Dictionary<ProcessComposeProcess>;
}

export type Inputs = Dictionary<string>;

export interface Service {
  options(): Options;
  install(optionsState: OptionsState, site: Site): Promise<ServiceConfig>;
}
