import { knex, Knex } from 'knex';
import knexConfig from '../../config/knexConfig';

let db = knex(knexConfig);

export async function reconnectDb(config: Record<string, any>) {
  await db.destroy();
  db = knex(config);
  return db;
}

export function getDb(): Knex {
  return db;
}

export default {
  getDb,
  reconnectDb,
};
