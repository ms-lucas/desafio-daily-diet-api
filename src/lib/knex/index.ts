import { Knex, knex as setupKnex } from "knex";
import { env } from "../../env";

export const knexConfig: Knex.Config = {
  client: env.DATABASE_CLIENT,
  connection:
    env.DATABASE_CLIENT === "sqlite"
      ? {
          filename: env.DATABASE_URL,
        }
      : env.DATABASE_URL,
  useNullAsDefault: true,
  migrations: {
    extension: "ts",
    directory: "./src/lib/knex/migrations",
  },
};

export const knex = setupKnex(knexConfig);
