import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const { PG_USER, PG_PASSWORD, PG_DATABASE, PG_HOST, PG_PORT } = process.env;

const BASE_PATH = path.join(__dirname, 'interfaces', 'db');

const config = {
  development: {
    client: 'pg',
    connection: `postgres://${PG_USER}:${PG_PASSWORD}@${PG_HOST}:${PG_PORT}/${PG_DATABASE}`,
    useNullAsDefault: true,
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
  test: {
    client: 'pg',
    connection: {
      host: PG_HOST || 'localhost',
      database: PG_DATABASE || 'pokemon_db',
      port: PG_PORT || 5432,
      user: PG_USER || 'whosthatpokemon',
      password: PG_PASSWORD || 'whosthatpokemon',
    },
    migrations: {
      directory: path.join(BASE_PATH, 'migrations'),
    },
    seeds: {
      directory: path.join(BASE_PATH, 'seeds'),
    },
  },
};

module.exports = config;

export default config;
