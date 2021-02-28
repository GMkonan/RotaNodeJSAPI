import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

/** http://localhost:3333/answers/5?u=249308ca-0f2a-4c6a-a0ed-e38719c62f36
 * 
 * Route Params => Parametros que compoem a rota (parametros q estao na url entre barras)
 * Ex: routes.get("/answers/:value/:nota")
 * 
 * 
 * Query Params => Busca, paginacao, nao obrigatorios (eles vem dps do ?)
 * ?
 * chave=valor
 */

class AnswerController {

    async execute(request: Request, response: Response) {
        const { value } = request.params; //route param value
        const { u } = request.query //query param value (u is the key)

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveyUser = await surveysUsersRepository.findOne({
            id: String(u) //u can be undefined and id needs to be string, thats why we use String()
        })

        if(!surveyUser) {
            throw new AppError("survey User does not exists!");
        }

        surveyUser.value = Number(value);

        await surveysUsersRepository.save(surveyUser);

        return response.json(surveyUser);
    }
}

export { AnswerController };