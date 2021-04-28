import express from "express";
// const express = require("express");
import Team from "../controllers/Team/Team";

const routes = express.Router();
const team = new Team();

// routes.post("/team/cycle", team.createCycle);
// routes.post("/clients", client.create);
// routes.get("/clients", client.index);
// routes.get("/clients/:id", client.showClient);
// routes.get("/clients/paginate/:page", client.indexPaginate);
// routes.put("/clients/:id", client.update);
// routes.put("/clients/validity/:id", client.updateValidity);
// routes.delete("/clients/:id", client.delete);

export default routes;
