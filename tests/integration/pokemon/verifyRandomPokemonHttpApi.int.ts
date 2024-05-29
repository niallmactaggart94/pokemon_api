import { initTestEnv } from '../../common/setup/initTestsEnv';
import * as verifyPokemon from '../../../src/pokemon/usecases/verifyPokemonUseCase';
import { createErrorResult, createSuccessResult } from '../../../src/utils/Result';
import request from '../../common/utils/request';
describe('Test verify pokemon http api', () => {
  initTestEnv();

  it('GIVEN load failure WHEN verifyPokemonUseCase THEN return 400 status', async () => {
    // GIVEN
    jest
      .spyOn(verifyPokemon, 'verifyPokemonUseCase')
      .mockResolvedValueOnce(createErrorResult(verifyPokemon.VerifyPokemonErrorType.PokemonLoadFailure));

    // WHEN
    const response = await request.put('/api/v0/pokemon/1?pokemonName=pikachu');

    // THEN
    expect(response.status).toEqual(400);
    expect(response.body.messages[0].type).toEqual(verifyPokemon.VerifyPokemonErrorType.PokemonLoadFailure);
  });

  it('GIVEN valid response WHEN verifyPokemonUseCase THEN return 200 success', async () => {
    // GIVEN
    const verifyPokemonResponse = {
      isCorrect: true,
      imageUrl: 'imageUrl',
      name: 'pikachu',
    };
    jest.spyOn(verifyPokemon, 'verifyPokemonUseCase').mockResolvedValue(
      createSuccessResult({
        isCorrect: true,
        imageUrl: 'imageUrl',
        name: 'pikachu',
      })
    );

    // WHEN
    const response = await request.put('/api/v0/pokemon/1?pokemonName=pikachu');

    // THEN
    expect(response.status).toEqual(200);
    expect(response.body.data).toEqual(verifyPokemonResponse);
  });
});
