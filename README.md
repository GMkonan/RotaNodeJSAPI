# NLW #4 Rota NodeJS

## Aula 1 Comentários/Anotações

### Comandos interessantes de lembrar e q já foram usados aqui:

```
yarn init -y 
```

```
yarn add express 
```

```
yarn add typescript -D
```

-D significa q eh dependência de desenvolvimento

```
yarn add @types/express -D 
```

@types para aparecer auto complete de opções do express
Obs: se um pacote (como no caso o express) tem um @types para instalar, aparece um ... embaixo do nome dele na importação
```ts
import { Request, Response } from "express";
      //                            ^
      //                            |
      //                      ... bem aqui
```

```
yarn add ts-node-dev -D 
```

para rodar o typescript

```
yarn tsc --init
```

para criar arquivo tsconfig.json

#### package.json

criação do script dev:

```json
  "scripts": {
    "dev": "ts-node-dev --transpile-only --ignore-watch node_modules src/server.ts"
  },
```

#### tsconfig.json

mudança da opção "strict" de true pra false

```json
    "strict": false,
```

## Aula 2 Comentários/Anotações

### Instalações

```
  yarn add typeorm reflect-metadata 
```

```
  yarn add sqlite3 
```

```
  yarn add uuid
```

```
  yarn add @types/uuid
```

### Scripts criados

```json
  "typeorm": "ts-node-dev node_modules/typeorm/cli.js"
```

### Escolha do orm e db

O typeorm foi escolhido para tornar o desenvolvimento mais fácil e porque ele funciona bem com o typescript
ja o sqlite 3 foi escolhido para simplificar o uso porem vc pode usar diversos outros com o typeorm como 
escrito na documentacao.

### criação do bd

após criar o arquivo index da conexão do banco de dados importe ele dentro do server.ts, junto com o reflect-metadata e de um "yarn dev" para criar o banco, lembre-se de ter configurado o seu orm com "ormconfig.json" antes de tudo isso.

### Migrations

#### oq sao migrations

Migrations são como controles de versionamento para o seu banco de dados. Sendo muito útil para modificar dados lá dentro e compartilhar bancos iguais com outros programadores para todos estarem trabalhando com o mesmo bd.

#### ormconfig migrations e criação de de migration

para ter um pouco mais de organização de um local especifico onde todas as migrations serão guardadas,
defina iss dentro do ormconfig.json

```json
    "cli": {
        "migrationsDir": "./src/database/migrations"
    }
```

Para criar uma migration eh só rodar esse comando (caso tenha feito o script "typeorm" no package.json)

```
yarn typeorm migration:create -n NomeDaMigration //no caso da nossa API o nome foi CreateUsers
```

#### dentro da migration

Dentro da migration temos o **up** e o **down**, uma eh responsável pela a execução de criação da tabela e o outro de remoção da mesma. 
No up vc ira criar a tabela, Ex:

```ts
public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true
                    },
                    {
                        name: "name",
                        type: "varchar"
                    },
                ]
            })
        )
}
```

E no down vc ira remover ela (ou dar um drop nela), Ex:

```ts
public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("users");
    }
```

Obs: Usamos o await porque tanto o up quanto down devolvem uma promise, e uma promise eh um objeto q pode estar disponível agora, ou daqui a pouco, ou nunca. Assim, a função do await eh esperar o promise retornar para depois executar o q esta em espera.

#### Rodando a migration

Antes de rodar a migration, certifique-se q vc definiu onde elas estão no seu arquei ormconfig.json
Obs: o caminho esta dentro do array pq essa opção aceita múltiplos caminhos.

```json
"migrations": ["./src/database/migrations/**.ts"],
```

para rodar a migration basta digitar o comando:

```
yarn typeorm migration:run
```

