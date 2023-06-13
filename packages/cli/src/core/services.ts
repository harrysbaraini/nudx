import { ServiceDefinition, Services } from './interfaces/services';

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
};
