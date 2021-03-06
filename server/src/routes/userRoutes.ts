import express from "express";
// const express = require("express");
import User from "../controllers/User/User";
import UserSession from '../controllers/User/UserSession';

const routes = express.Router();
const user = new User();
const userSession = new UserSession();

routes.post("/users", user.create);
routes.get("/users", user.index);
routes.get("/users/paginate/:page", user.indexPaginate);
routes.get("/users/:id/:page", user.showId);
routes.put("/users/password/:userId", user.updatePassword);
routes.put("/users/type/:userId", user.updateUserType);
routes.delete("/users/:id/:requestId", user.delete);

routes.post('/users/login', userSession.login);

export default routes;
