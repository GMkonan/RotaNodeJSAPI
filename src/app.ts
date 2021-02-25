import 'reflect-metadata'; //necessario vir primeiro
import express from 'express';
import createConnection from "./database"; //se vc n especificar, por padrao ele importa o arquivo index da pasta (no caso index.ts)
import { router } from './routes';

createConnection();
const app = express();

app.use(express.json());
app.use(router);

export { app };