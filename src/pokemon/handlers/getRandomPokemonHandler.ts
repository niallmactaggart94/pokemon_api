import { Context, Next } from 'koa';
import httpResponse from '../../interfaces/http/httpResponse';
import handlerWithTransaction from '../../utils/handlerWithTransaction';
import { Knex } from 'knex';
import pokemonProvider from '../providers/pokemonProvider';

export interface RandomPokemonReponse {
  choices: string[];
  correctId: number;
  correctImageUrl: string;
}

const getRandomPokemon = handlerWithTransaction(async (ctx: Context, _next: Next, trx: Knex.Transaction) => {
  const result = await pokemonProvider.getRandomPokemon(trx);
  result.ifSuccess((value) => httpResponse(ctx).createSuccessResponse(200, value));
});

export default getRandomPokemon;
