import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// app.use(middleware);
app.use(routes);

// function middleware(request: Request, response: Response, next: NextFunction){
    // console.log("passou aqui")
    // console.log(new Date());
    // if((request.method === "POST" && request.url === "/users/login") || (request.method === "POST" && request.url === "/users")){
    //     next()
    // }else if(request.headers.token){
    //     let token: any = request.headers.token;
    //     let dataAtual = new Date();
    //     let dateToken = new Date();
    //     console.log(request.headers.token)
    //     console.log(dataAtual.getTime())
    //     if(dataAtual > token){
    //         return response.status(511).json({error: "Acesso Negado. Token de acesso expirado. Faça login novamente!"});
    //     }
    //     next()
    // }else{
    //     return response.status(511).json({error: "Acesso Negado. Não existe token de acesso."});
    // }
// }

let port = 3333;
console.log("Running on: " + port);
app.listen(process.env.PORT || port);