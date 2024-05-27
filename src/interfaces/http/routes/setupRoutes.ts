import Koa from 'koa';
import pokemonRouter from '../../../pokemon/interface/http/pokemonRouter';
export function setupRoutes(app: Koa) {
  app.use(pokemonRouter.middleware());
}
