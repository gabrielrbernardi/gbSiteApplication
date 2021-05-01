import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Aula', table => { //Tabela de aulas
        table.increments('IdAula').primary();
        table.string("TituloAula").notNullable();
        table.string("DescricaoAula");
        table.enum("Status", ["A", "F"]);   //Aula aberta ou fechada
        table.integer("IdTurma").references("IdTurma").inTable("Turma").unsigned().notNullable();
        
        table.date('DataCriacao').notNullable();
        table.date("DataStatus");
    })
}

export async function down(knex: knex) {
    return knex.schema.dropTable('Aula');
}