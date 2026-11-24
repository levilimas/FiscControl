# FiscControl

App de finanças pessoais em português para quem quer organizar o dinheiro e sair das dívidas: contas, transações, resumo do mês, cadastro de dívidas e um coach que ajuda a montar o plano de quitação.

> Em desenvolvimento. O plano completo, com arquitetura, rotas e cronograma, está em [docs/plano-120h.md](docs/plano-120h.md).

## Stack

| Parte | Tecnologias |
| --- | --- |
| Back | NestJS 11, TypeORM, PostgreSQL 15, Redis 7, Bull, Swagger, passport-jwt |
| Front | React 19, Vite 7, Tailwind 4, React Router 7, react-hook-form, axios |
| Infra local | Docker Compose (PostgreSQL, Redis, Adminer) |

## Arquitetura

Monólito modular com arquitetura hexagonal (ports and adapters). Cada contexto (identity, ledger, debts, coach, assessment) tem domínio, aplicação e infraestrutura, e as dependências apontam para dentro. Detalhes em [docs/plano-120h.md](docs/plano-120h.md).

```
FiscControl/
├─ backend/        API NestJS
├─ frontend-web/   SPA React
└─ docs/           plano, arquitetura e rotas
```

## Como rodar

Pré-requisitos: Node.js 20 ou mais novo e Docker.

**Back**

```bash
cd backend
docker compose up -d
echo "DATABASE_URL=postgresql://postgres:postgres@localhost:5432/fiscal_db" > .env
npm install
npm run start:dev
```

A API sobe na porta 3000, ou na definida em `PORT`. O Adminer fica em http://localhost:8080.

**Front**

```bash
cd frontend-web
npm install
npm run dev
```

**Testes**

```bash
cd backend
npm run test
npm run test:e2e
```

## Licença

[AGPL-3.0](LICENSE). Quem distribuir o código, ou oferecer uma versão modificada como serviço, precisa publicar o código-fonte sob a mesma licença.
