import { Knex } from 'knex';
import Transaction = Knex.Transaction;
import axios, { AxiosResponse } from 'axios';
import { PokeApiResponse, PokeDetails, PokeList } from '../pokemon/domain/pokemon';
import { pokemonModel } from '../pokemon/models/pokemonModel';

export const migratePokemon = async (trx: Knex.Transaction) => {
  const pokeResponse: AxiosResponse<PokeApiResponse> = await axios.get(
    'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0'
  );
  const fiftyPokemon = pokeResponse.data.results;
  await processPokemon(fiftyPokemon, trx);
  console.log(`Migrated successfully ${fiftyPokemon.length} pokemon`);
};

async function processPokemon(pokemon: PokeList[], trx: Transaction) {
  await Promise.all(
    pokemon.map(async (pokemon) => {
      const found = await pokemonModel.getPokemonByName(pokemon.name, trx);

      if (found) {
        console.log(`Pokemon ${pokemon.name} already exists - skipping migration`);
        return;
      }

      const pokemonResponse: AxiosResponse<PokeDetails> = await axios.get(pokemon.url);
      await pokemonModel.insert([pokemonResponse.data], trx);
    })
  );
}
