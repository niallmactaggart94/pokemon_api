import { Context } from "koa";
import httpResponse from "../../interfaces/http/httpResponse";

const verifyPokemon = async (ctx: Context) => {
  httpResponse(ctx).createSuccessResponse(200, { pokemon: "ezssdf" });
};

export default verifyPokemon;
