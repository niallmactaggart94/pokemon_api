import cors from '@koa/cors';
import Koa, { Context } from 'koa';

export const defaultOrigin = 'http://localhost';

const localhostOriginExp = /^https?:\/\/localhost(:\d+)?/;

export function setupCorsMiddleware(app: Koa) {
  app.use(
    cors({
      origin: getOrigin,
      credentials: true,
    })
  );
}

function getOrigin(ctx: Context): string {
  const requestOrigin = extractRequestOrigin(ctx);

  if (localhostOriginExp.test(requestOrigin)) {
    return requestOrigin;
  }

  return defaultOrigin;
}

function extractRequestOrigin(ctx: Context): string {
  return ctx.request?.header?.origin || '';
}
