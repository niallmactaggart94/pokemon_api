import { Knex } from 'knex';
import { PokeDetails, Pokemon } from '../domain/pokemon';

interface PokemonDbEntry {
  name: string;
  id: number;
  image_url: string;
}

export const POKEMON_TABLE_NAME = 'pokemon';

const toPokemon = (input: PokemonDbEntry): Pokemon => ({
  id: input.id,
  name: input.name,
  imageUrl: input.image_url,
});

export const pokemonModel = {
  insert: async (pokemon: PokeDetails[], trx: Knex.Transaction): Promise<void> => {
    const pokemonData: PokemonDbEntry[] = pokemon.map((pokemon) => ({
      name: pokemon.name,
      id: pokemon.id,
      image_url: pokemon.sprites.front_default || pokemon.sprites.back_shiny || '',
    }));

    await trx(POKEMON_TABLE_NAME).insert(pokemonData);
  },
  getPokemonByName: async (name: string, trx: Knex.Transaction): Promise<Pokemon | null> => {
    const result = await trx(POKEMON_TABLE_NAME).where({ name }).first();
    return result ? toPokemon(result) : null;
  },
  getPokemonById: async (id: number, trx: Knex.Transaction): Promise<Pokemon | null> => {
    const result = await trx(POKEMON_TABLE_NAME).where({ id }).first();
    return result ? toPokemon(result) : null;
  },
  getRandomPokemon: async (limit: number, trx: Knex.Transaction): Promise<Pokemon[]> => {
    const result = await trx.raw(`select * from pokemon order by random() limit ${limit};`);
    return result.rows.map(toPokemon);
  },
};
