import { Request, Response } from "express";
import knex from "../../database/connection";

class Team{
    async create(request:Request, response:Response){
        const {nome, periodo} = request.body;
        if(!nome || !periodo){
            return response.status(400).json({createdTeam: false, error: "Preecha todos os campos. Verifique e tente novamente."});
        }
        if(periodo != "M" && periodo != "T"){
            return response.status(400).json({createdTeam: false, error: "Formato de período inválido. Verifique e tente novamente."});
        }

        var dataCriacao = new Date().toISOString().split("T");
        dataCriacao[1] = dataCriacao[1].split(".")[0];
        var newData = dataCriacao[0].split("-")
        var dataCriacaoFormated = newData[2] + "/" + newData[1] + "/" + newData[0] + " " + dataCriacao[1];

        const team = {
            NomeTurma: nome,
            Periodo: periodo,
            DataCriacao: dataCriacaoFormated
        }
        await knex("Turma").insert(team).then(teamDB => {
            return response.status(200).json({createdTeam: true, teamId: teamDB[0]});
        }).catch(err => {
            console.log(err)
            return response.status(400).json({createdTeam: false, error: err});
        })
        // return response.status(200).json({createdTeam: true});
    }

    async indexPaginate(request: Request, response: Response){
        const { page } = request.params;
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try {
            const teams = await knex("Turma").select("*").offset((pageRequest - 1) * rows).limit(rows);
            const teamsLength = (await knex("Turma").select("*")).length;
            if (teams) {
                var serializedTeam = teams.map(teamDB => {
                    return {
                        IdTurma: teamDB.IdTurma,
                        Nome: teamDB.NomeTurma,
                        Periodo: teamDB.Periodo,
                        DataCriacao: teamDB.DataCriacao
                    }
                })
                return response.status(200).json({
                    showTeams: true,
                    teams: serializedTeam,
                    length: teamsLength,
                });
            } else {
                return response.status(404).json({
                    showTeams: false,
                    error: "Turmas não encontradas. Verifique a página e tente novamente.",
                });
            }
            // return response.json({ showUsers: true, users: users, length: usersLength });
        } catch (err) {
            return response.status(400).json({ showTeams: false, error: err });
        }
    }

    async update(request: Request, response: Response){
        const nome = request.body.nome || null;
        const periodo = request.body.periodo || null;
        const {id} = request.params;
        
        const idInt = parseInt(id);

        if(!nome && !periodo){
            return response.status(400).json({updatedCycle: false, error: "Não há valores para atualizar!"});
        }
        if(periodo){
            if(periodo != "M" && periodo != "T"){
                return response.status(400).json({createdTeam: false, error: "Formato de período inválido. Verifique e tente novamente."});
            }
        }
        if(nome && periodo){
            await knex("Turma").where("IdTurma", idInt).update({          //Atualiza o valor da senha no DB
                NomeTurma: nome,
                Periodo: periodo
            }).then(() => {
                return response.status(200).json({updatedUser: true})
            }).catch(err => {
                return response.status(400).json({updatedUser: false, error: err});
            })
        }else if(nome && !periodo){
            await knex("Turma").where("IdTurma", idInt).update({          //Atualiza o valor da senha no DB
                NomeTurma: nome,
            }).then(() => {
                return response.status(200).json({updatedUser: true})
            }).catch(err => {
                return response.status(400).json({updatedUser: false, error: err});
            })
        }else{
            await knex("Turma").where("IdTurma", idInt).update({          //Atualiza o valor da senha no DB
                Periodo: periodo
            }).then(() => {
                return response.status(200).json({updatedUser: true})
            }).catch(err => {
                return response.status(400).json({updatedUser: false, error: err});
            })
        }
    }

    async delete(request: Request, response: Response){
        const {id} = request.params;                            //Recebe id do usuario
        const idInt = parseInt(id);
        if(idInt < 0){
            return response.status(400).json({deletedCycle: false, error: "Id inválido. Verifique e tente novamente."});
        }
        const teamDB = await knex("Turma").where("IdTurma", idInt);
        if(!teamDB[0]){
            return response.status(404).json({deletedCycle: false, error: "Id não encontrado. Verifique e tente novamente."});
        }

        await knex("Turma").where("IdTurma", idInt).del().then(() => {
            return response.status(200).json({deletedCycle: true});
        }).catch(err => {
            return response.status(400).json({deletedCycle: false, error: err});
        })
    }
}

export default Team;