import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { User } from '../models/User';

class UserController {
    
    async create(request: Request, response: Response) {
        const { name, email } = request.body

        const usersRepository = getRepository(User);

        //usa o findOne pq n eh pra ter mais de um registro entao n tem pq buscar mais de um
        //SELECT * FROM USERS WERE EMAIL = "EMAIL"
        const userAlreadyExists = await usersRepository.findOne({
            email
        })

        //Regra de negocio
        if(userAlreadyExists) {
            return response.status(400).json({
                error: "User already exist!"
            })
        }

        const user = usersRepository.create({
            name, 
            email,
        })

        await usersRepository.save(user);

        return response.json(user)
    }
}

export { UserController }