import express from "express";
// const express = require("express");
import Cycle from "../controllers/Cycle/Cycle";

const routes = express.Router();
const cycle = new Cycle();

routes.post("/cycle", cycle.create);
routes.get("/cycles/paginate/:page", cycle.indexPaginate);
routes.get("/cycles", cycle.index);
routes.put("/cycle/:id", cycle.update);
routes.delete("/cycle/:id", cycle.delete);

export default routes;
