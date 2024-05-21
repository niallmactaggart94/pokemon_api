import { Context, Next } from 'koa';
import httpResponse from '../../interfaces/http/httpResponse';
import pokemonProvider, { PokemonErrorType } from '../providers/pokemonProvider';
import { Knex } from 'knex';
import handlerWithTransaction from '../../utils/handlerWithTransaction';

export interface PokemonVerificationResponse {
  isCorrect: boolean;
  imageUrl: string;
  name: string;
}

const verifyPokemon = handlerWithTransaction(async (ctx: Context, _next: Next, trx: Knex.Transaction) => {
  const { params, query } = ctx.request;
  const pokemonId = +params.pokemonId;
  const pokemonName = query.pokemonName as string;

  const result = await pokemonProvider.verifyPokemon(pokemonId, pokemonName, trx);
  result
    .ifSuccess((value) => httpResponse(ctx).createSuccessResponse(200, value))
    .ifError((error) => {
      const notFoundError = error === PokemonErrorType.PokemonNotFound;
      const status = notFoundError ? 404 : 400;
      httpResponse(ctx).createErrorResponse(status, {
        message: notFoundError ? 'Unknown error' : 'Pokemon with that name not found',
        type: error,
      });
    });
});

export default verifyPokemon;
