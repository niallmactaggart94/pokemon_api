import { setupHttpEnv, tearDownHttpEnv } from './initHttpEnv';
// import { tearDownRedisEnv } from './initRedisEnv';

export function initTestEnv() {
  return {
    beforeAll: beforeAll(async () => {
      await setup();
    }),
    afterEach: afterEach(async () => {
      jest.restoreAllMocks();
    }),
    afterAll: afterAll(async () => {
      await tearDown();
    }),
  };
}

async function setup() {
  await setupHttpEnv();
}

async function tearDown() {
  tearDownHttpEnv();
}
