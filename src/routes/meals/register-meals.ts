import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";
import { knex } from "../../lib/knex";
import { checkAuthentication } from "../../middlewares/check-authentication";

export async function registerMeals(app: FastifyInstance) {
  app.post(
    "/",
    { preHandler: [checkAuthentication] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const registerMealsBodySchema = z.object({
        name: z.string(),
        description: z.string().nullish(),
        eat_at: z.coerce.date(),
        within_diet: z.boolean(),
      });

      const accountIdCookie = request.cookies.accountId;

      const { name, description, eat_at, within_diet } =
        registerMealsBodySchema.parse(request.body);

      const transaction = await knex.transaction();

      const account = await knex("accounts")
        .select()
        .where({
          id: accountIdCookie,
        })
        .first();

      if (!account) {
        return reply.status(404).send("Account not found.");
      }

      if (within_diet) {
        const newWithinDietSequence = account.within_diet_sequence + 1;

        await transaction("accounts")
          .update({
            within_diet_sequence: newWithinDietSequence,
          })
          .where({
            id: account.id,
          });

        if (newWithinDietSequence > account.best_within_diet_sequence) {
          await transaction("accounts")
            .where({
              id: account.id,
            })
            .update({
              best_within_diet_sequence: newWithinDietSequence,
            });
        }
      }

      if (!within_diet) {
        await transaction("accounts")
          .update({
            within_diet_sequence: 0,
          })
          .where({
            id: account.id,
          });
      }

      const [{ id }] = await transaction("meals")
        .insert({
          name,
          account_id: accountIdCookie,
          description,
          eat_at,
          within_diet,
        })
        .returning("id");

      transaction.commit();

      return reply.status(201).send({ mealId: id });
    }
  );
}
