# Daily Diet API

API de registro de refeições e acompanhamento de dieta desenvolvida utilizando **Node.js e Fastify**, com banco de dados **SQLite**.  
O objetivo do projeto foi criar um backend completo para registrar refeições, calcular métricas de dieta e gerenciar usuários de forma segura.

## O que foi praticado e aprendido

Neste projeto, aprofundei conceitos fundamentais de **Node.js** e **desenvolvimento de APIs**, incluindo:

- Criação de servidor com **Fastify**.
- Validação de dados com **Zod**.
- Autenticação simples com **cookies** e identificação de usuários.
- Hash de senhas com **bcrypt**.
- Persistência de dados utilizando **SQLite** e **Knex.js**.
- Estruturação do projeto com **TypeScript**, **TSX** e **Tsup**.
- Implementação de rotas para **CRUD de refeições**.
- Cálculo de métricas do usuário, como melhor sequência de refeições dentro da dieta.

## Funcionalidades

- **Criar** um usuário (`POST /users`).
- **Login** de usuário (`POST /users/login`) com cookie de sessão.
- **Registrar** uma refeição (`POST /meals`).
- **Listar** todas as refeições de um usuário (`GET /meals`).
- **Visualizar** uma única refeição (`GET /meals/:id`).
- **Atualizar** uma refeição (`PUT /meals/:id`).
- **Deletar** uma refeição (`DELETE /meals/:id`).
- **Recuperar métricas** do usuário (`GET /metrics`):
  - Total de refeições registradas.
  - Total de refeições dentro da dieta.
  - Total de refeições fora da dieta.
  - Melhor sequência de refeições dentro da dieta.

## Tecnologias utilizadas

**Back-end / linguagem:**

- Node.js
- TypeScript
- Fastify
- TSX
- Tsup

**Banco de dados:**

- SQLite
- Knex.js

**Validação / segurança:**

- Zod (validação de dados)
- bcrypt (hash de senhas)
- @fastify/cookie (cookies de sessão)

**Ferramentas de desenvolvimento:**

- ESLint (@rocketseat/eslint-config)
- Vitest (testes)
- Supertest (testes de integração)
- dotenv (variáveis de ambiente)

## Como executar localmente

1. Clone o repositório:  
   `git clone https://github.com/marcospedroweb/desafio-rocketseat-nodejs-nivel2`
2. Acesse o diretório:  
   `cd desafio-rocketseat-nodejs-nivel2`
3. Instale as dependências:  
   `npm install`
4. Crie o arquivo .env com base no .env.example:  
   `.env.example`
5. Gere o servidor em modo produção:  
   `npm run build`
6. Inicie o servidor em produção:  
   `node ./build/server.cjs`
7. Inicie as tabelas do banco Knex:  
   `npm run knex -- migrate:latest`
8. Acesse a API via `http://localhost:3333`.
9. (Opcional) Utilize o collection para realizar Request via Postman:
   `desafio2.postman_collection.json`

---
