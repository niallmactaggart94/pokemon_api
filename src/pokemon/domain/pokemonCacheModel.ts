import { PokemonCache } from '../interface/redis/pokemonCacheRepository';
import { PokeDetails } from './pokemon';

export const createPokemonCacheDetails = (pokemon: PokeDetails): PokemonCache => ({
  id: pokemon.id,
  imageUrl: pokemon.sprites.other?.dream_world?.front_default ?? '',
  name: pokemon.name,
});
