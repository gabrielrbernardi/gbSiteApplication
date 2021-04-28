import express from "express";
// const express = require("express");
import Cycle from "../controllers/Cycle/Cycle";

const routes = express.Router();
const cycle = new Cycle();

routes.post("/cycle", cycle.create);
routes.get("/cycle/paginate/:page", cycle.indexPaginate);
// routes.post("/clients", client.create);
// routes.get("/clients", client.index);
// routes.get("/clients/:id", client.showClient);
// routes.get("/clients/paginate/:page", client.indexPaginate);
// routes.put("/clients/:id", client.update);
// routes.put("/clients/validity/:id", client.updateValidity);
// routes.delete("/clients/:id", client.delete);

export default routes;
