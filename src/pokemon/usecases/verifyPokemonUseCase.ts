import axios, { AxiosResponse } from 'axios';
import { redisClient } from '../../interfaces/redis/redisSetup';
import { Result, createErrorResult, createSuccessResult } from '../../utils/Result';
import { PokeDetails, PokemonVerificationResponse } from '../domain/pokemon';
import pokemonCacheRepository, { POKEMON_CACHE, PokemonCache } from '../interface/redis/pokemonCacheRepository';
import { createPokemonCacheDetails } from '../domain/pokemonCacheModel';

export enum VerifyPokemonErrorType {
  PokemonNotFound = 'PokemonNotFound',
  PokemonLoadFailure = 'PokemonLoadFailure',
}

export const verifyPokemonUseCase = async (
  pokemonId: number,
  pokemonName: string
): Promise<Result<PokemonVerificationResponse, VerifyPokemonErrorType>> => {
  let pokemon: PokemonCache | null = null;

  const pokemonCache = await redisClient().hget(POKEMON_CACHE, pokemonId.toString());
  if (!pokemonCache) {
    try {
      const pokeResponse: AxiosResponse<PokeDetails> = await axios.get(
        `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
      );

      if (pokeResponse.data) {
        const pokemonCacheDetails = createPokemonCacheDetails(pokeResponse.data);
        await pokemonCacheRepository.updatePokemonCache(pokemonCacheDetails);
        pokemon = pokemonCacheDetails;
      }
    } catch (err) {
      return createErrorResult(VerifyPokemonErrorType.PokemonLoadFailure);
    }
  } else {
    pokemon = JSON.parse(pokemonCache) as PokemonCache;
  }

  return pokemon
    ? createSuccessResult({
        isCorrect: pokemon.name === pokemonName,
        imageUrl: pokemon.imageUrl,
        name: pokemon.name,
      })
    : createErrorResult(VerifyPokemonErrorType.PokemonNotFound);
};
