import { Request, Response } from "express";
import knex from "../../database/connection";

class Lesson{
    async create(request: Request, response: Response){
        const {titulo} = request.body;
        const idTurma = request.params.teamId;
        const idUsuario = request.params.userId;

        const Descricao:string = request.body.descricao || null;
        if(!titulo){
            return response.status(400).json({createdLesson: false, error: "Titulo não fornecido. Tente novamente."});
        }
        if(!idTurma || !idUsuario){
            return response.status(400).json({createdLesson: false, error: "Id do usuário ou Id da turma não fornecido(s). Não foi possível criar a aula. Tente novamente."});
        }
        try{
            const idUsuarioInt = parseInt(idUsuario);
            await knex("Turma").where("IdTurma", idTurma).then(teamDB => {
                if(!teamDB[0]){
                    return response.status(400).json({createdLesson: false, error: `Não foi possível encontrar uma turma com id = ${idTurma}`});
                }else{
                    var dataCriacao = new Date().toISOString().split("T");
                    dataCriacao[1] = dataCriacao[1].split(".")[0];
                    var newData = dataCriacao[0].split("-")
                    var dataCriacaoFormated = newData[2] + "/" + newData[1] + "/" + newData[0] + " " + dataCriacao[1];
                    const lesson = {
                        TituloAula: titulo,
                        DescricaoAula: Descricao,
                        Status: "F",
                        DataCriacao: dataCriacaoFormated,
                        IdTurma: idTurma,
                        IdUsuario: idUsuarioInt
                    }
                    knex("Aula").insert(lesson).then(lessonDB => {
                        return response.status(200).json({createdLesson: true, lessons: lessonDB});
                    }).catch(err => {
                        console.log(err)
                        return response.status(400).json({createdLesson: false, error: err});
                    });
                }
            }).catch(err => {
                return response.status(400).json({createdLesson: false, error: err});
            })
        }catch(err){
            console.log(err)
            return response.status(400).json({createdLesson: false, error: err});
        }
    }
    
    async indexPaginate(request: Request, response: Response){
        const { page } = request.params;
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try {
            const lessons = await knex("Aula").select("*").offset((pageRequest - 1) * rows).limit(rows);
            const lessonsLength = (await knex("Aula").select("*")).length;
            if (lessons) {
                var serializedLessons = lessons.map(lessonDB => {
                    return {
                        IdAula: lessonDB.IdAula,
                        TituloAula: lessonDB.TituloAula,
                        DescricaoAula: lessonDB.DescricaoAula,
                        Status: lessonDB.Status,
                        DataCriacao: lessonDB.DataCriacao,
                        DataStatus: lessonDB.DataStatus,
                        IdTurma: lessonDB.IdTurma,
                        IdUsuario: lessonDB.IdUsuario
                    }
                })
                return response.status(200).json({
                    showLessons: true,
                    users: serializedLessons,
                    length: lessonsLength,
                });
            } else {
                return response.status(404).json({
                    showLessons: false,
                    error: "Aulas não encontradas. Verifique a página e tente novamente.",
                });
            }
        } catch (err) {
            return response.status(400).json({ showLessons: false, error: err });
        }
    }
    
    async showSpecificId(request: Request, response: Response){
        const idAula = request.params.idLesson;
        try{
            if(idAula){
                const lessonsDB = await knex("Aula").where('IdAula', idAula);
                const lesson = lessonsDB[0];
                if (lesson) {
                    const teamDB = await knex("Turma").where("IdTurma", lesson.IdTurma);
                    const team = teamDB[0];
                    var serializedLessons = {
                        IdAula: lesson.IdAula,
                        TituloAula: lesson.TituloAula,
                        DescricaoAula: lesson.DescricaoAula,
                        Status: lesson.Status,
                        DataCriacao: lesson.DataCriacao,
                        DataStatus: lesson.DataStatus,
                        NomeTurma: team.NomeTurma,
                        Periodo: team.Periodo,
                        DataCriacaoTurma: team.DataCriacao
                    }
                    return response.status(200).json({
                        showLesson: true,
                        lesson: serializedLessons,
                    });
                } else {
                    return response.status(404).json({
                        showLesson: false,
                        error: "Aula não encontrada. Verifique o id e tente novamente.",
                    });
                }
            }else{
                return response.status(400).json({
                    showLesson: false,
                    error: "Id não fornecido. Verifique e tente novamente.",
                });
            }
        } catch (err) {
            return response.status(400).json({ showLesson: false, error: err });
        }
    }

    async updateStatus(request:Request, response:Response){     //Atualizar status da aula: Aula fechada ou aberta para inscricao
        const {id} = request.params;                            //Recebe id do usuario
        const {status} = request.body;
        const idInt = parseInt(id);
        
        if(!status){
            return response.status(400).json({updatedLesson: false, error: "Status não fornecido."});
        }
        if(!id || !idInt){
            return response.status(400).json({updatedLesson: false, error: "Id não fornecido."});
        }
        if(status != "F" && status != "A"){
            return response.status(400).json({updatedLesson: false, error: "Formato de status inválido. Verifique e tente novamente."});
        }
        const lessonDB = await knex("Aula").where("IdAula", idInt);     //Verifica se existe usuario no DB
        const lesson = lessonDB[0];
        if(!lesson){
            return response.status(404).json({deletedLesson: false, error: "Aula não encontrada."});
        }

        var dataAtualizacao = new Date().toISOString().split("T");
        dataAtualizacao[1] = dataAtualizacao[1].split(".")[0];
        var newData = dataAtualizacao[0].split("-")
        var dataAtualizacaoFormated = newData[2] + "/" + newData[1] + "/" + newData[0] + " " + dataAtualizacao[1];

        await knex("Aula").where("IdAula", idInt).update({
            Status: status,
            DataStatus: dataAtualizacaoFormated
        }).then(() => {
            return response.status(200).json({updatedLesson: true});
        }).catch(err => {
            return response.status(400).json({updatedLesson: false, error: "Não foi possível autalizar o status da aula. Erro: " + err});
        })
    }

    async delete(request: Request, response: Response){
        const {id} = request.params;                            //Recebe id do usuario
        const idInt = parseInt(id);
        const lessonDB = await knex("Aula").where("IdAula", idInt);     //Verifica se existe usuario no DB
        const lesson = lessonDB[0];
        if(lesson){
            await knex("Aula").where("IdAula", idInt).del();
            return response.status(200).json({deletedLesson: true});
        }else{
            return response.status(404).json({deletedLesson: false, error: "Aula não encontrada."});
        }
    }
}

export default Lesson;