import { Knex } from 'knex';
import { pokemonModel } from '../models/pokemonModel';
import { Result, createErrorResult, createSuccessResult } from '../../utils/Result';
import { RandomPokemonReponse } from '../handlers/getRandomPokemonHandler';
import { PokemonVerificationResponse } from '../handlers/verifyPokemonHandler';

const RANDOM_POKEMON_LIMIT = 4;

export enum PokemonErrorType {
  PokemonNotFound = 'PokemonNotFound',
}

const pokemonProvider = {
  getRandomPokemon: async (trx: Knex.Transaction): Promise<Result<RandomPokemonReponse>> => {
    const randomPokemon = await pokemonModel.getRandomPokemon(RANDOM_POKEMON_LIMIT, trx);
    const [correctPokemon] = randomPokemon;

    return createSuccessResult({
      choices: randomPokemon
        .map((value) => ({ value, sort: Math.random() }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value.name),
      correctId: correctPokemon.id,
      correctImageUrl: correctPokemon.imageUrl,
    });
  },
  verifyPokemon: async (
    pokemonId: number,
    pokemonName: string,
    trx: Knex.Transaction
  ): Promise<Result<PokemonVerificationResponse, PokemonErrorType>> => {
    const pokemon = await pokemonModel.getPokemonById(pokemonId, trx);
    if (!pokemon) return createErrorResult(PokemonErrorType.PokemonNotFound);

    return createSuccessResult({
      isCorrect: pokemon.name === pokemonName,
      imageUrl: pokemon.imageUrl,
      name: pokemon.name,
    });
  },
};

export default pokemonProvider;
