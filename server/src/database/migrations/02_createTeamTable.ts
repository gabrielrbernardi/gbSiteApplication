import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Turma', table => {
        table.increments('IdTurma').primary();
        table.string("NomeTurma").notNullable();
        table.enum("Periodo", ["M", "T"]); //Manha ou tarde
        table.integer("IdCiclo").references("IdCiclo").inTable("Ciclo").unsigned().notNullable();

        table.date('DataCriacao').notNullable();
    })
}

export async function down(knex: knex) {
    return knex.schema.dropTable('Turma');
}