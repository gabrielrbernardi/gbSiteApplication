import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Token', table => {
        table.increments('IdToken').primary();
        table.string('token');
    })
}

export async function down(knex: knex) {
    return knex.schema.dropTable('Token');
}