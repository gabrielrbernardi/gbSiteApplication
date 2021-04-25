import knex from 'knex';

export async function up(knex: knex){
    return knex('Usuario').insert({
        IdUsuario: 1,
        Usuario: 'administrador',
        Senha: '$2b$10$cRO5A5Crb/FSyZcN0i4EnuinyJUZbPrz5.zkv32jyPb7YEzNye8MC',
        Nome: "Administrador",
        DataCriacao: "2021-04-25",
        UltimoAcesso: null
    })
}

export async function down(knex: knex) {
    return knex('Usuario').where('Usuario', 'Administrador').del();
}