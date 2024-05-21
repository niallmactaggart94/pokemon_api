import Koa from 'koa';
import pokemonRouter from '../../../pokemon/routes/pokemonRouter';
export function setupRoutes(app: Koa) {
  app.use(pokemonRouter.middleware());
}
