import { FastifyInstance } from "fastify";
import { registerMeals } from "./register-meals";
import { updateMeals } from "./updateMeals";
import { deleteMeals } from "./delete-meals";
import { getMeals } from "./get-meals";
import { getSpecificMeal } from "./get-specifc-meal";
import { getMetrics } from "./get-metrics";

export async function mealsRoutes(app: FastifyInstance) {
  app.register(getMeals);
  app.register(getSpecificMeal);
  app.register(getMetrics);
  app.register(registerMeals);
  app.register(updateMeals);
  app.register(deleteMeals);
}
