import dotenv from 'dotenv';

dotenv.config();

const { TEST_REDIS_HOST, TEST_REDIS_PORT } = process.env;

export interface AppConfig {
  env: string;
  port: string;
  host: string;
  redis: {
    port: number;
    host: string;
  };
}

const appConfig: AppConfig = {
  env: 'testLocal',
  port: '3000',
  host: 'localhost',
  redis: {
    host: TEST_REDIS_HOST || 'localhost',
    port: +(TEST_REDIS_PORT || 4302),
  },
};

export function getConfig(): AppConfig {
  return appConfig;
}

export default appConfig;
