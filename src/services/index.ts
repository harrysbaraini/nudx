import { Service } from '../lib/services';
import { Dictionary } from '../lib/types';
import ElasticSearch from './elasticsearch';
import { Git } from './git';
import Minio from './minio';
import MySql from './mysql';
import Nodejs from './nodejs';
import { PHP } from './php';
import Redis from './redis';

class Services {
  private services: Dictionary<Service> = {
    elasticsearch: new ElasticSearch(),
    git: new Git(),
    nodejs: new Nodejs(),
    minio: new Minio(),
    mysql: new MySql(),
    php: new PHP(),
    redis: new Redis(),
  };

  names(): string[] {
    return Object.keys(this.services);
  }

  has(key: string): boolean {
    return Object.prototype.hasOwnProperty.call(this.services, key);
  }

  get(key: string): Service {
    return this.services[key];
  }
}

export const services = new Services();
