import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { knex } from "../database.js";
import crypto from 'node:crypto'
import bcrypt from "bcrypt";
import type { User } from "../models/user.js";

export async function usersRoutes(app: FastifyInstance) {

  app.post('/', async (request, reply) => {
    const createUserBodySchema = z.object({
      email: z.string(),
      password: z.string(),
    })

    const { email, password } = createUserBodySchema.parse(request.body)
    const hash = await bcrypt.hash(password, 10)

    await knex('users')
      .insert({
        id: crypto.randomUUID(),
        email,
        password: hash,
      })

    return reply.status(201).send()
  })

  app.post('/login', async (request, reply) => {
    const loginUserBodySchema = z.object({
      email: z.string().email("E-mail inválido"),
      password: z.string(),
    })

    const { email, password } = loginUserBodySchema.parse(request.body)
    const user = await knex<User>('users')
      .where('email', email)
      .select("id", "password", "session_id")
      .first()
    if (!user) {
      return reply.status(400).send({ error: 'Usuário não encontrado!' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return reply.code(400).send({ error: "Senha incorreta" });
    }

    let sessionId = user.session_id;
    if (!sessionId) {
      sessionId = crypto.randomUUID()
      reply.cookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7 // 7 days
      })

      await knex("users")
        .where({ id: user.id })
        .update({ session_id: sessionId });
    }

    return reply.status(200).send({ message: 'Login realizado com sucesso!' });
  })
}