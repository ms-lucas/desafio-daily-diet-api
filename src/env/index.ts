import { config } from "dotenv";
import { z } from "zod";

if (process.env.NODE_ENV === "test") {
  config({ path: ".env.test" });
} else {
  config();
}

const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().int().default(3333),
  DATABASE_CLIENT: z.enum(["sqlite", "pg"]).default("sqlite"),
  DATABASE_URL: z.string(),
});

const { success, data, error } = envSchema.safeParse(process.env);

if (!success) {
  console.error("Error during validation of environment variables.");
  if (error.flatten().formErrors[0]) {
    console.table(error.flatten().formErrors);
  }
  if (error.flatten().fieldErrors) {
    console.table(error.flatten().fieldErrors);
  }
  process.exit();
}

export const env = data;
