import express, { Express, Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import knex from "./database/connection";

class Middleware{
    authenticateToken(request: Request, response: Response, next: NextFunction){
        try {
            if((request.method === "POST" && request.url === "/users/login") || (request.method === "POST" && request.url === "/users") || ((request.method === "POST" || request.method === "DELETE") && request.url === "/token")){
                next()
            }else{
                const authHeader = request.headers['authorization'];
                const token = authHeader && authHeader.split(' ')[1];
                if(!token){
                    throw "Token não fornecido!";
                }
                jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
                    if(err){
                        return response.status(403).json({ error: "Token fornecido inválido!"});
                    }
                    next();
                })
            }
        } catch (error) {
            return response.status(401).json({ error: "Erro na execução! " + error });
        }
    }
    
    static generateAccessToken(user: any){
        // @ts-ignore
        return jwt.sign({user: user}, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15s' });
    }

    async getRefreshToken(request: Request, response: Response){
        try {
            const {refreshToken} = request.body;
            if(refreshToken == null) { return response.status(401).json({error: "Refresh token não fornecido!"}) }
            const tokenDB = await knex('Token').where({token: refreshToken})
            if(!tokenDB[0]){
                return response.status(401).json({error: "Refresh token não encontrado no DB!"})
            }

            //@ts-ignore
            jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err: any, user: any) => {
                if(err){
                    return response.status(403).json({ error: "Token fornecido inválido!"});
                }
                const accessToken = Middleware.generateAccessToken(user);
                return response.status(200).json({ accessToken: accessToken });
            })
        } catch (error) {
            return response.status(401).json({ error: "Erro na execução! " + error });
        }
    }

    async deleteRefreshToken(request: Request, response: Response){
        try{
            const {refreshToken} = request.body;
            await knex('Token').where({token: refreshToken}).delete().catch(err => {
                return response.status(401).json({ logout: false, error: "Erro na exclusão do refreshToken " + err });
            });
            return response.status(204).json({logout: true});
        }catch(error){
            return response.status(401).json({ error: "Erro na execução! " + error });
        }
    }
}

export default Middleware;