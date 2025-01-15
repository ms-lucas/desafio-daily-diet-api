import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("accounts", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.string("name");
    table.string("email").unique().index();
    table.string("password");
    table.integer("within_diet_sequence").defaultTo(0);
    table.integer("best_within_diet_sequence").defaultTo(0);
    table.dateTime("created_at").defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("accounts");
}
