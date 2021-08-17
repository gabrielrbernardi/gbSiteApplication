import { Request, Response } from "express";
import knex from "../../database/connection";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import Middleware from "../../middleware";

class UserSession {
    async login(request: Request, response: Response){
        try{
            const {username, password} = request.body;
            
            if(!username || !password){
                return response.status(400).json({ userLogin: false, error: "Usuário ou senha nao fornecido(s)!" })
            }

            const userDB = await knex("Usuario").where("Usuario", username);
            const user = userDB[0];
            if(user){
                await bcrypt.compare(password, user.Senha, async function(err, result) {                
                    if(err){
                        return response.status(400).json({ userLogin: false, error: err });
                    }else if(!result){
                        return response.status(400).json({ userLogin: false, error: "Senha incorreta." });
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
                        
                        const accessToken = Middleware.generateAccessToken(userData.Usuario)
                        //@ts-ignore
                        const refreshToken = jwt.sign({ user: userData.Usuario}, process.env.REFRESH_TOKEN_SECRET)

                        await knex('Token').insert({token: refreshToken}).catch(err => {
                            return response.status(400).json({ userLogin: false, error: "Erro na inserção do token no DB!" + err})
                        })
           
                        await knex("Usuario").where("Usuario", username).update({
                            // UltimoAcesso: dataAtual
                            UltimoAcesso
                        }).then(() => {
                            return response.status(200).json({ userLogin: true, userData, accessToken: accessToken, refreshToken: refreshToken });
                        }).catch(err => {
                            return response.status(400).json({ userLogin: false, error: err});
                        })
                    }
                })
            }else{
                return response.status(404).json({ userLogin: false, error: "Usuário não encontrado." });
            }
        }catch(error){
            console.log(error)
            return response.status(404).json({error: error});
        }
    }
}

export default UserSession;