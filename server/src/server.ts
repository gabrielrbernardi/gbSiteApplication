require('dotenv').config({ path: "./src/environment.env" });
import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import routes from './routes';
import Middleware from './middleware';

const app: Express = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const middleware = new Middleware();

// app.use(middleware);
app.use(middleware.authenticateToken);
app.use(routes);

let port = 3333;
console.log("Running on: " + port);
app.listen(process.env.PORT || port);
// setToken();

var token:any;

// function authenticateToken(request: Request, response: Response, next: NextFunction){
//     try {
//         if((request.method === "POST" && request.url === "/users/login") || (request.method === "POST" && request.url === "/users")){
//             next()
//         }else{
//             const authHeader = request.headers['authorization'];
//             const token = authHeader && authHeader.split(' ')[1];
//             if(!token){
//                 throw "Token não fornecido!";
//             }
//             jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
//                 if(err){
//                     return response.status(403).json({ error: "Token fornecido inválido!"});
//                 }
//                 next();
//             })
//         }
//     } catch (error) {
//         return response.status(401).json({ error: "Erro na execução! " + error });
//     }
// }

// function generateAccesToken(user: string){
//     //@ts-ignore
//     return  jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s'});
// }