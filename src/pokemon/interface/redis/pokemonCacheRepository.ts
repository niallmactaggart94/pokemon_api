import { redisClient } from '../../../interfaces/redis/redisSetup';

export const POKEMON_CACHE = 'pokemon.details.cache';

export interface PokemonCache {
  id: number;
  name: string;
  imageUrl: string;
}

const getPokemonCache = async (pokemonId: string): Promise<PokemonCache | undefined> => {
  const pokemon = await redisClient().hget(POKEMON_CACHE, pokemonId);
  return pokemon ? JSON.parse(pokemon) : undefined;
};

const updatePokemonCache = async (pokemonCache: PokemonCache) => {
  await redisClient().hset(POKEMON_CACHE, pokemonCache.id.toString(), JSON.stringify(pokemonCache));
};

export default {
  getPokemonCache,
  updatePokemonCache,
};
