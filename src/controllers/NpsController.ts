import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

class NpsController {
    
    /**
     * 1 2 3 4 5 6 7 8 9 10
     * Detratores => 0 - 6
     * Passivos => 7 - 8 => n importam, nem entram na conta (como nota, so entram como respondentes)
     * Promotores => 9 - 10
     * 
     * Calculo:
     * (Numero de promotores - numero de detratores) / (numero de respondentes) x 100
     */
    
    async execute(request: Request, response: Response ) {
        const { survey_id } = request.params;

        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const surveysUsers = await surveysUsersRepository.find({
            survey_id,
            value: Not(IsNull()) //importar do typeorm para checar se n eh nulo
        })

        const detractor = surveysUsers.filter(survey => 
            survey.value >= 0 && survey.value <= 6
            ).length;
        
        const promoters = surveysUsers.filter(survey => 
            survey.value >= 9 && survey.value <= 10
            ).length;

        const passive = surveysUsers.filter(survey => 
            survey.value >= 7 && survey.value <= 8
            ).length;
        
        const totalAnswers = surveysUsers.length;
        //usamos o toFixed para pegar apenas duas casas dps da virgula (e o Number pq o toFixed
        //converte o nosso numero para string)
        const calculate = Number((((promoters - detractor) / totalAnswers) * 100).toFixed(2));

        return response.json({
            detractor,
            promoters,
            passive,
            totalAnswers,
            nps: calculate
        })
    }
}

export { NpsController };