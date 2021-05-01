import { Request, Response } from "express";
import knex from "../../../database/connection";

class UserLesson{
    async register(request: Request, response: Response){
        const {userId} = request.params || null;
        const {lessonId} = request.params || null;

        if(!userId || !lessonId){
            return response.status(400).json({registeredUser: false, error: "Id do usuário ou Id da aula não fornecido(s)."});
        }
        const lessonIdInt = parseInt(lessonId);
        const userIdInt = parseInt(userId);
        
        const lessonDB = (await knex("Aula").where("IdAula", lessonIdInt))[0];
        const userDB = (await knex("Usuario").where("IdUsuario", userIdInt))[0];
        
        if(!lessonDB){
            return response.status(404).json({registeredUser: false, error: "Aula não encontrada. Tente novamente."});
        }
        if(!userDB){
            return response.status(404).json({registeredUser: false, error: "Usuário não encontrado. Tente novamente."});
        }

        const userLessonDB = await knex("Usuario_Aula").where({IdUsuario: userIdInt, IdAula: lessonIdInt});
        if(userLessonDB[0]){
            return response.status(400).json({registeredUser: false, error: "Usuário já está cadastrado na aula. Tente novamente."});
        }

        var dataCriacao = new Date().toISOString().split("T");
        dataCriacao[1] = dataCriacao[1].split(".")[0];
        var newData = dataCriacao[0].split("-")
        var dataCriacaoFormated = newData[2] + "/" + newData[1] + "/" + newData[0] + " " + dataCriacao[1];

        await knex("Usuario_Aula").insert({IdUsuario: userIdInt, IdAula: lessonIdInt, DataCriacao: dataCriacaoFormated}).then(() => {
            return response.status(200).json({registeredUser: true});
        }).catch(err => {
            return response.status(400).json({registeredUser: false, error: "Não foi possível cadastrar o aluno na aula. Tente novamente. Erro: " + err});
        })
    }
}

export default UserLesson;