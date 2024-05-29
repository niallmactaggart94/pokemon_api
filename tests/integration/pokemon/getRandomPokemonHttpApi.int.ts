import { initTestEnv } from '../../common/setup/initTestsEnv';
import * as getRandomPokemon from '../../../src/pokemon/usecases/getRandomPokemonUseCase';
import { createErrorResult, createSuccessResult } from '../../../src/utils/Result';
import request from '../../common/utils/request';
describe('Test get random pokemon http api', () => {
  initTestEnv();

  it('GIVEN load failure WHEN getRandomPokemonUseCase THEN return 400 status', async () => {
    // GIVEN
    jest
      .spyOn(getRandomPokemon, 'getRandomPokemonUseCase')
      .mockResolvedValue(createErrorResult(getRandomPokemon.RandomPokemonError.PokemonLoadFailure));

    // WHEN
    const response = await request.get('/api/v0/pokemon');

    // THEN
    expect(response.status).toEqual(400);
    expect(response.body.messages[0].type).toEqual(getRandomPokemon.RandomPokemonError.PokemonLoadFailure);
  });

  it('GIVEN valid response WHEN getRandomPokemonUseCase THEN return 200 success', async () => {
    // GIVEN
    const randomPokemon = { choices: [], correctId: 1, correctImageUrl: 'imageUrl' };
    jest.spyOn(getRandomPokemon, 'getRandomPokemonUseCase').mockResolvedValue(createSuccessResult(randomPokemon));

    // WHEN
    const response = await request.get('/api/v0/pokemon');

    // THEN
    expect(response.status).toEqual(200);
    expect(response.body.data).toEqual(randomPokemon);
  });
});
