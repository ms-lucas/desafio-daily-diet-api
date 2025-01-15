import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { checkAuthentication } from "../../middlewares/check-authentication";
import { knex } from "../../lib/knex";

export async function getMetrics(app: FastifyInstance) {
  app.get(
    "/metrics",
    { preHandler: [checkAuthentication] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const accountIdCookie = request.cookies.accountId;

      const [{ count: totalMeal }] = await knex("meals")
        .select()
        .where({
          account_id: accountIdCookie,
        })
        .count("id");

      const [{ count: totalMealsWithinDiet }] = await knex("meals")
        .select()
        .where({
          account_id: accountIdCookie,
          within_diet: true,
        })
        .count("id");

      const [{ count: totalMealsOutDient }] = await knex("meals")
        .select()
        .where({
          account_id: accountIdCookie,
          within_diet: false,
        })
        .count("id");

      const [
        {
          best_within_diet_sequence: bestWithinDietSequence,
          within_diet_sequence: withinDietSequence,
        },
      ] = await knex("accounts").select().where({
        id: accountIdCookie,
      });

      reply.status(200).send({
        totalMeal: Number(totalMeal),
        totalMealsWithinDiet: Number(totalMealsWithinDiet),
        totalMealsOutDient: Number(totalMealsOutDient),
        withinDietSequence,
        bestWithinDietSequence,
      });
    }
  );
}
