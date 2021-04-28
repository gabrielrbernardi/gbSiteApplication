import { Request, Response } from "express";
import knex from "../../database/connection";

class Team{
    async create(request:Request, response:Response){
        const {nome, periodo, ciclo} = request.body;
        if(!nome || !periodo || !ciclo){
            return response.status(400).json({createdTeam: false, error: "Preecha todos os campos. Verifique e tente novamente."});
        }
        if(periodo != "M" || periodo != "T"){
            return response.status(400).json({createdTeam: false, error: "Formato de período inválido. Verifique e tente novamente."});
        }
        return response.status(200).json({createdTeam: true});
    }   
}

export default Team;