import { FastifyInstance } from "fastify";
import { createAccounts } from "./create-accounts";

export async function accountsRoutes(app: FastifyInstance) {
  app.register(createAccounts);
}
