import Router, { Joi, Spec } from 'koa-joi-router';
import { getRandomPokemon, verifyPokemon } from './pokemonHandler';
const router = Router();

router.route(<Spec>{
  handler: getRandomPokemon,
  method: 'get',
  path: '/api/v0/pokemon',
});

router.route(<Spec>{
  handler: verifyPokemon,
  method: 'put',
  path: '/api/v0/pokemon/:pokemonId',
  validate: {
    params: {
      pokemonId: Joi.number().required(),
    },
    query: {
      pokemonName: Joi.string().required(),
    },
  },
});

export default router;
