import { Server } from '../server';
import { Dictionary } from './generic';

export type CaddyRoute = Dictionary & { '@id': string };

export interface CaddySite {
  id: string;
  ports: string[];
  routes: CaddyRoute[];
}

export interface CaddyServer {
  listen: string[];
  routes: CaddyRoute[];
}

export interface CaddyConfig {
  apps: {
    http: {
      servers: Dictionary<CaddyServer>;
    };
  };
}

export interface InitServerHook {
  server: Server;
}
