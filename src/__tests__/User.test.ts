import request from 'supertest';
import { app } from '../app';

import createConnection from '../database';

describe("Users", () => {
    beforeAll(async () => {
        const connection = await createConnection();
        await connection.runMigrations();
    });

    it("Should be able to create a new user", async () => {
        const response = await request(app).post("/users").send({
            email: "user@example.com",
            name: "User Example"
        })
    
        expect(response.status).toBe(201);
    })
    /**
     * como estamos criando um usuario acima, aqui na verificacao de 
     * "usuario ja tem esse email no banco de dados" podemos usar exatamente
     * o mesmo */
    it("Should not be able to create a user with exists email",async () => {
        const response = await request(app).post("/users").send({
            email: "user@example.com",
            name: "User Example"
        })
    
        expect(response.status).toBe(400);
    })
})