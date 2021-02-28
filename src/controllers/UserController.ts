import { Request, Response } from 'express';
import { getCustomRepository } from 'typeorm';
import { UsersRepository } from '../repositories/UsersRepository';
import * as yup from 'yup';
import { AppError } from '../errors/AppError';

class UserController {
    
    async create(request: Request, response: Response) {
        const { name, email } = request.body

        // nos podemos passar os erros aqui ou deixar os defaults do yup
        const schema = yup.object().shape({
            name: yup.string().required("Nome é obrigatorio"),
            email: yup.string().email().required("Email é obrigatorio")
        })

        //Primeira forma de fazer validacao (usamos nossa propria mensagem aqui)
        /*if(!(await schema.isValid(request.body))) {
            return response.status(400).json({error: "Validation Failed!"})
        } */

        //segunda forma de fazer validacao, (usamos as mensagens do yup ou as definidas
        // no schema em cima, ou seja, essa forma eh mais especifica nos erros)
        try{ //usamos o abortEarly como false para mostrar todos os erros, e n so o primeiro q encontrar
            await schema.validate(request.body, {abortEarly: false});
        } catch (err) {
            throw new AppError(err);
        }

        const usersRepository = getCustomRepository(UsersRepository);

        //usa o findOne pq n eh pra ter mais de um registro entao n tem pq buscar mais de um
        //SELECT * FROM USERS WERE EMAIL = "EMAIL"
        const userAlreadyExists = await usersRepository.findOne({
            email
        })

        //Regra de negocio
        if(userAlreadyExists) {
            throw new AppError("User already exist!");
        }

        const user = usersRepository.create({
            name, 
            email,
        })

        await usersRepository.save(user);

        return response.status(201).json(user)
    }
}

export { UserController };
