import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { checkAuthentication } from "../../middlewares/check-authentication";
import { knex } from "../../lib/knex";

export async function getMeals(app: FastifyInstance) {
  app.get(
    "/",
    { preHandler: [checkAuthentication] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const accountIdCookie = request.cookies.accountId;

      const meals = await knex("meals").select().where({
        account_id: accountIdCookie,
      });

      reply.status(200).send({meals});
    }
  );
}
