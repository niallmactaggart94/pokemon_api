import { redisClient } from '../../../src/interfaces/redis/redisSetup';
import { RANDOM_POKEMON_LIMIT } from '../../../src/pokemon/usecases/getRandomPokemonUseCase';
import { initTestEnv } from '../../common/setup/initTestsEnv';
import request from '../../common/utils/request';

describe('Test getRandomPokemon comp', () => {
  initTestEnv();

  afterEach(async () => {
    await redisClient().flushall();
  });

  it('WHEN getRandomPokemon THEN return 200 status and valid response body', async () => {
    const result = await request.get('/api/v0/pokemon');
    expect(result.body.status).toEqual('SUCCESS');
    expect(result.body.data.correctId > 0 && result.body.data.correctId <= 50).toBeTruthy();
    expect(result.body.data.choices.length).toEqual(RANDOM_POKEMON_LIMIT);
  });
});
