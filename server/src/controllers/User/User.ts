import { Request, Response } from "express";
import knex from "../../database/connection";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const saltRounds = 10;                                                      //Quantidade de saltos que será utilizado para o hash da senha

const secretWord = "PalavraSecreta";

class User{
    async create(request:Request, response:Response){
        const {username, password, confirmPassword} = request.body;         //Atribuicao valor de usuario e senha vindos do frontend
        
        if(!username || !password || !confirmPassword){                     //Verifica se username, password e confirmPassword sao validos
            return response.status(401).json({createdUser: false, error: "Preencha todos os campos!"});
        }
        if(password != confirmPassword){
            return response.status(401).json({createdUser: false, error: "Senhas diferentes. Tente novamente."});
        }
        
        if(password.length < 6){
            return response.status(401).json({createdUser: false, error: "Quantidade mínima de caracteres: 6. Tente novamente."});
        }

        const userDB = await knex("Usuario").where("Usuario", username);    //Verificacao se existe outro usuario com o mesmo nome
        const user = userDB[0];
        if(!user){
            await bcrypt.hash(password, saltRounds, function(err, hash) {
                const user = {
                    Usuario: username,
                    Senha: hash,
                };
                knex("Usuario").insert(user).then(users => {
                    const userId = users[0];
                    return response.status(200).json({
                        createdUser: true,
                        id: userId,
                        Usuario: username
                    })
                })
            });
        }else{
            return response.status(401).json({createdUser: false, error: "Usuário existente. Tente novamente."})
        }
    }

    async index(request:Request, response:Response){
        const users = await knex("Usuario").select("*");
        var serializedUsers = users.map(userDB => {
            return {
                IdUsuario: userDB.IdUsuario,
                Usuario: userDB.Usuario,
                UltimoAcesso: userDB.UltimoAcesso,
                // Senha: userDB.Senha
            }
        })
        return response.json({foundUsers: true, users: serializedUsers});
    }

    async indexPaginate(request: Request, response: Response){
        const { page } = request.params;
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try {
            const users = await knex("Usuario").select("*").offset((pageRequest - 1) * rows).limit(rows);
            const usersLength = (await knex("Usuario").select("*")).length;
            if (users) {
                var serializedUsers = users.map(userDB => {
                    return {
                        IdUsuario: userDB.IdUsuario,
                        Usuario: userDB.Usuario,
                        UltimoAcesso: userDB.UltimoAcesso,
                    }
                })
                return response.json({
                    showUsers: true,
                    users: serializedUsers,
                    length: usersLength,
                });
            } else {
                return response.json({
                    userFound: false,
                    error: "Usuários não encontrados. Verifique o id e tente novamente.",
                });
            }
            // return response.json({ showUsers: true, users: users, length: usersLength });
        } catch (err) {
            return response.json({ showUsers: false, error: err });
        }
    }

    async update(request:Request, response:Response){
        const {id} = request.params;                            //Recebe id do usuario
        const {password, confirmPassword} = request.body;
        const idInt = parseInt(id);
        if(password === confirmPassword){                       //Verifica se as senhas informadas são iguais
            await bcrypt.hash(password, saltRounds, function(err, hash) {   //Efetua novamente o hash da senha
                knex("Usuario").where("IdUsuario", idInt).update({          //Atualiza o valor da senha no DB
                    Senha: hash
                }).then(() => {
                    return response.json({updatedUser: true, hash})
                })
            });
        }else{
            return response.json({updatedUser: false, error: "Senhas não correspondentes."})
        }

    }
    async delete(request:Request, response:Response){
        const {id} = request.params;                            //Recebe id do usuario
        const {requestId} = request.params;
        const idInt = parseInt(id);
        const requestIdInt = parseInt(requestId);
        const userDB = await knex("Usuario").where("IdUsuario", idInt);     //Verifica se existe usuario no DB
        const user = userDB[0];
        if(requestIdInt === idInt){
            return response.status(405).json({deletedUser: false, error: "Não é possível excluir o próprio usuário"});
        }
        if(user){
            await knex("Usuario").where("IdUsuario", idInt).del();
            return response.json({deletedUser: true});
        }else{
        return response.json({deletedUser: false, error: "Usuário não encontrado."});
        }
    }
}

export default User;