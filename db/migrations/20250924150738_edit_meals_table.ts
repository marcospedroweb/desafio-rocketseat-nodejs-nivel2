import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.renameColumn('within_diet', 'withinDiet');
    table.renameColumn('user_id', 'userId');
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable('meals', (table) => {
    table.renameColumn('withinDiet', 'within_diet');
    table.renameColumn('userId', 'user_id');
  });
}
