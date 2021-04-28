import { Request, Response } from "express";
import knex from "../../database/connection";

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

            if(ano > 2023 || ano < 2021){
                return response.status(400).json({createdCycle: false, error: "Ano inválido. Verifique e tente novamente."});
            }

            const cicloObject = {
                Ciclo: ciclo,
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

    async indexPaginate(request:Request, response:Response){
        const { page } = request.params;
        var pageRequest = parseInt(page) / 10;
        const rows = 10;
        try {
            const cycles = await knex("Ciclo").select("*").offset((pageRequest - 1) * rows).limit(rows);
            const cyclesLength = (await knex("Ciclo").select("*")).length;
            if (cycles) {
                var serializedCycles = cycles.map(cycleDB => {
                    return {
                        IdCiclo: cycleDB.IdCiclo,
                        Ciclo: cycleDB.Ciclo,
                        Ano: cycleDB.Ano,
                        DataCriacao: cycleDB.DataCriacao,
                    }
                })
                return response.status(200).json({
                    showCycle: true,
                    users: serializedCycles,
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

}

export default Cycle;