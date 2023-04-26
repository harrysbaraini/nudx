export interface Site {
  project: string;
  projectPath: string;
  virtualHostsPath: string;
  statePath: string;
  flakePath: string;
  configPath: string;
  mainHost: string;
  hash: string;
  definition: SiteDefinition;
}

export interface Dictionary<T = unknown> {
  [key: string]: T;
}

// ------------------------------------------------------------------
// Site Definition file
// ------------------------------------------------------------------

export type SiteServiceDefinition = Dictionary<unknown>;

export interface SiteDefinition {
  version: string;
  // @todo Rename to 'name' in all places it's used
  project: string;
  group?: string;
  hosts: Dictionary<string>;
  autostart: boolean;
  serve: string;
  services: Dictionary<SiteServiceDefinition>;
}

// ------------------------------------------------------------------
// Overmind
// ------------------------------------------------------------------

export interface OvermindProcesses {
  [key: string]: string;
}

export interface OvermindConfig {
  statePath: string;
  socketFile: string;
  processes: OvermindProcesses;
}

// ------------------------------------------------------------------
// CLI
// ------------------------------------------------------------------

export interface CliSettingsSites {
  [key: string]: {
    project: string;
    hash: string;
  };
}

export interface CliSettings {
  server: {
    listen: string[];
  };
  sites: CliSettingsSites;
}

// ------------------------------------------------------------------
// Server
// ------------------------------------------------------------------

export interface ServerConfig {
  statePath: string;
}

// ------------------------------------------------------------------
// Generic Types
// ------------------------------------------------------------------

export type Json = Dictionary<unknown> | Array<unknown>;
