import 'reflect-metadata'; //necessario vir primeiro
import express, { NextFunction, Request, Response } from 'express';
import 'express-async-errors';
import createConnection from "./database"; //se vc n especificar, por padrao ele importa o arquivo index da pasta (no caso index.ts)
import { router } from './routes';
import { AppError } from './errors/AppError';

createConnection();
const app = express();

app.use(express.json());
app.use(router);

app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
    if(err instanceof AppError) {
        return response.status(err.statusCode).json({
            message: err.message
        })
    }

    return response.status(500).json({
        status: "Error",
        message: `Internal server error ${err.message}`
    })
});

export { app };