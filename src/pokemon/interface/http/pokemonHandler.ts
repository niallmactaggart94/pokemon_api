import { Context, Next } from 'koa';
import httpResponse from '../../../interfaces/http/httpResponse';
import { getRandomPokemonUseCase } from '../../usecases/getRandomPokemonUseCase';
import { VerifyPokemonErrorType, verifyPokemonUseCase } from '../../usecases/verifyPokemonUseCase';

export const verifyPokemon = async (ctx: Context, next: Next) => {
  const { params, query } = ctx.request;
  const pokemonId = +params.pokemonId;
  const pokemonName = query.pokemonName as string;

  const result = await verifyPokemonUseCase(pokemonId, pokemonName);
  result
    .ifSuccess((value) => httpResponse(ctx).createSuccessResponse(200, value))
    .ifError((error) => {
      const notFoundError = error === VerifyPokemonErrorType.PokemonNotFound;
      const status = notFoundError ? 404 : 400;
      httpResponse(ctx).createErrorResponse(status, {
        message: notFoundError ? 'Error querying PokeAPI' : 'Pokemon with that ID not found',
        type: error,
      });
    });

  await next();
};

export const getRandomPokemon = async (ctx: Context, next: Next) => {
  const result = await getRandomPokemonUseCase();
  result
    .ifSuccess((value) => httpResponse(ctx).createSuccessResponse(200, value))
    .ifError((error) => {
      httpResponse(ctx).createErrorResponse(400, {
        message: 'Error querying PokeAPI',
        type: error,
      });
    });
  await next();
};
