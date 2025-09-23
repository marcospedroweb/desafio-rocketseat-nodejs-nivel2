import Knex from 'knex'
import type { Knex as KnexType } from 'knex'
import { env } from './env/index.js'

export const config: KnexType.Config = {
  client: 'sqlite',
  connection: {
    filename: env?.DATABASE_URL ?? ''
  },
  useNullAsDefault: true,
  migrations: {
    extension: 'ts',
    directory: './db/migrations'
  }
}
export const knex = Knex(config);