**Como verificar a criação das tabelas**
Para verificar a criação das tabelas e o histórico de migrations devemos usar um programa chamado beekeeper.
dentro dele basta informar qual o banco e onde esta o arquivo do banco q vc podera ver se a sua tabela foi criada com sucesso. caso a tabela n esteja la e n tenha nenhuma migration no historico (pasta migrations) ocorreu um problema.

### Controllers

Iremos dividir o server.ts para melhor organização, por isso criamos os controllers separadamente

#### repositorios do typeorm

Responsável por guardar e retornar objetos

### Routes

para uma melhor organização dentro do server.ts iremos fazer a parte de rotas em um arquivo separado, routes.ts e usa-lo dentro do server.ts com o comando ``` app.use(route) ``` 
Obs: Para testar se o post esta funcionando corretamente lembre-se de botar o ```app.use(express.json()) ```
senao ele n vai conseguir entender, pq ele precisa ser informado de q estamos trabalhando com json. Lembre-se de botar ele antes do router.

### models

Lembre-se: para usar as entidades devemos ir no arquivo do ts config e fazer as seguintes edicoes:
Tirar o comentário da opção ```"strictPropertyInitialization": false,``` e torna-lo false.
Tirar o comentário da opção ```"experimentalDecorators": true,```
E por tirar o comentário da opção ```"emitDecoratorMetadata": true, ```

Outra coisa importante eh mapear as entidades (os models) dentro do arquivo osmconfig.json

```json
"entities": ["./src/models/**.ts"],
```

Models são classes q irão virar tabelas no seu banco de dados, por isso dentro delas definimos os campos da tabela (porem usando os tipos do typescript) e a entidade.

Obs: O constructor foi feito pois existem dois cenários, o de criação e o de edição. Caso estejamos editando nos n queremos q o id seja criado de novo, por isso criamos a condição de, se o id já existe, n precisa fazer de novo. Mas se ele n existe nos precisamos criar.

### Regras no controller

Podemos fazer regras no controller para, por exemplo, procurar um user no banco de dados e caso ele esteja lá retornar q ele já existe com um erro 400. E foi isso q foi feito na aplicação.

## Aula 3 Comentários/Anotações
- criado arquivos separados para repositórios

- refatoramos controllers

- fizemos as surveys

- aprendemos e fizemos testes



Obs: Fizemos um novo tipo de função no SurveyController que é o show, podemos usar o show

no arquivo routes.ts e fazer uma requisição GET em "/surveys" para ver todas as surveys do

banco de dados.



alt + shift + o -> tira todos os imports que não estão sendo usados



ctrl + d -> executar esse shortcut enquanto esta com uma palavra selecionada ira fazer com que quando você renomeá-la você ira renomear tudo no código que tiver o mesmo nome



### Testes automatizados



#### Instalações

```

yarn add jest @types/jest -D

```

```

yarn add ts-jest supertest @types/supertest -D

```

#### Configurações

```

yarn jest --init

```

Respostas usadas nesse projeto: 

```

√ Would you like to use Jest when running "test" script in "package.json"? ... yes

√ Would you like to use Typescript for the configuration file? ... yes

√ Choose the test environment that will be used for testing » node

√ Do you want Jest to add coverage reports? ... no

√ Which provider should be used to instrument code for coverage? » v8

√ Automatically clear mock calls and instances between every test? ... yes

```



Mudanças no arquivo jest.config.ts

bail para true (não deixa os testes terminarem se um deles der errado)

```ts

bail: true

```

preset para "ts-jest" q nos instalamos

```ts

preset: "ts-jest"

```

comentado a linha testEnvironment: "node"

```ts

// testEnvironment: "node",

```

testMatch descomentado e com o seguinte valor:

(define onde ficaram os arquivos de teste, no caso eles ficaram dentro

de uma pasta __ tests __ no root e serão arquivos **.test.ts)

```ts

testMatch: [

     "**/__tests__/**.test.ts"

   ],

```



#### Scripts

Devemos criar dois novos scripts, o posttest e o test



