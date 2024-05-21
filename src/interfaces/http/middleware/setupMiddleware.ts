import Koa from "koa";
import { error } from "./error";
import bodyParser from "koa-bodyparser";
import { setupRoutes } from "../routes/setupRoutes";

export async function setupMiddleware(app: Koa) {
  app.use(error);
  app.use(
    bodyParser({
      enableTypes: ["json"],
      strict: false,
    })
  );

  setupRoutes(app);
}
