import { startApp } from '../../../src/app';
import { Server } from 'http';
import supertest, { SuperTest } from 'supertest';
import { AddressInfo } from 'net';
import { getConfig } from '../../../src/config/appConfig';
import { Context, Next } from 'koa';
import { promisify } from 'util';

jest.mock('koa2-swagger-ui', () => ({
  koaSwagger: jest.fn().mockImplementation(() => async (ctx: Context, next: Next) => {
    if (ctx.path !== '/docs') await next();
  }),
}));

let appServer: Server;
export let requestUtil: SuperTest<any>;

export function initHttpEnv() {
  return {
    beforeAll: beforeAll(async () => {
      await setupHttpEnv();
    }),
    afterAll: afterAll(async () => {
      await tearDownHttpEnv();
    }),
    afterEach: afterEach(() => {
      jest.restoreAllMocks();
    }),
  };
}

export async function setupHttpEnv() {
  const { server } = await startApp();
  const testConfig = getConfig();
  appServer = server;
  const serverUrl = `http://${testConfig.host}:${getServerPort(appServer)}`;
  requestUtil = supertest(serverUrl);
}

function getServerPort(appServer: Server) {
  const address = appServer.address() as AddressInfo;
  return address.port;
}

export async function tearDownHttpEnv() {
  await promisify(appServer.close).bind(appServer)();
}