**Config Windows**

```json

  "test": "cross-env NODE_ENV=test jest",

  "posttest": "rimraf ./src/database/database.test.sqlite" 

```

Para funciona no windows o test devemos fazer esses passos, como dito por um membro da rocketseat:



- Instale o pacote cross-env (https://www.npmjs.com/package/cross-env) para lidar com as variáveis ambiente, o comando é: yarn add cross-env -D ou npm install cross-env -D

- Altere o script "test" no arquivo package.json para o seguinte: "test": "cross-env 

## Aula 4 Comentários/Anotações

Podemos passar abaixo da nossa tabela na migration as foreign Keys (como array) e passar alguns atributos a elas
```ts
foreignKeys: [
                    {
                        name: "FKUser",
                        referencedTableName: "Users",
                        referencedColumnNames: ["id"],
                        columnNames: ["user_id"],
                        onDelete: "CASCADE",
                        onUpdate: "CASCADE"
                    }
                ]
```
Obs: Note que onDelete e onUpdate CASCADE, serve para atualizar ou remover esse dado na nossa tabela (no caso surveys_users) caso ele seja atualizado ou deletado
dentro de sua propria tabela (no caso a tabela users)

### Envio de emails
Como eh uma aplicacao teste e precisamos usar um servico SMTP iremos utilizar o Ethereal (fake SMTP service)
Iremos dividir o nosso servico de enviar email em uma pasta e arquivo separado
#### constructor em classes
Obs: Utilizamos muitas vezes o constructor, mas so para deixar explicado, o constructor eh um metodo que eh executado assim que uma classe eh chamada/instanciada

#### .then e async/await
.then eh uma forma antiga de fazer o async/await. Nele a resposta n eh retornada, e sim fica dentro do metodo .then
As vezes precisamos utilizar essa forma antiga pq, por exemplo, o constructor n aceita async/await.
#### Instalações
```
yarn add nodemailer
```
```
yarn add @types/nodemailer
```

### Customizacao do template de email
Iremos utilizar o handlebars para fazer o template pq ele pode receber as variaveis para dps preenchermos com os dados q estao no banco de dados, deixando o template personalizado para quem recebe-lo.
Obs: extensoes .hbs sao arquivos handlebars, q nem nosso npsMail.hbs
#### Instalações
```
yarn add handlebars
```

## Aula 4 Comentários/Anotações

ctrl + shift + l ---> seleciona todos os iguais para modificar ao mesmo tempo

### Refatorações
Trocamos o where do surveyUserAlreadyExists para apenas um objeto, para no envio do email ele fazer a checagem da existencia do usuario **E** do valor como nulo, e n checar um **OU** o outro
```ts
where: {user_id: user.id, value: null},
```

Trocamos o id em variables para ```id: ""``` para q ele seja checado no surveyUserAlreadyExists,
se o usuario ja existe esse id vai ser sobreescrito pelo id do surveyUserAlreadyExists, se n existir
a gente da o id que acabou de ser criado em ``` surveyUsersRepository.save``` 
Lembre-se de trocar para "id" no template tambem (npsMail.hbs) 

### Resposta do email
Crie o AnswerController, dentro dele iremos fazer uso de route params e query params para pegar a resposta do usuario e salvar (tem uma explicacao nos comentarios de la!)

Nos routes crie uma rota para answers com route param 
```ts
router.get("/answers/:value", answerController.execute);
```

### calculo NPS
Agora crie o NpsController para podermos fazer o calculo de nps (explicacao do calculo la)

Obs: Lembre de procurar o user pelo id e pela resposta do valor tambem, passe o value como Not(IsNull()) para nao pegar pessoas q ainda n responderam a pesquisa

Obs2: Passei todos os elementos como resposta na rota do nps apenas para podermos ver tudo, mas o calculo eh apenas o ultimo (o np: calculate)

agora eh so criar a rota com o route param para usar
```ts
router.get("/nps/:survey_id", npsController.execute);
```

### Validacoes

#### Instalacoes
```
yarn add yup
```

Como a parte de validacoes tem mais comentario do q codigo irei deixar o codigo aqui

No userController:

import:
```ts
import * as yup from 'yup';
```
Dentro do execute abaixo do ```const {name, email} = request.body```
```ts
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
            return response.status(400).json({error: err})
        }
```

### Refatoracoes extras!
#### Remocao do banco de dados
Vamos remover o posttest dos nossos scripts do package.json para n precisarmos usar comandos
especificos de um sistema operacional, agora iremos apagar as rows da db teste direto nos testes.
Dentro de Survey.test.ts e User.test.ts iremos incluir o seguinte:
```ts
afterAll( async () => {
        const connection = getConnection();
        await connection.dropDatabase();
        await connection.close();
    })
```

Agora o db teste n ira ser removido, mas tudo dentro dele sera, por isso n precisamos mas apagar ele.

Outra coisa q devemos fazer eh botar a flag -i no nosso script de test, agora ficara assim:
```json
"test": "cross-env NODE_ENV=test jest -i"
```
Ou no linux...
```json
"test": "NODE_ENV=test jest -i"
```
#### Melhoria nos erros dos controllers
Crie uma pasta chamada errors com um arquivo ```AppError.ts```, Agora ao inves de retornar erros nos controllers iremos deixar os retornos para o proprio App fazer.
Obs: Entre no AppError.ts para entender melhor, podemos passar um statusCode diferente caso precise,
mas como todos nessa aplicacao foram 400 nos botamos o statusCode = 400 direto no AppError.

Agora podemos ir no erros dos controllers e usar a seguinte sintaxe:
```ts
throw new AppError("survey User does not exists!");
```
AppError eh a classe q criamos para cuidar dos erros (com o message e o statusCode).
O throw eh usado para jogar o erro para cima, ou seja quem ira lidar com o erro eh quem esta chamando o controller e n o controller em si, quem esta chamando o controller eh o router.ts e quem cuida/usa o router.ts e o App.ts eh si!

Agora so temos q fazer um handler (midleware) para o App.ts saber oq fazer com o erro, primeiro
instale o express-async-errors
```
yarn add express-async-errors
```
importe abaixo da importacao do express:
```ts
import 'express-async-errors';
```
Agora no app.ts importe Request, Response e NextFunction e passe na funcao como abaixo
O if eh responsavel por pegar erros q sao do tipo AppError (ou seja, os q nos definimos com o "throw new AppError) e por isso q ele tem esse "instaceof AppError". Para qualquer outro tipo de erro (q provavelmente sera de servidor por isso o status 500) nos damos uma resposta "internal server error (mensagem do erro)". agora pronto! Todos os erros agora sao "organizados" pelo app.ts.
```ts
app.use((err: Error, request: Request, response: Response, _next: NextFunction) => {
    if(err instanceof AppError) { //instaceof eh para dizer "se for um erro do tipo AppError"
        return response.status(err.statusCode).json({
            message: err.message
        })
    }

    return response.status(500).json({
        status: "Error",
        message: `Internal server error ${err.message}`
    })
});
```

## Conclusao
Tudo concluido. Agora temos uma API para calculo NPS funcional desenvolvido na semana NLW, Agora so irei anotar algumas extensoes usadas pela instrutora nas aulas:

### Extensoes
Tema: Omni
Tema dos icones de arquivos e folders: Material Icon Theme
Obs: em settings.json podemos definir q pastas com nomes especificoes vao ter certos icones :)
Fonte: JetBrainsMono (define no settings.json)
Code spell Checker: acho q o nome ja diz

### Programas usados durante a semana
Insomnia: Para fazer as requisicoes
BeeKeeper studio: Para olharmos as tabelas no banco de dados
