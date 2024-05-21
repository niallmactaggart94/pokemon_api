import axios from 'axios';
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('pokemon', (table) => {
    table.string('id').primary().notNullable();
    table.string('name').notNullable();
    table.string('silhouette_url').notNullable();
    table.string('image_url').notNullable();
  });
  
  try {
    const fiftyPokemon = await axios.get('https://pokeapi.co/api/v2/pokemon?limit=50&offset=0');
    console.log(fiftyPokemon);
  } catch (err) {
    console.log(err);
  }
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('pokemon');
}
