import redis, { ClientOpts, RedisClient } from 'redis';
import { promisify } from 'util';
import appConfig from '../../config/appConfig';

let client: RedisClient;

export function initRedis(prefix?: string) {
  let options: ClientOpts = {
    host: appConfig.redis.host,
    port: appConfig.redis.port,
  };

  if (client) {
    client.end(true);
  }

  if (prefix) {
    options = { ...options, prefix: prefix };
  }

  client = redis.createClient(options);
}

export function redisClient() {
  return {
    hset: promisify(client.hset).bind(client) as unknown as (
      key: string,
      field: string,
      value: string
    ) => Promise<number>,
    hget: promisify(client.hget).bind(client) as unknown as (key: string, field: string) => Promise<string>,
    hgetall: promisify(client.hgetall).bind(client) as unknown as (key: string) => Promise<{ [key: string]: string }>,
  };
}
