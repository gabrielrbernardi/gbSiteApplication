import express from "express";
import UserRoutes from './routes/userRoutes';
import TeamRoutes from './routes/teamRoutes';
import CycleRoutes from './routes/cycleRoutes';

const app = express();

app.use(UserRoutes);
app.use(TeamRoutes);
app.use(CycleRoutes);

export default app;