import type { FastifyInstance } from "fastify";
import { checkSessionIdExists } from "../middleware/check-session-id-exists.js";
import z from "zod";
import crypto from 'node:crypto'
import { knex } from "../database.js";
import type { Meal } from "../models/meal.model.js";

export async function mealRoutes(app: FastifyInstance) {

  app.get('/', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const meals = await knex<Meal[]>('meals')
      .where('userId', request.userId)
      .select('*')


    return reply.status(201).send({ meals })
  })

  app.get('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const getDetailsMealParamsSchema = z.object({
      id: z.string()
    })

    const { id } = getDetailsMealParamsSchema.parse(request.params)

    const meal = await knex<Meal>('meals')
      .where({
        id,
        userId: request.userId
      })
      .select('*')
      .first()

    return reply.status(201).send({ meal })
  })

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

    return reply.status(201).send({ message: "Refeição criada com sucesso" })
  })

  app.put('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const updateMealParamsSchema = z.object({
      id: z.string()
    })

    const updateMealBodySchema = z.object({
      name: z.string()
        .max(20, { message: "A descrição deve ter apenas 20 caracteres" })
        .optional(),
      description: z.string()
        .max(150, { message: "A descrição deve ter apenas 150 caracteres" })
        .optional(),
      datetime: z.iso.datetime()
        .optional(),
      withinDiet: z.boolean()
        .optional()
    })


    const { id } = updateMealParamsSchema.parse(request.params)
    const mealData = updateMealBodySchema.parse(request.body);
    const payload = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(mealData).filter(([_, v]) => v !== undefined)
    );

    if (Object.keys(payload).length === 0) {
      return reply.code(400).send({ error: "Campos inválidos para alteração" });
    }

    const updated = await knex<Meal>("meals")
      .where({ id, userId: request.userId })
      .update({ ...payload, updatedAt: knex.fn.now() });

    if (updated === 0) {
      return reply.code(404).send({ error: "Refeição não encontrada" });
    }


    return reply.status(200).send({ message: "Refeição atualizada com sucesso" });
  })

  app.delete('/:id', { preHandler: [checkSessionIdExists] }, async (request, reply) => {
    const deleteMealParamsSchema = z.object({
      id: z.string()
    })

    const { id } = deleteMealParamsSchema.parse(request.params)

    await knex<Meal>('meals')
      .where({
        id,
        userId: request.userId
      })
      .del()

    return reply.status(200).send({ message: "Refeição apagada com sucesso" })
  })
}