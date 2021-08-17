import express from "express";
// const express = require("express");
import Middleware from "../middleware";

const routes = express.Router();
const middleware = new Middleware();

routes.post("/token", middleware.getRefreshToken);
routes.delete("/token", middleware.deleteRefreshToken);


export default routes;
