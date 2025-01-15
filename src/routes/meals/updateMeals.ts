import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { knex } from "../../lib/knex";
import { checkAuthentication } from "../../middlewares/check-authentication";

export async function updateMeals(app: FastifyInstance) {
  app.put(
    "/:mealId",
    { preHandler: [checkAuthentication] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const updateMealsBodySchema = z.object({
        name: z.string().nullish(),
        description: z.string().nullish(),
        eat_at: z.coerce.date().nullish(),
        within_diet: z.boolean().nullish(),
      });

      const updateMealsParamsSchema = z.object({
        mealId: z.string(),
      });

      const { name, description, eat_at, within_diet } =
        updateMealsBodySchema.parse(request.body);
      const { mealId } = updateMealsParamsSchema.parse(request.params);

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

      const [{ id }] = await knex("meals")
        .where({
          id: mealId,
          account_id: accountIdCookie,
        })
        .update({
          name: name ?? meal.name,
          description: description ?? meal.description,
          eat_at: eat_at ?? meal.eat_at,
          within_diet: within_diet ?? meal.within_diet,
          updated_at: knex.fn.now(),
        })
        .returning("id");

      return reply.status(200).send({
        mealId: id,
      });
    }
  );
}
