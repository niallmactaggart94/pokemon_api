import axios, { AxiosResponse } from 'axios';
import { PokeApiResponse, PokeDetails, RandomPokemonReponse } from '../domain/pokemon';
import { redisClient } from '../../interfaces/redis/redisSetup';
import pokemonCacheRepository, { POKEMON_CACHE, PokemonCache } from '../interface/redis/pokemonCacheRepository';
import { Result, createErrorResult, createSuccessResult } from '../../utils/Result';
import { createPokemonCacheDetails } from '../domain/pokemonCacheModel';
import logger from '../../utils/Logger';

export enum RandomPokemonError {
  PokemonLoadFailure = 'PokemonLoadFailure',
  NoPokemonFound = 'NoPokemonFound',
}

export const RANDOM_POKEMON_LIMIT = 4;

const getRandomPokemon = (pokemonCache: PokemonCache[]): RandomPokemonReponse => {
  const randomPokemon = pokemonCache.sort(() => 0.5 - Math.random()).slice(0, RANDOM_POKEMON_LIMIT);
  const [correctPokemon] = randomPokemon;
  return {
    choices: randomPokemon
      .map((value) => ({ value, sort: Math.random() }))
      .sort((a, b) => a.sort - b.sort)
      .map(({ value }) => value.name),
    correctId: correctPokemon.id,
    correctImageUrl: correctPokemon.imageUrl,
  };
};

export const getRandomPokemonUseCase = async (): Promise<Result<RandomPokemonReponse, RandomPokemonError>> => {
  let pokemon: PokemonCache[] = [];
  const pokeCache = await redisClient().hgetall(POKEMON_CACHE);
  if (!pokeCache || (pokeCache && Object.values(pokeCache).length < RANDOM_POKEMON_LIMIT)) {
    try {
      const pokeResponse: AxiosResponse<PokeApiResponse> = await axios.get(
        'https://pokeapi.co/api/v2/pokemon?limit=50&offset=0'
      );
      const fiftyPokemon = pokeResponse.data.results;
      await Promise.all(
        fiftyPokemon.map(async (poke) => {
          const pokeDetailsResponse: AxiosResponse<PokeDetails> = await axios.get(poke.url);
          if (pokeDetailsResponse) {
            const pokemonCache = createPokemonCacheDetails(pokeDetailsResponse.data);
            pokemon.push(pokemonCache);
            await pokemonCacheRepository.updatePokemonCache(pokemonCache);
          }
        })
      );
    } catch (err) {
      logger.error(`Error fetching random pokemon`);
      return createErrorResult(RandomPokemonError.PokemonLoadFailure);
    }
  } else {
    pokemon = Object.values(pokeCache).map((pokemon) => JSON.parse(pokemon) as PokemonCache);
  }

  return pokemon.length
    ? createSuccessResult(getRandomPokemon(pokemon))
    : createErrorResult(RandomPokemonError.NoPokemonFound);
};
