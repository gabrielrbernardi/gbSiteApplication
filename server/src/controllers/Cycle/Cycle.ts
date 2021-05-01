import { Request, Response } from "express";
import knex from "../../database/connection";
const anoMinimo:number = 2021;
const anoMaximo:number = 2023;

class Cycle{
    async create(request:Request, response:Response){
        const {ciclo, ano} = request.body;
        if(!ciclo || !ano){
            return response.status(400).json({createdCycle: false, error: "Preencha todos os campos e tente novamente. Verifique e tente novamente."});
        }
        try{
            var dataCriacao = new Date().toISOString().split("T");
            dataCriacao[1] = dataCriacao[1].split(".")[0];
            var newData = dataCriacao[0].split("-")
            var dataCriacaoFormated = newData[2] + "/" + newData[1] + "/" + newData[0] + " " + dataCriacao[1];
            
            var cicloFormated = parseInt(ciclo);
            if(ano > anoMaximo || ano < anoMinimo){
                return response.status(400).json({createdCycle: false, error: "Ano inválido. Ano deve estar entre ${anoMinimo} e ${anoMaximo}. Tente novamente."});
            }

            const cicloObject = {
                Ciclo: cicloFormated,
                Ano: ano,
                DataCriacao: dataCriacaoFormated
            };
            await knex("Ciclo").insert(cicloObject).then(cycle => {
                const cycleId = cycle[0];
                return response.status(200).json({
                    createdCycle: true,
                    id: cycleId,
                })
            }).catch(err => {
                console.log(err)
                return response.status(400).json({createdCycle: false, error: "Erro na inserção dos valores. Verifique os dados e tente novamente." + " Error Type: " + err.code});
            })
        }catch(err){
            return response.status(400).json({createdCycle: false, error: err});
        }
    }

    async index(request: Request, response: Response){
        const cycles = await knex("Ciclo").select("*");
        return response.status(200).json({showCycles: true, cycles});
    }

    async indexPaginate(request:Request, response:Response){
        const { page } = request.params;
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try {
            const cycles = await knex("Ciclo").select("*").offset((pageRequest - 1) * rows).limit(rows);
            const cyclesLength = (await knex("Ciclo").select("*")).length;
            if (cycles) {
                var serializedCycles = cycles.map(cycleDB => {
                    // knex("Turma").where("IdCiclo", cycleDB.IdCiclo).count("IdCiclo").then(teamsLength => {
                    // });
                    return {
                        IdCiclo: cycleDB.IdCiclo,
                        Ciclo: cycleDB.Ciclo + "º Ciclo",
                        Ano: cycleDB.Ano,
                        DataCriacao: cycleDB.DataCriacao,
                        QuantidadeTurmas: 0
                    }
                })
                for(var i = 0; i < serializedCycles.length; i++){
                    const teamsLength = (await knex("Turma").count("IdCiclo").where("IdCiclo", serializedCycles[i].IdCiclo));
                    serializedCycles[i].QuantidadeTurmas = Number(teamsLength[0]['count(`IdCiclo`)'])
                }
                return response.status(200).json({
                    showCycle: true,
                    cycles: serializedCycles,
                    length: cyclesLength,
                });
            } else {
                return response.status(404).json({
                    showCycle: false,
                    error: "Ciclos não encontrados. Verifique a página e tente novamente.",
                });
            }
        } catch (err) {
            return response.status(400).json({ showCycle: false, error: err });
        }
    }

    async update(request: Request, response: Response){
        const ano = request.body.ano || null;
        const ciclo = request.body.ciclo || null;
        const {id} = request.params;
        
        const idInt = parseInt(id);
        if(!ano && !ciclo){
            return response.status(400).json({updatedCycle: false, error: "Não há valores para atualizar!"});
        }
        var anoParsed = parseInt(ano);
        var cicloParsed = parseInt(ciclo);
        
        
        if(anoParsed > anoMaximo || anoParsed < anoMinimo){
            return response.status(400).json({updatedCycle: false, error: `Ano inválido. Ano deve estar entre ${anoMinimo} e ${anoMaximo}. Tente novamente.`});
        }
        if(cicloParsed < 1){
            return response.status(400).json({updatedCycle: false, error: "Ciclo inválido. Tente novamente."})
        }
        
        if(cicloParsed && anoParsed){
            await knex("Ciclo").where("IdCiclo", idInt).update({          //Atualiza o valor da senha no DB
                Ciclo: cicloParsed,
                Ano: anoParsed
            }).then(() => {
                return response.status(200).json({updatedUser: true})
            }).catch(err => {
                return response.status(400).json({updatedUser: false, error: err});
            })
        }else if(cicloParsed && !anoParsed){
            await knex("Ciclo").where("IdCiclo", idInt).update({          //Atualiza o valor da senha no DB
                Ciclo: cicloParsed,
            }).then(() => {
                return response.status(200).json({updatedUser: true})
            }).catch(err => {
                return response.status(400).json({updatedUser: false, error: err});
            })
        }else{
            await knex("Ciclo").where("IdCiclo", idInt).update({          //Atualiza o valor da senha no DB
                Ano: anoParsed,
            }).then(() => {
                return response.status(200).json({updatedUser: true})
            }).catch(err => {
                return response.status(400).json({updatedUser: false, error: err});
            })        
        }
    }
    async delete(request:Request, response:Response){
        const {id} = request.params;                            //Recebe id do usuario
        const idInt = parseInt(id);
        if(idInt < 0){
            return response.status(400).json({deletedCycle: false, error: "Id inválido. Verifique e tente novamente."});
        }
        const cycleDB = await knex("Ciclo").where("IdCiclo", idInt);
        if(!cycleDB[0]){
            return response.status(404).json({deletedCycle: false, error: "Id não encontrado. Verifique e tente novamente."});
        }

        await knex("Ciclo").where("IdCiclo", idInt).del().then(cycle => {
            return response.status(200).json({deletedCycle: true});
        }).catch(err => {
            return response.status(400).json({deletedCycle: false, error: err});
        })
    }
}

export default Cycle;