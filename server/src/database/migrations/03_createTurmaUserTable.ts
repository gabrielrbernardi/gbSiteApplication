import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Turma_Usuario', table => {
        table.increments('IdAula').primary();
        table.integer("IdUsuario").references("IdUsuario").inTable("Usuario").unsigned();
        table.integer("IdTurma").references("IdTurma").inTable("Turma").unsigned();
        
        table.date('DataCriacao').notNullable();
    })
}

export async function down(knex: knex) {
    return knex.schema.dropTable('Turma');
}