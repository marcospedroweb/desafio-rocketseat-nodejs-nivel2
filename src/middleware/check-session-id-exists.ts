import type { FastifyReply, FastifyRequest } from "fastify"
import type { User } from "../models/user.model.js"
import { knex } from "../database.js"

export async function checkSessionIdExists(request: FastifyRequest, reply: FastifyReply) {
  const sessionId = request.cookies.sessionId

  if (!sessionId) {
    return reply.status(401).send({
      error: 'Não autorizado, é necessário fazer login.'
    })
  }

  const userId = await knex<User>('users')
    .where('session_id', sessionId)
    .select('id')
    .first()

  if (!userId) {
    return reply.status(401).send({
      error: 'Usuario não encontrado'
    })
  }

  request.userId = userId.id;
}