import { beforeAll, afterAll, describe, it, expect, beforeEach } from 'vitest';
import request from 'supertest'
import { app } from '../src/app.js'
import { execSync } from 'node:child_process';

const MESSAGES = {
  MEAL_CREATED: 'Refeição criada com sucesso',
  MEAL_DELETED: 'Refeição apagada com sucesso',
  MEAL_UPDATED: 'Refeição atualizada com sucesso',
  USER_CREATED: 'Usuário criado com sucesso',
  USER_LOGGED: 'Login realizado com sucesso!',
  USER_UPDATED: 'Usuário atualizado com sucesso',
}

async function createAndLoginUser() {
  const email = `user${Date.now()}@teste.com`
  const password = '12345678'

  await request(app.server).post('/users').send({ email, password })

  const loginResponse = await request(app.server)
    .post('/users/login')
    .send({ email, password })

  const cookies = loginResponse.get('Set-Cookie')
  if (!cookies) throw new Error('Cookie não foi retornado!')

  return cookies
}

const createMeal = async (cookies: string[]) => {
  const response = await request(app.server)
    .post('/meals')
    .set('Cookie', cookies)
    .send({
      "name": "Refeição 1",
      "description": "Descrição da refeição 1",
      "datetime": "2025-09-24T08:00:00.000Z",
      "withinDiet": true
    })
    .expect(201, { message: MESSAGES.MEAL_CREATED })

  return response
}

beforeAll(async () => {
  await app.ready()
})

afterAll(async () => {
  await app.close()
})

beforeEach(() => {
  execSync('npm run knex migrate:rollback --all')
  execSync('npm run knex migrate:latest')
})

describe('Users routes', () => {

  it('should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        email: "fulano@fulano.com",
        password: "12345678"
      })
      .expect(201, { message: MESSAGES.USER_CREATED })
  })

  it('should be able to login a user', async () => {
    const email = `user${Date.now()}@teste.com`
    const password = '12345678'

    await request(app.server).post('/users').send({ email, password })

    await request(app.server)
      .post('/users/login')
      .send({ email, password })
      .expect(200, { message: MESSAGES.USER_LOGGED })
  })

  it('should be able to get user metrics of meals', async () => {
    const cookies = await createAndLoginUser()

    await createMeal(cookies)
    await request(app.server)
      .post('/meals')
      .set('Cookie', cookies)
      .send({
        "name": "Refeição 2",
        "description": "Descrição da refeição 2",
        "datetime": "2025-09-23T16:00:00.000Z",
        "withinDiet": false
      })

    const listUserMetricsResponse = await request(app.server)
      .get('/users/metrics')
      .set('Cookie', cookies)
      .expect(200)

    expect(listUserMetricsResponse.body).toEqual(
      {
        totalMeals: 2,
        withinDietMeals: 1,
        outsideDietMeals: 1,
        bestSequence: 1
      }
    )
  })
})

describe('Meals routes', () => {

  it('should be able to list all meals', async () => {
    const cookies = await createAndLoginUser()

    await createMeal(cookies)

    const listMealResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealResponse.body.meals).toEqual(
      [expect.objectContaining({
        "name": "Refeição 1",
        "description": "Descrição da refeição 1",
        "datetime": "2025-09-24T08:00:00.000Z",
        "withinDiet": 1
      })]
    )

  })

  it('should be able to list a meal by id', async () => {
    const cookies = await createAndLoginUser()

    await createMeal(cookies)

    const listMealResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealResponse.body.meals[0].id

    const listMealByIdResponse = await request(app.server)
      .get(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200)

    expect(listMealByIdResponse.body.meal).toEqual(
      expect.objectContaining({
        "name": "Refeição 1",
        "description": "Descrição da refeição 1",
        "datetime": "2025-09-24T08:00:00.000Z",
        "withinDiet": 1
      })
    )

  })

  it('should be able to create a meal', async () => {
    const cookies = await createAndLoginUser()

    await createMeal(cookies)
  })

  it('should be able to update a meal', async () => {
    const cookies = await createAndLoginUser()

    await createMeal(cookies)

    const listMealResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealResponse.body.meals[0].id

    await request(app.server)
      .put(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .send({
        "name": "Refeição 2",
        "description": "Descrição da refeição 2",
        "datetime": "2025-09-23T08:00:00.000Z",
        "withinDiet": false
      })
      .expect(200, { message: MESSAGES.MEAL_UPDATED })
  })

  it('should be able to delete a meal', async () => {
    const cookies = await createAndLoginUser()

    await createMeal(cookies)

    const listMealResponse = await request(app.server)
      .get('/meals')
      .set('Cookie', cookies)
      .expect(200)

    const mealId = listMealResponse.body.meals[0].id

    await request(app.server)
      .delete(`/meals/${mealId}`)
      .set('Cookie', cookies)
      .expect(200, { message: MESSAGES.MEAL_DELETED })
  })
})