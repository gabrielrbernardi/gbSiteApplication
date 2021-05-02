import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';
import Middleware from './middleware';

import jwt from 'jsonwebtoken';

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

// const middleware = new Middleware();

app.use(middleware);
app.use(routes);

let port = 3333;
console.log("Running on: " + port);
app.listen(process.env.PORT || port);
setToken();

var token:any;

setInterval(function() {
    setToken();
}, 3000);

function middleware(request: Request, response: Response, next: NextFunction){
    console.log("passou aqui")
    console.log(getToken());
    const tokenHeader = request.headers.token;
    const usernameHeader = request.headers.username;
    next()
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
}

function getToken(){
    return token;
}

function setToken(){
    token = jwt.sign(
        {
            systemName: "gbSiteApplication"
        },
        'shhhhh'
    );
    console.log("Token Gerado")
}