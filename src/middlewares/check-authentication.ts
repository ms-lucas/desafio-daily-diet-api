import { FastifyReply, FastifyRequest } from "fastify";

export async function checkAuthentication(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const accountIdCookie = request.cookies.accountId;

  if (!accountIdCookie) {
    reply.status(400).send({
      message: "It's necessary to authenticate to proceed.",
    });
  }
}
