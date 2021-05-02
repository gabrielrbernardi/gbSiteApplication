import express from "express";
// const express = require("express");
import Lesson from "../controllers/Lesson/Lesson";
import UserLesson from "../controllers/Lesson/User_Lesson/UserLesson";

const routes = express.Router();
const lesson = new Lesson();
const userLesson = new UserLesson();

routes.post("/lesson/:userId/:teamId", lesson.create);
routes.get("/lessons/paginate/:page", lesson.indexPaginate);
routes.get("/lesson/:idLesson", lesson.showSpecificId);
routes.put("/lesson/:id", lesson.updateStatus);
routes.delete("/lesson/:id", lesson.delete);

// routes.get("/lesson/userLesson/specific", userLesson.index);
routes.post("/lesson/userLesson/register/:userId/:lessonId", userLesson.register);
routes.post("/lesson/userLesson/unregister/:userId/:lessonId", userLesson.unregister);
routes.get("/lesson/userLesson/showLesson/:lessonId", userLesson.showUsersLesson);

export default routes;
