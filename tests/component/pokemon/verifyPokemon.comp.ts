import { redisClient } from '../../../src/interfaces/redis/redisSetup';
import { initTestEnv } from '../../common/setup/initTestsEnv';
import request from '../../common/utils/request';

describe('Test verifyPokemon comp', () => {
  initTestEnv();
  afterEach(async () => {
    await redisClient().flushall();
  });

  it('GIVEN an invalid request WHEN verifyPokemon THEN return validation error', async () => {
    const result = await request.put('/api/v0/pokemon/1');
    expect(result.body).toEqual({
      status: 'FAIL',
      messages: [
        {
          type: 'QueryFormatError',
          message: '"pokemonName" is required',
          field: 'pokemonName',
          severity: 'ERROR',
        },
      ],
    });
  });

  it('GIVEN a valid request but an unknown PokeID WHEN verifyPokemon THEN return error', async () => {
    const result = await request.put('/api/v0/pokemon/10000000?pokemonName=pikachu');
    expect(result.body).toEqual({
      status: 'FAIL',
      messages: [
        {
          message: 'Pokemon with that ID not found',
          type: 'PokemonLoadFailure',
          severity: 'ERROR',
        },
      ],
    });
  });

  it('GIVEN a valid request WHEN verifyPokemon THEN return success', async () => {
    const result = await request.put('/api/v0/pokemon/1?pokemonName=bulbasaur');
    expect(result.body).toEqual({
      status: 'SUCCESS',
      messages: [],
      data: {
        isCorrect: true,
        imageUrl: expect.anything(),
        name: 'bulbasaur',
      },
    });
  });
});
