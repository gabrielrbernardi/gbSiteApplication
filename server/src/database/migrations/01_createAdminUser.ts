import knex from 'knex';

export async function up(knex: knex){
    return knex('Usuario').insert({
        IdUsuario: 1,
        Usuario: 'administrador',
        Senha: '$2b$10$cRO5A5Crb/FSyZcN0i4EnuinyJUZbPrz5.zkv32jyPb7YEzNye8MC',
        UltimoAcesso: null
    })
}

export async function down(knex: knex) {
    return knex('Usuario').where('Usuario', 'Administrador').del();
}