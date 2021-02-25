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