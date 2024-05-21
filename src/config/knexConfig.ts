import dotenv from 'dotenv';
import { Knex } from 'knex';
import config from '../knexfile';

dotenv.config();
const knexConfig: Knex.Config = config.test;

export default knexConfig;
