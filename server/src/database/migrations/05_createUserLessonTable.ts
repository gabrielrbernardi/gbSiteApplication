import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Usuario_Aula', table => {
        table.increments('IdCiclo').primary();
        table.integer("IdUsuario").references("IdUsuario").inTable("Usuario").unsigned();
        table.integer("IdAula").references("IdAula").inTable("Aula").unsigned();
        
        table.date('DataCriacao').notNullable();
    })
}

export async function down(knex: knex) {
    return knex.schema.dropTable('Usuario_Aula');
}