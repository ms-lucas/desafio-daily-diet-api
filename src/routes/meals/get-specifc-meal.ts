import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { checkAuthentication } from "../../middlewares/check-authentication";
import { knex } from "../../lib/knex";
import { z } from "zod";

export async function getSpecificMeal(app: FastifyInstance) {
  app.get(
    "/:mealId",
    { preHandler: [checkAuthentication] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const getSpecificMealParamsSchema = z.object({
        mealId: z.string(),
      });

      const { mealId } = getSpecificMealParamsSchema.parse(request.params);

      const accountIdCookie = request.cookies.accountId;

      const meal = await knex("meals")
        .select()
        .where({
          id: mealId,
          account_id: accountIdCookie,
        })
        .first();

      reply.status(200).send({ meal });
    }
  );
}
