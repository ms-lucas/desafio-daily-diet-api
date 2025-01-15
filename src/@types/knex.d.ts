import { Knex } from "knex";

declare module "knex/types/tables" {
  export interface Tables {
    accounts: {
      id: string;
      name: string;
      email: string;
      password: string;
      within_diet_sequence: number;
      best_within_diet_sequence: number;
      created_at: Date;
    };
    meals: {
      id: string;
      account_id: string;
      name: string;
      description: string | null;
      eat_at: Date;
      within_diet: boolean;
      created_at: Date;
      updated_at: Date;
    };
  }
}
