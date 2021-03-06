import { Request, Response } from "express";
import knex from "../../database/connection";
import bcrypt from "bcrypt";

const saltRounds = 10;                                                      //Quantidade de saltos que será utilizado para o hash da senha

const secretWord = "PalavraSecreta";

class User{
    async create(request:Request, response:Response){
        const {username, password, confirmPassword, name} = request.body;         //Atribuicao valor de usuario e senha vindos do frontend
        const Email = request.body.email || null;
        const DataNascimento = request.body.dataNascimento || null;
        const TelefonePrimario = request.body.telefonePrimario || null;
        const TelefoneSecundario = request.body.telefoneSecundario || null;
        
        if(!username || !password || !confirmPassword || !name){                     //Verifica se username, password e confirmPassword sao validos
            return response.status(400).json({createdUser: false, error: "Preencha todos os campos!"});
        }
        if(password != confirmPassword){
            return response.status(400).json({createdUser: false, error: "Senhas diferentes. Tente novamente."});
        }
        
        if(password.length < 6){
            return response.status(400).json({createdUser: false, error: "Quantidade mínima de caracteres: 6. Tente novamente."});
        }
        if(Email){
            if(Email.indexOf("@") == -1 || Email.indexOf(".") == -1){
                return response.status(400).json({createdUser: false, error: "Formato de e-mail incorreto. Tente novamente."});
            }
        }

        const userDB = await knex("Usuario").where("Usuario", username);    //Verificacao se existe outro usuario com o mesmo nome
        const user = userDB[0];
        var dataCriacao = new Date().toISOString().split("T");
        dataCriacao[1] = dataCriacao[1].split(".")[0];
        var newData = dataCriacao[0].split("-");
        var dataCriacaoFormated = newData[2] + "/" + newData[1] + "/" + newData[0] + " " + dataCriacao[1];
        
        if(!user){
            await bcrypt.hash(password, saltRounds, function(err, hash) {
                const user = {
                    Usuario: username,
                    Senha: hash,
                    Nome: name,
                    TipoUsuario: "AL",
                    Email,
                    DataNascimento,
                    TelefonePrimario,
                    TelefoneSecundario,
                    DataCriacao: dataCriacaoFormated
                };
                knex("Usuario").insert(user).then(users => {
                    const userId = users[0];
                    return response.status(200).json({
                        createdUser: true,
                        id: userId,
                        // Usuario: username
                    });
                }).catch(err => {
                    return response.status(400).json({createdUser: false, error: "Erro na inserção dos valores. Verifique os dados e tente novamente. Error Type: " + err.code});
                })
            });
        }else{
            return response.status(401).json({createdUser: false, error: "Usuário existente. Tente novamente."});
        }
    }

