import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";
import { compare, hash } from "bcrypt";
import z from "zod";
import { knex } from "../../lib/knex";

export async function createAccounts(app: FastifyInstance) {
  app.post("/", async (request: FastifyRequest, reply: FastifyReply) => {
    const createAccountsBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(8).max(16),
    });

    const { name, email, password } = createAccountsBodySchema.parse(
      request.body
    );

    const account = await knex("accounts")
      .select()
      .where({
        email,
      })
      .first();

    if (account) {
      const passwordMatch = await compare(password, account.password);

      if (!passwordMatch) {
        return reply.status(401).send({
          message: "Account already exits and email or password is incorrect.",
        });
      }

      await knex("accounts").update({
        name,
      });

      reply.cookie("accountId", account.id, {
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });

      return reply.status(200).send();
    }

    const passwordHash = await hash(password, 8);

    const [{ id }] = await knex("accounts")
      .insert({
        name,
        email,
        password: passwordHash,
      })
      .returning("id");

    reply.cookie("accountId", id, {
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return reply.status(201).send({
      accountId: id,
    });
  });
}
