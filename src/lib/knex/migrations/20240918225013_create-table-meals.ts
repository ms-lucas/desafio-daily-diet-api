import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("meals", (table) => {
    table.uuid("id").primary().defaultTo(knex.fn.uuid());
    table.uuid("account_id");
    table.string("name");
    table.string("description");
    table.dateTime("eat_at");
    table.boolean("within_diet");
    table.dateTime("created_at").defaultTo(knex.fn.now());
    table.dateTime("updated_at").defaultTo(knex.fn.now());

    table.foreign("account_id").references("id").inTable("accounts");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("meals");
}
