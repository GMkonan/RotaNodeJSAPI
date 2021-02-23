# NLW #4 Rota NodeJS

## Aula 1 Comentarios/Anotações
### Comandos interessantes de lembrar e q ja foram usados aqui:

```
yarn init -y 
```
```
yarn add express 
```
```
yarn add typescript -D
``` 
-D significa q eh dependencia de desenvolvimento
```
yarn add @types/express -D 
``` 
@types para aparecer auto complete de opcoes do express
```
yarn add ts-node-dev -D 
``` 
para rodar o typescript
```
yarn tsc --init
``` 
para criar arquivo tsconfig.json

#### package.json
criacao do script dev:
```json
  "scripts": {
    "dev": "ts-node-dev --transpile-only --ignore-watch node_modules src/server.ts"
  },
```

#### tsconfig.json
mudanca da opcao "strict" the true pra false
```json
    "strict": false,
```

## Aula 2 Comentarios/Anotações

### Instalacoes
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
O typeorm foi escolhido para tornar o desenvolvimento mais facil e porque ele funciona bem com o typescript
ja o sqlite 3 foi escolhido para simplificar o uso porem vc pode usar diversos outros com o typeorm como 
escrito na documentacao.

### criacao do bd
apos criar o arquivo index da conexao do banco de dados importe ele dentro do server.ts, junto com o reflect-metadata e de um "yarn dev" para criar o banco, lembre-se de ter configurado o seu orm com "ormconfig.json" antes de tudo isso.

### Migrations
#### oq sao migrations

Migrations sao como controles de versionamento para o seu banco de dados. Sendo muito util para modificar dados la dentro e compartilhar bancos iguais com outros programadores para todos estarem trabalhando com o mesmo bd.

#### ormconfig migrations e criacao de de migration
para ter um pouco mais de organizacao de um local especifico onde todas as migrations seram guardadas,
defina iss dentro do ormconfig.json
```json
    "cli": {
        "migrationsDir": "./src/database/migrations"
    }
```

Para criar uma migration eh so rodar esse comando (caso tenha feito o script "typeorm" no package.json)

```
yarn typeorm migrations:create -n NomeDaMigration //no caso da nossa API o nome foi CreateUsers
```

#### dentro da migration
Dentro da migration temos o **up** e o **down**, uma eh responsavel pela a execucao de criacao da tabela e o outro de remocao da mesma. 
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

Obs: Usamos o await porque tanto o up quanto down devolvem uma promise, e uma promise eh um objeto q pode estar disponivel agora, ou daqui a pouco, ou nunca. Assim, a funcao do await eh esperar o promise retornar para dps executar o q esta em espera.

#### Rodando a migration
Antes de rodar a migration, certifique-se q vc definiu onde elas estao no seu arquei ormconfig.json
Obs: o caminho esta dentro do array pq essa opcao aceita multiplos caminhos.
```json
"migrations": ["./src/database/migrations/**.ts"],
```

para rodar a migration basta digitar o comando:
```
yarn typeorm migration:run
```
**Como verificar a criacao das tabelas**
Para verificar a criacao das tabelas e o historico de migrations devemos usar um programa chamado beekeeper.
dentro dele basta informar qual o banco e onde esta o arquivo do banco q vc podera ver se a sua tabela foi criada com sucesso. caso a tabela n esteja la e n tenha nenhuma migration no historico (pasta migrations) ocorreu um problema.

### Controllers
Iremos dividir o server.ts para melhor organizacao, por isso criamos os controllers separadamente

#### repositorios do typeorm
Responsavel por guardar e retornar objetos
### Routes
para uma melhor organizacao dentro do server.ts iremos fazer a parte de rotas em um arquivo separado, routes.ts e usalo dentro do server.ts com o commando ``` app.use(route) ``` 
Obs: Para testar se o post esta funcionando corretamente lembrese de botar o ```app.use(express.json()) ```
senao ele n vai conseguir entender, pq ele precisa ser informado de q estamos trabalhando com json. Lembre-se de botar ele antes do router.

### models
Lembre-se: para usar as entidades devemos ir no arquivo do ts config e fazer as seguintes edicoes:
Tirar o comentario da opcao ```"strictPropertyInitialization": false,``` e torna-lo false.
Tirar o comentario da opcao ```"experimentalDecorators": true,```
E por tirar o comentario da opcao ```"emitDecoratorMetadata": true, ```

Outra coisa importante eh mapear as entidades (os models) dentro do arquivo osmconfig.json
```json
"entities": ["./src/models/**.ts"],
```

Models sao classes q irao virar tabelas no seu banco de dados, por isso dentro delas definimos os campos da tabela (porem usando os tipos do typescript) e a entidade.

Obs: o constructor foi feito pois existem dois cenarios, o de criacao e o de edicao. Caso estejamos editando nos n queremos q o id seja criado de novo, por isso criamos a condicao de, se o id ja existe, n precisa fazer de novo. Mas se ele n existe nos precisamos criar.

### Regras no controller
Podemos fazer regras no controller para, por exemplo, procurar um user no banco de dados e caso ele esteja la retornar q ele ja existe com um erro 400. E foi isso q foi feito na aplicacao.
