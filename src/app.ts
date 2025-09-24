import { usersRoutes } from "./routes/users.js";
import cookie from '@fastify/cookie'
import { mealRoutes } from "./routes/meal.js";
import fastify from "fastify";


export const app = fastify()

app.register(cookie)


app.register(usersRoutes, {
  prefix: 'users'
})
app.register(mealRoutes, {
  prefix: 'meals'
})