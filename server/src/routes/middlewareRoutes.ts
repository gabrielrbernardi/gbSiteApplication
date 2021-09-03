import express from "express";
// const express = require("express");
import Middleware from "../middleware";

const routes = express.Router();
const middleware = new Middleware();

routes.post("/token", middleware.getRefreshToken);
routes.post("/logout", middleware.deleteRefreshToken);


export default routes;
