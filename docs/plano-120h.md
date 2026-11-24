# FiscControl — plano de 120 horas

App de finanças pessoais em português para quem quer organizar o dinheiro e sair das dívidas. É pensado para quem tem TDAH: lançar um gasto em segundos, falando ou digitando, receber aviso na hora certa e decidir olhando um número só. São 12 semanas de 10h.

## Feito para TDAH

| O que costuma falhar | O que o app faz | Semana |
| --- | --- | --- |
| Lançar leva tempo | Campo na tela inicial aceita "45,90 mercado" ou a voz; confirmação com um toque | 4 e 10 |
| Esquecer de abrir o app | Lembretes de vencimento por e-mail e, com o app instalado, por notificação | 6 e 10 |
| Lembrar das contas fixas | Aluguel, academia e parcelas entram sozinhas todo mês | 3 e 4 |
| Decidir com informação demais | Um número na tela inicial: quanto está livre até o salário e quanto dá por dia | 5 |
| Travar diante das dívidas | O coach diz por qual dívida começar e quanto mandar para ela | 7 a 9 |
| Largar depois de semanas | Revisão de domingo em 5 minutos, guiada pelo coach | 9 |

## Stack

- **Back:** NestJS 11, TypeORM, PostgreSQL 15, Redis 7, Bull, Swagger, passport-jwt
- **Front:** React 19, Vite 7, Tailwind 4, React Router 7, react-hook-form, axios; instalável na tela do celular
- **Infra local:** Docker Compose (PostgreSQL, Redis, Adminer)

## Arquitetura

O back é um monólito modular com arquitetura hexagonal (ports and adapters), com um worker Bull rodando o mesmo código em outro processo para contas fixas, lembretes e resumos.

- **Contextos:** identity, ledger (contas, fixas e transações), debts, coach, reminders
- **Camadas por contexto:** `domain/` (regra pura, sem NestJS nem TypeORM), `application/` (casos de uso e portas), `infra/` (HTTP, TypeORM, Redis, LLM, fila)
- As dependências apontam para dentro. O caso de uso conhece apenas interfaces.

```
src/modules/debts/
├─ domain/          debt.entity.ts, money.vo.ts, monthly-rate.vo.ts, prioritization/
├─ application/     ports/, create-debt.use-case.ts, simulate-payoff.use-case.ts
├─ infra/           http/, typeorm/ (orm-entity, repository, mapper)
└─ debts.module.ts  liga cada porta ao seu adapter
```

### Lançamento por voz

A fala vira texto no próprio aparelho (Web Speech API no Chrome, ditado do teclado no iPhone), sem custo de servidor. O texto vai para `POST /transactions/quick`: regras resolvem o caso comum ("45,90 mercado") e o `LlmPort` só entra quando a frase é solta ("gastei 32 e 50 no ifood"). A resposta é um rascunho; nada é gravado sem a confirmação do usuário.

### Decisões

- Dinheiro em centavos (`bigint`), nunca `float`
- Mês e dia do salário calculados em America/Sao_Paulo
- Access token de 15 min; refresh de 7 dias, rotacionado e guardado como hash
- `Idempotency-Key` no POST de transações; paginação por cursor
- Erros em `application/problem+json`; Swagger em `/api/docs`
- O LLM recebe só valores, taxas e o texto do lançamento, nunca nome, e-mail ou CPF; a conta das dívidas é sempre feita pelo motor de domínio (tool calling)

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
| Chain of Responsibility | Parser do lançamento rápido: regras, depois LLM |
| Scheduler | Jobs repetíveis do Bull para fixas e lembretes |

## Rotas da API (`/api/v1`)

| Método | Rota | Semana |
| --- | --- | --- |
| POST | /auth/register, /auth/login, /auth/refresh, /auth/logout | 1 |
| GET | /me | 1 |
| GET, POST, PATCH, DELETE | /accounts, /recurring | 3 |
| GET, POST, PATCH, DELETE | /transactions | 4 |
| POST | /transactions/quick | 4 |
| GET | /summary/monthly?month=AAAA-MM, /summary/available | 5 |
| PATCH | /me/settings | 5 |
| GET, POST, PATCH, DELETE | /debts | 6 |
| GET, PATCH | /reminders | 6 |
| POST | /debts/plan/simulate | 7 |
| POST | /coach/sessions, /coach/sessions/:id/messages | 8 |
| GET, POST | /debts/plan | 9 |
| POST | /coach/weekly-review | 9 |
| POST | /push/subscriptions | 10 |
| GET | /health, /docs | 11 |

## Rotas do front

`/login`, `/cadastro`, `/inicio`, `/contas`, `/transacoes`, `/dividas`, `/dividas/plano`, `/coach`, `/revisao`, `/configuracoes`

## Cronograma

| Semana | Entrega |
| --- | --- |
| 1 | Estrutura hexagonal e autenticação (JWT com refresh rotacionado) |
| 2 | Login e cadastro no web, interceptor de renovação de token, app instalável |
| 3 | Contas e contas fixas, Money e repositório com mapper |
| 4 | Transações com Unit of Work e idempotência; lançamento rápido por texto; job que lança as fixas |
| 5 | Resumo mensal com cache-aside; "livre até o salário" na tela inicial |
| 6 | Dívidas e lembretes de vencimento por e-mail |
| 7 | Motor de priorização (avalanche e bola de neve) |
| 8 | Coach com LLM e tool calling |
| 9 | Tela do coach, plano de quitação salvo e revisão de domingo |
| 10 | Voz no lançamento rápido, extração pelo LLM e notificação push |
| 11 | Testes e2e, Swagger, logs e health check |
| 12 | Deploy, README final e demo |

## Fluxo de cada funcionalidade

Escolher a semana → branch `feat/...` → teste do domínio → caso de uso e porta → adapter → controller e DTO → tela no front → teste e2e → PR com CI verde → merge e horas anotadas.

## Fora do escopo das 120h

Transcrição de áudio no servidor, autoavaliação de 9 eixos, OCR de notas, patrimônio, simulação de IRPF e app mobile nativo.
