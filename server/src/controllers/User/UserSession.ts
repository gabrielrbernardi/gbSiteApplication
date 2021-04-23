import { Request, Response } from "express";
import knex from "../../database/connection";
import bcrypt from "bcrypt";

class UserSession {
    async login(request: Request, response: Response){
        const {username, password} = request.body;

        const userDB = await knex("Usuario").where("Usuario", username);
        const user = userDB[0];
        if(user){
            bcrypt.compare(password, user.Senha, function(err, result) {                
                if(err){
                    return response.status(401).json({ userLogin: false, error: err });
                }else if(!result){
                    return response.status(401).json({ userLogin: false, error: "Senha incorreta." });
                }else{                    
                    let dataFormat = (new Date()).toISOString().split("T");
                    let dataAtualVector = dataFormat[0].split("-");
                    let horarioAtualVector = dataFormat[1].split(":");
                    let dataAtual = dataAtualVector[2] + "/" + dataAtualVector[1] + "/" + dataAtualVector[0];
                    let horarioAtual = horarioAtualVector[0] + ":" + horarioAtualVector[1] + ":" + (horarioAtualVector[2].split(".")[0]);
                    let UltimoAcesso = dataAtual + " " + horarioAtual;
                    
                    const userData = {
                        IdUsuario: userDB[0].IdUsuario,
                        Usuario: userDB[0].Usuario
                    }
                    //Generate Access Token
                    var date = new Date();
                    var accessToken = date.setHours(date.getHours() + 1);                   
                    // var accessToken = date.setSeconds(date.getSeconds() + 10);                   
                    knex("Usuario").where("Usuario", username).update({
                        // UltimoAcesso: dataAtual
                        UltimoAcesso
                    }).then(() => {
                        return response.status(200).json({ userLogin: true, userData, accessToken });
                    }).catch(err => {
                        return response.status(401).json({ userLogin: false, error: err});
                    })
                }
            })
        }else{
            return response.status(401).json({ userLogin: false, error: "Usuário não encontrado." });
        }
    }
}

export default UserSession;