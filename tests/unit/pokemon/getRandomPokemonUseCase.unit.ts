import axios from 'axios';
import pokemonCacheRepository, { PokemonCache } from '../../../src/pokemon/interface/redis/pokemonCacheRepository';
import { RandomPokemonError, getRandomPokemonUseCase } from '../../../src/pokemon/usecases/getRandomPokemonUseCase';
import { createErrorResult, createSuccessResult } from '../../../src/utils/Result';

const hgetall = jest.fn();
jest.mock('axios');
jest.mock('../../../src/interfaces/redis/redisSetup', () => ({
  redisClient: jest.fn(() => ({ hgetall, hset: jest.fn() })),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Unit test getRandomPokemonUseCase', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.spyOn(global.Math, 'random').mockReturnValue(0);
    jest.spyOn(pokemonCacheRepository, 'updatePokemonCache');
  });

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

  const mockPokemon: PokemonCache[] = [
    { id: 1, imageUrl: 'imageUrl1', name: 'Pikachu' },
    { id: 2, imageUrl: 'imageUrl2', name: 'Bulbasaur' },
    { id: 3, imageUrl: 'imageUrl3', name: 'Charmander' },
    { id: 4, imageUrl: 'imageUrl4', name: 'Charizard' },
  ];

  it('GIVEN values exist in the cache WHEN getRandomPokemonUseCase THEN return successful response', async () => {
    //GIVEN
    const mockCache = getMockCache(mockPokemon);
    hgetall.mockImplementationOnce(() => mockCache);

    //WHEN
    const result = await getRandomPokemonUseCase();

    //THEN
    expect(pokemonCacheRepository.updatePokemonCache).not.toHaveBeenCalled();
    expect(result).toStrictEqual(
      createSuccessResult({
        choices: mockPokemon.map((poke) => poke.name),
        correctId: 1,
        correctImageUrl: 'imageUrl1',
      })
    );
  });

  it('GIVEN not enough values exist in the cache WHEN getRandomPokemonUseCase THEN return error response', async () => {
    //GIVEN
    const mockCache = getMockCache(mockPokemon.slice(0, 3));
    hgetall.mockImplementationOnce(() => mockCache);

    //WHEN
    const result = await getRandomPokemonUseCase();

    //THEN
    expect(pokemonCacheRepository.updatePokemonCache).not.toHaveBeenCalled();
    expect(result).toStrictEqual(createErrorResult(RandomPokemonError.NoPokemonFound));
  });

  it('GIVEN no values exist in the cache and a successful response from PokeApi WHEN getRandomPokemonUseCase THEN return success', async () => {
    //GIVEN
    mockedAxios.get.mockResolvedValueOnce({
      data: { results: mockPokemon.map((pokemon) => ({ name: pokemon.name, url: pokemon.imageUrl })) },
    });

    mockPokemon.forEach((pokemon) => {
      mockedAxios.get.mockResolvedValueOnce({ data: { name: pokemon.name, id: pokemon.id, sprites: mockSprites } });
    });

    hgetall.mockImplementationOnce(() => null);

    //WHEN
    const result = await getRandomPokemonUseCase();

    //THEN
    expect(pokemonCacheRepository.updatePokemonCache).toHaveBeenCalledTimes(mockPokemon.length);
    expect(result).toStrictEqual(
      createSuccessResult({
        choices: mockPokemon.map((poke) => poke.name),
        correctId: 1,
        correctImageUrl: 'front_default',
      })
    );
  });

  it('GIVEN unsuccessful response from PokeApi list call WHEN getRandomPokemonUseCase THEN return error', async () => {
    //GIVEN
    hgetall.mockImplementationOnce(() => null);
    mockedAxios.get.mockRejectedValueOnce({ status: 400, data: null });

    //WHEN
    const result = await getRandomPokemonUseCase();

    //THEN
    expect(pokemonCacheRepository.updatePokemonCache).not.toHaveBeenCalled();
    expect(result).toStrictEqual(createErrorResult(RandomPokemonError.PokemonLoadFailure));
  });

  it('GIVEN unsuccessful response from PokeApi details call WHEN getRandomPokemonUseCase THEN return error', async () => {
    //GIVEN
    hgetall.mockImplementationOnce(() => null);
    mockedAxios.get
      .mockResolvedValueOnce({
        data: { results: mockPokemon.map((pokemon) => ({ name: pokemon.name, url: pokemon.imageUrl })) },
      })
      .mockRejectedValueOnce({ status: 400, data: null });

    //WHEN
    const result = await getRandomPokemonUseCase();

    //THEN
    expect(pokemonCacheRepository.updatePokemonCache).not.toHaveBeenCalled();
    expect(result).toStrictEqual(createErrorResult(RandomPokemonError.PokemonLoadFailure));
  });
});

const getMockCache = (pokemon: PokemonCache[]) =>
  pokemon.reduce((acc: { [id: string]: string }, val: PokemonCache) => {
    const id = val.id.toString();
    acc[id as keyof PokemonCache] = JSON.stringify(val);
    return acc;
  }, {});
