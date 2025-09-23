import type { Knex as KnexType } from 'knex'


export async function up(knex: KnexType): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').primary()
    table.string('email').notNullable()
    table.string('password').notNullable()
    table.uuid('session_id').after('id').index()
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable()
  })
}


export async function down(knex: KnexType): Promise<void> {
  await knex.schema.dropTable('users')
}

