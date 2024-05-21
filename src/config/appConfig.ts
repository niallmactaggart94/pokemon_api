import dotenv from 'dotenv';

dotenv.config();

export interface AppConfig {
  env: string;
  port: string;
  host: string;
}

const appConfig: AppConfig = {
  env: 'testLocal',
  port: '3000',
  host: 'localhost',
};

export function getConfig(): AppConfig {
  return appConfig;
}

export default appConfig;
