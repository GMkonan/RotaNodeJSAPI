import { Request, Response } from "express";
import { getConnection, getCustomRepository } from "typeorm";
import { SurveysRepository } from "../repositories/SurveysRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UsersRepository } from "../repositories/UsersRepository";
import SendMailService from "../services/SendMailService";
import { resolve } from 'path';

class SendMailController {
    async execute(request: Request, response: Response){
        const { email, survey_id } = request.body;

        //saber se email realmente existe e eh valido,pesquisa existe e eh valida
        const usersRepository = getCustomRepository(UsersRepository);
        const surveysRepository = getCustomRepository(SurveysRepository);
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository);

        const user = await usersRepository.findOne({email});

        if(!user) {
            return response.status(400).json({
                error: "User does not exists"
            })
        }

        //Procurar um id onde esse id seja igual ao id da pesquisa (survey_id)
        const survey = await surveysRepository.findOne({id: survey_id})

        if(!survey) {
            return response.status(400).json({
                error: "Survey does not exists"
            })
        }

        const npsPath = resolve(__dirname, "..", "views", "emails", "npsMail.hbs")

        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            user_id: user.id,
            link: process.env.URL_MAIL,
        }

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: [{user_id: user.id}, {value: null}],
            relations: ["user", "survey"]
        })

        if(surveyUserAlreadyExists) {
            await SendMailService.execute(email, survey.title, variables, npsPath);
            return response.json(surveyUserAlreadyExists);
        }

        //salvar as infos na tabela surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id
        })

        await surveysUsersRepository.save(surveyUser);
        //Enviar e-mail para o usuario
        // como o exportamos com o default new, podemos chama-lo dessa forma aqui
        await SendMailService.execute(email, survey.title, variables , npsPath);
        return response.json(surveyUser); 
    }
}

export { SendMailController };