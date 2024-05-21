import { Knex } from 'knex';
import { migratePokemon } from '../../../dataMigrations/migratePokemon';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('pokemon', (table) => {
    table.integer('id').primary().notNullable();
    table.string('name').notNullable();
    table.string('image_url');
  });

  await knex.transaction(async (trx) => {
    await migratePokemon(trx);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('pokemon');
}
