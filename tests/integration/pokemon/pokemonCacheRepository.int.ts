import { initRedis, redisClient } from '../../../src/interfaces/redis/redisSetup';
import pokemonCacheRepository, {
  POKEMON_CACHE,
  PokemonCache,
} from '../../../src/pokemon/interface/redis/pokemonCacheRepository';

describe('Test pokemonCacheRepository', () => {
  initRedis();

  afterEach(async () => {
    await redisClient().flushall();
  });
  it('GIVEN pokemon WHEN updatePokemonCache THEN save pokemon in cache', async () => {
    // GIVEN
    const pokemon: PokemonCache = { id: 1, name: 'pikachu', imageUrl: 'imageUrl' };

    // WHEN
    await pokemonCacheRepository.updatePokemonCache(pokemon);

    // THEN
    const onRedis = await redisClient().hget(POKEMON_CACHE, '1');
    expect(onRedis).toStrictEqual(JSON.stringify(pokemon));
  });

  it('GIVEN existing pokemonCache on redis WHEN getPokemonCache THEN return pokemonCache', async () => {
    // GIVEN
    const onRedis: PokemonCache = { id: 1, name: 'pikachu', imageUrl: 'imageUrl' };
    await pokemonCacheRepository.updatePokemonCache(onRedis);

    // WHEN
    const result = await pokemonCacheRepository.getPokemonCache('1');

    // THEN
    expect(result).toStrictEqual(onRedis);
  });
});
