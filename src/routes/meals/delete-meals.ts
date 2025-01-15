import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { knex } from "../../lib/knex";
import { checkAuthentication } from "../../middlewares/check-authentication";

export async function deleteMeals(app: FastifyInstance) {
  app.delete(
    "/:mealId",
    { preHandler: [checkAuthentication] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const deleteMealsParamsSchema = z.object({
        mealId: z.string(),
      });

      const { mealId } = deleteMealsParamsSchema.parse(request.params);

      const accountIdCookie = request.cookies.accountId;

      const meal = await knex("meals")
        .select()
        .where({
          id: mealId,
          account_id: accountIdCookie,
        })
        .first();

      if (!meal) {
        return reply.status(404).send({
          message: "Resource not found.",
        });
      }

      await knex("meals").delete().where({
        id: mealId,
        account_id: accountIdCookie,
      });

      return reply.status(204).send();
    }
  );
}
