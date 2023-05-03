export interface Site {
  id: string;
  project: string;
  projectPath: string;
  virtualHostsPath: string;
  statePath: string;
  flakePath: string;
  shellenvPath: string;
  envrcPath: string;
  sourceEnvrcPath: string;
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
    hash: string;
    project: string;
    group?: string;
    disabled?: boolean;
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
