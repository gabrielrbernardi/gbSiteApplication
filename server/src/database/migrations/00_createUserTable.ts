import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Usuario', table => {
        table.increments('IdUsuario').primary();
        table.string('Usuario');
        table.string('Senha');
        table.dateTime('UltimoAcesso', {precision: 6}).nullable;
        table.dateTime('created_at').notNullable().defaultTo(knex.raw('CURRENT_TIMESTAMP'));
    })
}

export async function down(knex: knex) {
    return knex.schema.dropTable('Usuario');
}