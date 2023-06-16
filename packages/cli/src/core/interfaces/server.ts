import { Dictionary } from './generic.js'

export type CaddyRoute = Dictionary & {
  '@id': string
  terminal?: boolean
  match: {
    host: string[]
  }[]
  handle: Dictionary[]
}

export interface CaddySite {
  id: string
  ports: string[]
  routes: CaddyRoute[]
}

export interface CaddyServer {
  listen: string[]
  routes: CaddyRoute[]
}

export interface CaddyConfig {
  apps: {
    http: {
      servers: Dictionary<CaddyServer>
    }
  }
}

export interface ServerPluginOptions {
  [key: string]: unknown
}

export interface ServerPlugin {
  id: string
  nixFile?: string
  onBuild(): Promise<ServerPluginOptions>
}
