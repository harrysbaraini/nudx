import { Service } from '../lib/services';
import { Dictionary } from '../lib/types';
import ElasticSearch from './elasticsearch/elasticsearch';
import { Git } from './git/git';
import Minio from './minio/minio';
import MySql from './mysql/mysql';
import Nodejs from './nodejs/nodejs';
import { PHP } from './php/php';
import Redis from './redis/redis';

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
