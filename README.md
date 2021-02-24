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
yarn typeorm migrations:create -n NomeDaMigration //no caso da nossa API o nome foi CreateUsers
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