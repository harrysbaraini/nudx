import { Dictionary } from './interfaces/generic';
import { ServiceDefinition } from './interfaces/services';

interface Services {
  services: Dictionary<ServiceDefinition>;
  register(name: string, service: ServiceDefinition): void;
  names(): string[];
  has(key: string): boolean;
  get(key: string): ServiceDefinition;
}

/**
 * Class to manager registered services.
 */
export const services: Services = {
  services: {},

  register(name: string, service: ServiceDefinition): void {
    this.services[name] = service;
  },

  names(): string[] {
    return Object.keys(this.services);
  },

  has(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.services, key);
  },

  get(key: string): ServiceDefinition {
    return this.services[key];
  },
}
