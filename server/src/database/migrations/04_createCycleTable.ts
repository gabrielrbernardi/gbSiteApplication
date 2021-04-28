import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Ciclo', table => {
        table.increments('IdCiclo').primary();
        table.string("Ciclo").notNullable();
        table.string("Ano").notNullable();
        
        table.date('DataCriacao').notNullable();
    })
}

export async function down(knex: knex) {
    return knex.schema.dropTable('Ciclo');
}