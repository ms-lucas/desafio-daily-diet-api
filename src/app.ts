import { fastify } from "fastify";
import { fastifyCookie } from "@fastify/cookie";
import { routes } from "./routes";
import { ZodError } from "zod";

export const app = fastify();

app.register(fastifyCookie);

app.register(routes);

app.setErrorHandler((error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send(error);
  }

  return reply.status(500).send(error);
});
