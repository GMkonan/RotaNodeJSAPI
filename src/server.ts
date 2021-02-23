import 'reflect-metadata'; //necessario vir primeiro
import express from 'express';
import "./database"; //se vc n especificar, por padrao ele importa o arquivo index da pasta (no caso index.ts)
import { router } from './routes';

const app = express();

app.use(express.json());
app.use(router);

app.listen(3333, () => console.log("server is running"))

