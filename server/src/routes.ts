import express from "express";
import UserRoutes from './routes/userRoutes';
import TeamRoutes from './routes/teamRoutes';
import CycleRoutes from './routes/cycleRoutes';
import LessonRoutes from './routes/lessonRoutes';
import MiddlewareRoutes from './routes/middlewareRoutes';

const app = express();

app.use(UserRoutes);
app.use(TeamRoutes);
app.use(CycleRoutes);
app.use(LessonRoutes);
app.use(MiddlewareRoutes);

export default app;