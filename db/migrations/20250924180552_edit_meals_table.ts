import type { Knex } from "knex";


export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', table => {
    table.timestamp('updatedAt').nullable()
    table.renameColumn('created_at', 'createdAt')
  })
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', table => {
    table.dropColumn('updatedAt')
    table.renameColumn('createdAt', 'created_at')
  })
}

