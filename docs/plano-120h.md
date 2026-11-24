# FiscControl — plano de 120 horas

App de finanças pessoais em português para quem quer organizar o dinheiro e sair das dívidas. São 12 semanas de 10h: primeiro a base financeira, depois o coach de dívidas.

## Stack

- **Back:** NestJS 11, TypeORM, PostgreSQL 15, Redis 7, Bull, Swagger, passport-jwt
- **Front:** React 19, Vite 7, Tailwind 4, React Router 7, react-hook-form, axios
- **Infra local:** Docker Compose (PostgreSQL, Redis, Adminer)

## Arquitetura

O back é um monólito modular com arquitetura hexagonal (ports and adapters), com um worker Bull rodando o mesmo código em outro processo.

- **Contextos:** identity, ledger (contas e transações), debts, coach, assessment
- **Camadas por contexto:** `domain/` (regra pura, sem NestJS nem TypeORM), `application/` (casos de uso e portas), `infra/` (HTTP, TypeORM, Redis, LLM, fila)
- As dependências apontam para dentro. O caso de uso conhece apenas interfaces.

```
src/modules/debts/
├─ domain/          debt.entity.ts, money.vo.ts, monthly-rate.vo.ts, prioritization/
├─ application/     ports/, create-debt.use-case.ts, simulate-payoff.use-case.ts
├─ infra/           http/, typeorm/ (orm-entity, repository, mapper), llm/
└─ debts.module.ts  liga cada porta ao seu adapter
```

### Decisões

- Dinheiro em centavos (`bigint`), nunca `float`
- Mês fiscal calculado em America/Sao_Paulo
- Access token de 15 min; refresh de 7 dias, rotacionado e guardado como hash
- `Idempotency-Key` no POST de transações; paginação por cursor
- Erros em `application/problem+json`; Swagger em `/api/docs`
- O LLM recebe só valores e taxas, nunca dados pessoais; a conta é sempre feita pelo motor de domínio (tool calling)

### Padrões

| Padrão | Onde |
| --- | --- |
| Repository | DebtRepository, TransactionRepository |
| Use Case | Uma classe por ação |
| Value Object | Money, MonthlyRate, MonthRef |
| Strategy | Avalanche e bola de neve |
| Unit of Work | Transação e saldo gravados juntos |
| Mapper | ORM ↔ domínio |
| Cache-aside | Resumo mensal no Redis |
| Idempotency Key | POST /transactions |

## Rotas da API (`/api/v1`)

| Método | Rota | Semana |
| --- | --- | --- |
| POST | /auth/register, /auth/login, /auth/refresh, /auth/logout | 1 |
| GET | /me | 1 |
| GET, POST, PATCH, DELETE | /accounts | 3 |
| GET, POST, PATCH, DELETE | /transactions | 4 |
| GET | /summary/monthly?month=AAAA-MM | 5 |
| GET, POST, PATCH, DELETE | /debts | 6 |
| POST | /debts/plan/simulate | 7 |
| POST | /coach/sessions, /coach/sessions/:id/messages | 8 |
| GET, POST | /debts/plan | 9 |
| GET, POST | /assessment/questions, /assessment/answers, /assessment/result | 10 |
| GET | /health, /docs | 11 |

## Rotas do front

`/login`, `/cadastro`, `/inicio`, `/contas`, `/transacoes`, `/dividas`, `/dividas/plano`, `/coach`, `/avaliacao`, `/configuracoes`

## Cronograma

| Semana | Entrega |
| --- | --- |
| 1 | Estrutura hexagonal e autenticação (JWT com refresh rotacionado) |
| 2 | Login e cadastro no web, interceptor de renovação de token |
| 3 | Contas, Money e repositório com mapper |
| 4 | Transações com Unit of Work, idempotência e paginação por cursor |
| 5 | Resumo mensal com cache-aside e worker Bull |
| 6 | Cadastro de dívidas |
| 7 | Motor de priorização (avalanche e bola de neve) |
| 8 | Coach com LLM e tool calling |
| 9 | Tela do coach e plano de quitação salvo |
| 10 | Autoavaliação de 9 eixos |
| 11 | Testes e2e, Swagger, logs e health check |
| 12 | Deploy, README final e demo |

## Fluxo de cada funcionalidade

Escolher a semana → branch `feat/...` → teste do domínio → caso de uso e porta → adapter → controller e DTO → tela no front → teste e2e → PR com CI verde → merge e horas anotadas.

## Fora do escopo das 120h

OCR de notas, lançamento por voz, patrimônio, simulação de IRPF e app mobile.
