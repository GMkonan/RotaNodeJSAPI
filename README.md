## Aula 1 NLW 4 Rota NodeJS
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