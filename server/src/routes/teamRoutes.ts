import express from "express";
// const express = require("express");
import Team from "../controllers/Team/Team";

const routes = express.Router();
const team = new Team();

routes.post("/team", team.create);
routes.get("/teams/paginate/:page", team.indexPaginate);
routes.put("/team/:id", team.update);
routes.delete("/team/:id", team.delete);

export default routes;
