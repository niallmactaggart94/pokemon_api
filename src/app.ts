import Koa from 'koa';
import { getConfig } from './config/appConfig';
import { setupMiddleware } from './interfaces/http/middleware/setupMiddleware';
import { initRedis } from './interfaces/redis/redisSetup';

export async function startApp() {
  const { port, host, env } = getConfig();

  if (!port || !host) {
    throw new Error('no port or host provided');
  }

  initRedis();

  console.log(`App run in ${env} environment`);

  const app = new Koa();
  await setupMiddleware(app);
  const server = app.listen(port, ~~host);

  console.log('Listening on %s:%s', host, port);

  return {
    server,
  };
}
