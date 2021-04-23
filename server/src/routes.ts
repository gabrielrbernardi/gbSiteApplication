import express from "express";
import UserRoutes from './routes/userRoutes';
import ClientRoutes from './routes/clientRoutes';

const app = express();

app.use(UserRoutes);
// app.use(ClientRoutes);

export default app;