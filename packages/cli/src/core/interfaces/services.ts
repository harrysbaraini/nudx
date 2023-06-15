import { ProcessConfig } from '../processes.js'
import { Dictionary } from './generic.js'
import { CaddyRoute } from './server.js'
import { SiteConfig } from './sites.js'

export interface ServiceBuildConfig {
  nix: {
    name?: string
    file: string
    config: Dictionary<unknown>
  }
  serverRoutes?: CaddyRoute[]
  processes?: Dictionary<ProcessConfig>
}

export type ServiceSiteConfig = Dictionary<unknown>

export interface ServiceDefinition {
  id: string
  onCreate(): Promise<ServiceSiteConfig>
  onBuild(optionsState: ServiceSiteConfig, site: SiteConfig): Promise<ServiceBuildConfig>
}

export interface Services {
  services: Dictionary<ServiceDefinition>
  register(name: string, service: ServiceDefinition): void
  names(): string[]
  has(key: string): boolean
  get(key: string): ServiceDefinition
}
