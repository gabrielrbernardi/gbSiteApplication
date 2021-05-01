import express from "express";
// const express = require("express");
import Lesson from "../controllers/Lesson/Lesson";
import UserLesson from "../controllers/Lesson/User_Lesson/UserLesson";

const routes = express.Router();
const lesson = new Lesson();
const userLesson = new UserLesson();

routes.post("/lesson/:idTeam", lesson.create);
routes.get("/lessons/paginate/:page", lesson.indexPaginate);
routes.get("/lesson/:idLesson", lesson.showSpecificId);
routes.put("/lesson/:id", lesson.updateStatus);
routes.delete("/lesson/:id", lesson.delete);

routes.post("/lesson/register/:userId/:lessonId", userLesson.register);

export default routes;
