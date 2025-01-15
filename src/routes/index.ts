import { FastifyInstance } from "fastify";
import { accountsRoutes } from "./accounts";
import { mealsRoutes } from "./meals";

export async function routes(app: FastifyInstance) {
  app.register(accountsRoutes, { prefix: "/accounts" });
  app.register(mealsRoutes, { prefix: "/meals" });
}
