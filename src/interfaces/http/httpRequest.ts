import { Context } from 'koa';

function getPathParamAsNumber(ctx: Context, name: string): number {
  return parseInt(getPathParam(ctx, name), 10);
}

function getPathParam(ctx: Context, name: string): string {
  return ctx.request.params[name];
}

export function httpRequest(ctx: Context) {
  return {
    getPathParamAsNumber: (name: string) => getPathParamAsNumber(ctx, name),
    getPathParam: (name: string) => getPathParam(ctx, name)
  };
}
