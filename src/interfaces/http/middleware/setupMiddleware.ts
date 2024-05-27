import Koa from 'koa';
import { error } from './error';
import bodyParser from 'koa-bodyparser';
import { setupRoutes } from '../routes/setupRoutes';
import { setupCorsMiddleware } from './cors';
import { koaSwagger } from 'koa2-swagger-ui';
import yamljs from 'yamljs';

export async function setupMiddleware(app: Koa) {
  const spec = yamljs.load('docs/api.yaml');

  app.use(error);
  app.use(
    bodyParser({
      enableTypes: ['json'],
      strict: false,
    })
  );
  app.use(
    koaSwagger({
      routePrefix: '/docs',
      swaggerOptions: {
        spec,
      },
    })
  );
  setupCorsMiddleware(app);
  setupRoutes(app);
}
