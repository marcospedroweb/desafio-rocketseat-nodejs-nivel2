import type { FastifyInstance } from "fastify";
import { checkSessionIdExists } from "../middleware/check-session-id-exists.js";
import z from "zod";
import crypto from 'node:crypto'
import { knex } from "../database.js";
import type { Meal } from "../models/meal.model.js";

export async function mealRoutes(app: FastifyInstance) {
  app.post('/', {
    preHandler: [checkSessionIdExists]
  }, async (request, reply) => {
    const createMealBodySchema = z.object({
      name: z.string()
        .max(20, { message: "A descrição deve ter apenas 20 caracteres" }),
      description: z.string()
        .max(150, { message: "A descrição deve ter apenas 150 caracteres" }),
      datetime: z.iso.datetime(),
      withinDiet: z.boolean()
    })

    const { name, description, datetime, withinDiet } = createMealBodySchema.parse(request.body);

    await knex<Meal>('meals')
      .insert({
        id: crypto.randomUUID(),
        userId: request.userId,
        name,
        description,
        datetime,
        withinDiet
      })

    return reply.status(201).send()
  })
}