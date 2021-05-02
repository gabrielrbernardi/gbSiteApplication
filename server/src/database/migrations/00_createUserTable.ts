import knex from 'knex';

export async function up(knex: knex){
    return knex.schema.createTable('Usuario', table => {
        table.increments('IdUsuario').primary();
        table.string('Usuario').notNullable();
        table.string('Senha').notNullable();
        table.string('Nome').notNullable();
        table.enum('TipoUsuario', ["A", "P", "AL"]).notNullable(); //Administrador, Professor, ALuno
        table.string('Email');
        table.string('DataNascimento');
        table.string('TelefonePrimario');
        table.string('TelefoneSecondario');
        table.dateTime('UltimoAcesso', {precision: 6}).nullable;
        table.date('DataCriacao').notNullable();
    })
}

export async function down(knex: knex) {
    return knex.schema.dropTable('Usuario');
}