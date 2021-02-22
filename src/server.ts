import express from 'express';

const app = express();

/**
 * GET => Busca
 * POST => Salvar
 * PUT => Alterar
 * DELETE => Deletar
 * PATCH => Alteracao especifica
 */

app.get("/", (request, response) => {
    
    return response.json({message: "Hello World"})
})

// 1 param => Rota(Recurso dentro da API)
// 2 param => resquest, response

app.post("/", (request, response) => {
    //Recebeu dados para salvar
    return response.json({message: "Os dados foram salvos!"})
})

 app.listen(3333, () => console.log("server is running"))

