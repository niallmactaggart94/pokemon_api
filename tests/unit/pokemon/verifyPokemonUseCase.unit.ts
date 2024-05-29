import { PokeDetails } from '../../../src/pokemon/domain/pokemon';
import pokemonCacheRepository from '../../../src/pokemon/interface/redis/pokemonCacheRepository';
import { VerifyPokemonErrorType, verifyPokemonUseCase } from '../../../src/pokemon/usecases/verifyPokemonUseCase';
import { createErrorResult, createSuccessResult } from '../../../src/utils/Result';
import axios from 'axios';

const hget = jest.fn();
jest.mock('axios');
jest.mock('../../../src/interfaces/redis/redisSetup', () => ({
  redisClient: jest.fn(() => ({ hget, hset: jest.fn() })),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Unit test verifyPokemonUseCase', () => {
  beforeEach(() => {
    jest.spyOn(pokemonCacheRepository, 'updatePokemonCache');
  });
  afterAll(() => jest.clearAllMocks());

  const mockPokemon = {
    id: 1,
    imageUrl: 'mockImgUrl',
    name: 'Pikachu',
  };
  const mockSprites = {
    back_default: '',
    back_shiny: '',
    front_default: '',
    front_shiny: '',
    other: {
      dream_world: { front_default: 'front_default' },
      home: { front_default: 'front_default' },
    },
  };

  it('GIVEN pokemon exists in cache WHEN verifyPokemonUseCase THEN return success response indicating correct answer', async () => {
    //GIVEN
    hget.mockResolvedValueOnce(JSON.stringify(mockPokemon));

    //WHEN
    const result = await verifyPokemonUseCase(1, 'Pikachu');

    //THEN
    expect(pokemonCacheRepository.updatePokemonCache).not.toHaveBeenCalled();
    expect(result).toStrictEqual(
      createSuccessResult({
        isCorrect: true,
        imageUrl: 'mockImgUrl',
        name: 'Pikachu',
      })
    );
  });

  it('GIVEN pokemon exists in cache WHEN verifyPokemonUseCase THEN return success response indicating incorrect answer', async () => {
    //GIVEN
    hget.mockResolvedValueOnce(JSON.stringify(mockPokemon));

    //WHEN
    const result = await verifyPokemonUseCase(1, 'Clefairy');

    //THEN
    expect(pokemonCacheRepository.updatePokemonCache).not.toHaveBeenCalled();
    expect(result).toStrictEqual(
      createSuccessResult({
        isCorrect: false,
        imageUrl: 'mockImgUrl',
        name: 'Pikachu',
      })
    );
  });

  it('GIVEN pokemon does not exist in cache and error loading from PokeApi WHEN verifyPokemonUseCase THEN return error', async () => {
    //GIVEN
    hget.mockResolvedValueOnce(null);
    mockedAxios.get.mockRejectedValueOnce({ status: 400 });

    //WHEN
    const result = await verifyPokemonUseCase(1, 'Clefairy');

    //THEN
    expect(pokemonCacheRepository.updatePokemonCache).not.toHaveBeenCalled();
    expect(result).toStrictEqual(createErrorResult(VerifyPokemonErrorType.PokemonLoadFailure));
  });

  it('GIVEN pokemon does not exist in cache and nothing returned from PokeApi WHEN verifyPokemonUseCase THEN return error', async () => {
    //GIVEN
    hget.mockResolvedValueOnce(null);
    mockedAxios.get.mockResolvedValueOnce({ status: 200, data: null });

    //WHEN
    const result = await verifyPokemonUseCase(1, 'Clefairy');

    //THEN
    expect(pokemonCacheRepository.updatePokemonCache).not.toHaveBeenCalled();
    expect(result).toStrictEqual(createErrorResult(VerifyPokemonErrorType.PokemonNotFound));
  });

  it('GIVEN pokemon does not exist in cache WHEN verifyPokemonUseCase THEN return success response and add to cache', async () => {
    //GIVEN
    hget.mockResolvedValueOnce(null);
    const mockPokeApiResponse: PokeDetails = {
      id: 1,
      name: 'Pikachu',
      sprites: mockSprites,
    };
    mockedAxios.get.mockResolvedValueOnce({ data: mockPokeApiResponse, status: 200 });

    //WHEN
    const result = await verifyPokemonUseCase(1, 'Clefairy');

    //THEN
    expect(pokemonCacheRepository.updatePokemonCache).toHaveBeenCalled();
    expect(result).toStrictEqual(
      createSuccessResult({
        isCorrect: false,
        imageUrl: 'front_default',
        name: 'Pikachu',
      })
    );
  });
});