    async index(request:Request, response:Response){
        const users = await knex("Usuario").select("*");
        return response.status(200).json({foundUsers: true, users: users});
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
                        Nome: userDB.Nome,
                        TipoUsuario: userDB.TipoUsuario,
                        Email: userDB.Email,
                        DataNascimento: userDB.DataNascimento,
                        TelefonePrimario: userDB.TelefonePrimario,
                        TelefoneSecundario: userDB.TelefoneSecundario,
                        DataCriacao: userDB.DataCriacao,
                        UltimoAcesso: userDB.UltimoAcesso,
                    }
                })
                return response.status(200).json({
                    showUsers: true,
                    users: serializedUsers,
                    length: usersLength,
                });
            } else {
                return response.status(404).json({
                    showUsers: false,
                    error: "Usuários não encontrados. Verifique a página e tente novamente.",
                });
            }
            // return response.json({ showUsers: true, users: users, length: usersLength });
        } catch (err) {
            return response.status(400).json({ showUsers: false, error: err });
        }
    }

    async showId(request: Request, response: Response){
        const { id } = request.params;
        var page = String(request.params.page);
        if (!page) {
            page = "10";
        }
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try{
            if(id){
                const userDB = await knex("Usuario").where('IdUsuario', 'like', `%${id}%`).offset((pageRequest - 1) * rows).limit(rows);
                const user = userDB[0];
                if (user) {
                    const usersLength = (await knex("Usuario").count('IdUsuario').where('IdUsuario', 'like', `%${id}%`));
                    var serializedUsers = userDB.map(userDB => {
                        return {
                            IdUsuario: userDB.IdUsuario,
                            Usuario: userDB.Usuario,
                            Nome: userDB.Nome,
                            TipoUsuario: userDB.TipoUsuario,
                            Email: userDB.Email,
                            DataNascimento: userDB.DataNascimento,
                            TelefonePrimario: userDB.TelefonePrimario,
                            TelefoneSecundario: userDB.TelefoneSecundario,
                            DataCriacao: userDB.DataCriacao,
                            UltimoAcesso: userDB.UltimoAcesso,
                        }
                    });
                    return response.status(200).json({
                        showUsers: true,
                        users: serializedUsers,
                        length: usersLength,
                        length1: userDB.length
                    });
                } else {
                    return response.status(404).json({
                        showUsers: false,
                        error: "Usuário(s) não encontrado(s). Verifique o id e tente novamente.",
                    });
                }
            }else{
                return response.status(400).json({
                    showUsers: false,
                    error: "Id não fornecido. Verifique e tente novamente.",
                });
            }
        } catch (err) {
            return response.status(400).json({ showUsers: false, error: err });
        }
    }

    async updatePassword(request:Request, response:Response){           //Update Password
        const {userId} = request.params;                            //Recebe id do usuario
        const {password, confirmPassword} = request.body;
        const userIdInt = parseInt(userId);
        if(!password || !confirmPassword){
            return response.status(400).json({updatedUserPassword: false, error: "Preencha todos os campos."});
        }
        if(password === confirmPassword){                       //Verifica se as senhas informadas são iguais
            await bcrypt.hash(password, saltRounds, function(err, hash) {   //Efetua novamente o hash da senha
                knex("Usuario").where("IdUsuario", userIdInt).update({          //Atualiza o valor da senha no DB
                    Senha: hash
                }).then(() => {
                    return response.status(200).json({updatedUserPassword: true});
                })
            });
        }else{
            return response.status(400).json({updatedUserPassword: false, error: "Senhas não correspondentes."});
        }
    }

    async updateUserType(request:Request, response:Response){           //Update Password
        const {userId} = request.params;                            //Recebe id do usuario
        const {userType} = request.body;
        const userIdInt = parseInt(userId);
        if(!userType){
            return response.status(400).json({updatedUserType: false, error: "Preencha todos os campos."});
        }
        if(userType != "A" && userType != "P" && userType != "AL"){
            return response.status(400).json({updatedUserType: false, error: "Tipo de usuário inválido. Tente novamente."});
        }
        try{
            const userDB = await knex("Usuario").where("IdUsuario", userIdInt);
            if(!userDB[0]){
                return response.status(404).json({updatedUserType: false, error: "Usuário não encontrado. Tente novamente."});
            }
            await knex("Usuario").where("IdUsuario", userIdInt).update({          //Atualiza o valor da senha no DB
                TipoUsuario: userType
            }).then(() => {
                return response.status(200).json({updatedUserType: true});
            }).catch(err => {
                return response.status(200).json({updatedUserType: false, error: "Não foi possível alterar o tipo de usuário. Tente novamente. Erro: " + err});
            });
        }catch(err){
            return response.status(200).json({updatedUserType: false, error: err});
        }
    }
    
    async delete(request:Request, response:Response){
        const {id} = request.params;                            //Recebe id do usuario
        const {requestId} = request.params;
        const idInt = parseInt(id);
        const requesterIdInt = parseInt(requestId);
        const userDB = await knex("Usuario").where("IdUsuario", idInt);     //Verifica se existe usuario no DB
        const user = userDB[0];
        if(requesterIdInt === idInt){
            return response.status(405).json({deletedUser: false, error: "Não é possível excluir o próprio usuário"});
        }
        if(user){
            await knex("Usuario").where("IdUsuario", idInt).del();
            return response.status(200).json({deletedUser: true});
        }else{
            return response.status(404).json({deletedUser: false, error: "Usuário não encontrado."});
        }
    }
}

export default User;