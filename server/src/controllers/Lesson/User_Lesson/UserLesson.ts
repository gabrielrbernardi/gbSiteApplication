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
        if(userDB.TipoUsuario == "A" || userDB.TipoUsuario == "P"){
            return response.status(400).json({registeredUser: false, error: "Administradores ou professores não podem se cadastrar na aula."});
        }
        if(lessonDB.Status === "F"){
            return response.status(400).json({registeredUser: false, error: "Aula não foi aberta. Entre em contato com o professor."});
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

    // async index(request: Request, response: Response){
    //     const userLessonDB = (await knex("Usuario_Aula").select("*"));
    //     console.log(1)
    //     return response.json({userLessonDB});
    // }

    async showUsersLesson(request: Request, response: Response){
        const {lessonId} = request.params || null;

        if(!lessonId){
            return response.status(400).json({unregisteredUser: false, error: "Id do usuário ou Id da aula não fornecido(s)."});
        }
        try{
            const lessonIdInt = parseInt(lessonId);
            const userLessonDB = (await knex("Usuario_Aula").where("IdAula", lessonIdInt));
    
            var serializedUserLesson = userLessonDB.map(lesson => {
                return {
                    IdUsuarioAula: lesson.IdUsuarioAula,
                    IdUsuario: lesson.IdUsuario,
                    IdAula: lesson.IdAula,
                    NomeUsuario: "",
                }
            })
            for(var i = 0; i < serializedUserLesson.length; i++){
                const userDB = (await knex("Usuario").where("IdUsuario", serializedUserLesson[i].IdUsuario));
                serializedUserLesson[i].NomeUsuario = userDB[0].Nome;
            }
            const lessonDateDB = (await knex("Aula").where("IdAula", lessonIdInt).select("DataCriacao"))[0];
            return response.status(200).json({
                showUserLesson: true,
                userLesson: serializedUserLesson,
                DataAula: lessonDateDB.DataCriacao,
                QuantidadeUsuarios: userLessonDB.length
            })
        }catch(err){
            return response.status(400).json({showUserLesson: false, error: err});
        }
    }

    async unregister(request: Request, response: Response){
        const {userId} = request.params || null;
        const {lessonId} = request.params || null;

        if(!userId || !lessonId){
            return response.status(400).json({unregisteredUser: false, error: "Id do usuário ou Id da aula não fornecido(s)."});
        }
        const lessonIdInt = parseInt(lessonId);
        const userIdInt = parseInt(userId);
        
        const lessonDB = (await knex("Aula").where("IdAula", lessonIdInt))[0];
        const userDB = (await knex("Usuario").where("IdUsuario", userIdInt))[0];
        
        if(!lessonDB){
            return response.status(404).json({unregisteredUser: false, error: "Aula não encontrada. Tente novamente."});
        }
        if(!userDB){
            return response.status(404).json({unregisteredUser: false, error: "Usuário não encontrado. Tente novamente."});
        }
        const userLessonDB = (await knex("Usuario_Aula").where({IdUsuario: userIdInt, IdAula: lessonIdInt}))[0];
        if(!userLessonDB){
            return response.status(400).json({registeredUser: false, error: "Aluno não cadastrado na aula. Tente novamente."});
        }
        await knex("Usuario_Aula").where({IdUsuario: userIdInt, IdAula: lessonIdInt}).del().then(() => {
            return response.status(200).json({unregisteredUser: true});
        }).catch(err => {
            return response.status(400).json({unregisteredUser: false, error: "Não foi possível cancelar o cadastro do aluno na aula. Tente novamente. Erro: " + err});
        })
    }
}

export default UserLesson;