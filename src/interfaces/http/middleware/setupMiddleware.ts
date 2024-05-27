import Koa from 'koa';
import { error } from './error';
import bodyParser from 'koa-bodyparser';
import { setupRoutes } from '../routes/setupRoutes';
import { setupCorsMiddleware } from './cors';

export async function setupMiddleware(app: Koa) {
  app.use(error);
  app.use(
    bodyParser({
      enableTypes: ['json'],
      strict: false,
    })
  );
  setupCorsMiddleware(app);
  setupRoutes(app);
}
