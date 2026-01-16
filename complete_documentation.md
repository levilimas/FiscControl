# Documentação Completa do Projeto
## Sistema de Gestão Financeira e Fiscal Pessoal

**Versão:** 1.0 - MVP  
**Data:** Janeiro 2026  
**Autor:** Levi Lima  
**Prazo:** 8 semanas

---

## Índice

1. [Visão Geral do Produto](#1-visão-geral-do-produto)
2. [Arquitetura do Sistema](#2-arquitetura-do-sistema)
3. [Modelo de Dados](#3-modelo-de-dados)
4. [Stack Tecnológica](#4-stack-tecnológica)
5. [Setup do Ambiente](#5-setup-do-ambiente)
6. [Estrutura de Pastas](#6-estrutura-de-pastas)
7. [Desenvolvimento Backend](#7-desenvolvimento-backend)
8. [Desenvolvimento Mobile](#8-desenvolvimento-mobile)
9. [Integrações com IA](#9-integrações-com-ia)
10. [User Journeys](#10-user-journeys)
11. [Roadmap de 8 Semanas](#11-roadmap-de-8-semanas)
12. [Segurança e Compliance](#12-segurança-e-compliance)
13. [Testes](#13-testes)
14. [Deploy](#14-deploy)
15. [O Que NÃO Entra no MVP](#15-o-que-não-entra-no-mvp)
16. [Custos e Recursos](#16-custos-e-recursos)
17. [Referências e Links Úteis](#17-referências-e-links-úteis)

---

## 1. Visão Geral do Produto

### 1.1 Problema Central

Pessoas físicas e autônomos não têm a mesma visão financeira-fiscal que a Receita Federal já possui sobre eles, gerando:

- ❌ Malha fina inesperada
- ❌ Multas por inconsistências
- ❌ Decisões financeiras ruins
- ❌ Medo e insegurança tributária

**Agravantes recentes:**
- IN RFB nº 2.278/2025 (e-Financeira ampliada)
- Rearp (regularização patrimonial)
- Ampliação de instituições reportantes
- Integração fluxo financeiro + patrimônio

### 1.2 Proposta de Valor

> **"A Receita já sabe. Nosso app garante que você saiba antes."**

Entregar ao contribuinte uma visão consolidada, inteligível e antecipada da sua realidade financeira e fiscal, usando IA para eliminar fricção na entrada de dados.

### 1.3 Público-Alvo (MVP)

**Pessoas físicas com:**
- Múltiplas contas bancárias
- PIX recorrente
- Investimentos
- Receitas de aluguel

**Autônomos com:**
- Receitas irregulares
- Despesas dedutíveis
- Baixa organização contábil

📌 **Perfil-chave:** Quem não é simples, mas também não é empresa estruturada.

### 1.4 Funcionalidades Core

| Feature | Descrição | Prioridade |
|---------|-----------|------------|
| **Consolidação Multi-Contas** | Visão unificada de múltiplas contas e bancos | 🔴 CRÍTICA |
| **Entrada por Voz** | Adicionar transações falando naturalmente | 🔴 CRÍTICA |
| **Entrada por Foto** | OCR de notas fiscais e documentos | 🔴 CRÍTICA |
| **Classificação Fiscal Assistida** | IA sugere se é tributável, isento, dedutível | 🔴 CRÍTICA |
| **Visão Patrimonial** | Cadastro de bens e evolução patrimonial | 🟡 ALTA |
| **Simulação IRPF** | Estimativa educativa do imposto | 🟡 ALTA |
| **Análise de Coerência** | Alerta inconsistências (post-MVP) | 🟢 MÉDIA |

### 1.5 Princípios Não-Negociáveis

✅ O app **NÃO substitui** contador  
✅ O app **NÃO executa** ações fiscais  
✅ O app **NÃO promete** isenção  
✅ O app **NÃO esconde** dados  
✅ O app **EDUCA** antes de automatizar

---

## 2. Arquitetura do Sistema

### 2.1 Diagrama de Alto Nível

```
┌─────────────────┐
│  React Native   │
│   Mobile App    │
│  (iOS/Android)  │
└────────┬────────┘
         │ HTTPS/REST
         ▼
┌─────────────────┐
│   NestJS API    │
│   (Port 3000)   │
│                 │
│  ┌───────────┐  │
│  │   Auth    │  │
│  │   JWT     │  │
│  └───────────┘  │
└────────┬────────┘
         │
    ┌────┴────┬────────────┬──────────┐
    ▼         ▼            ▼          ▼
┌────────┐ ┌────────┐ ┌────────┐ ┌─────────┐
│ Users  │ │Trans-  │ │Accounts│ │ Assets  │
│ Module │ │actions │ │ Module │ │ Module  │
└────────┘ └───┬────┘ └────────┘ └─────────┘
               │
               ▼
      ┌────────────────┐
      │  Bull Queue     │
      │  (Redis)        │
      └───┬────┬───┬────┘
          │    │   │
    ┌─────┘    │   └─────┐
    ▼          ▼         ▼
┌────────┐ ┌────────┐ ┌──────────┐
│  OCR   │ │ Voice  │ │ Classify │
│ Worker │ │ Worker │ │  Worker  │
└───┬────┘ └───┬────┘ └────┬─────┘
    │          │           │
    ▼          ▼           ▼
┌─────────────────────────────┐
│   External AI Services      │
│                             │
│  • Google Vision (OCR)      │
│  • Whisper API (Voice)      │
│  • GPT-4/Claude (Classify)  │
└─────────────────────────────┘

    ┌────────────────┐
    │   PostgreSQL   │
    │ (Dados Críticos)│
    └────────────────┘
    
    ┌────────────────┐
    │     Redis      │
    │ (Cache + Filas)│
    └────────────────┘
    
    ┌────────────────┐
    │  S3 / Storage  │
    │  (Documentos)  │
    └────────────────┘
```

### 2.2 Componentes Principais

#### 2.2.1 Frontend (Mobile)
- **Framework:** React Native + Expo
- **Navegação:** React Navigation
- **Estado:** Context API + Custom Hooks
- **Forms:** React Hook Form
- **HTTP:** Axios
- **Cache:** AsyncStorage

#### 2.2.2 Backend (API)
- **Framework:** NestJS
- **ORM:** Prisma
- **Autenticação:** JWT + Refresh Token
- **Filas:** BullMQ
- **Validação:** class-validator
- **Documentação:** Swagger

#### 2.2.3 Bancos de Dados
- **PostgreSQL:** Dados estruturados e relacionais
- **Redis:** Cache, sessões e filas assíncronas

#### 2.2.4 Workers
- **OCR Worker:** Processa imagens e PDFs
- **Voice Worker:** Transcreve áudios
- **Classification Worker:** Classifica transações via IA

---

## 3. Modelo de Dados

### 3.1 Schema PostgreSQL

#### Tabela: users
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  cpf VARCHAR(255), -- encrypted
  phone VARCHAR(20),
  
  -- Preferências (JSONB)
  preferences JSONB DEFAULT '{
    "default_context": "PF",
    "notification_enabled": true,
    "theme": "light"
  }'::jsonb,
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_cpf ON users(cpf) WHERE cpf IS NOT NULL;
```

#### Tabela: accounts
```sql
CREATE TYPE account_type_enum AS ENUM ('CORRENTE', 'POUPANCA', 'INVESTIMENTO', 'OUTRO');

CREATE TABLE accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  name VARCHAR(100) NOT NULL,
  bank_name VARCHAR(100),
  account_type account_type_enum NOT NULL,
  
  initial_balance DECIMAL(15,2) DEFAULT 0,
  current_balance DECIMAL(15,2) DEFAULT 0,
  
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_accounts_user_id ON accounts(user_id);
CREATE INDEX idx_accounts_user_active ON accounts(user_id, is_active);
```

#### Tabela: transactions
```sql
CREATE TYPE transaction_type_enum AS ENUM ('CREDITO', 'DEBITO');
CREATE TYPE fiscal_type_enum AS ENUM (
  'TRIBUTAVEL',
  'ISENTO',
  'DEDUTIVEL',
  'NEUTRO',
  'NAO_CLASSIFICADO'
);
CREATE TYPE user_context_enum AS ENUM ('PF', 'AUTONOMO');
CREATE TYPE input_source_enum AS ENUM (
  'MANUAL',
  'VOZ',
  'FOTO',
  'PDF',
  'CSV',
  'XML_NFE'
);

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES accounts(id) ON DELETE CASCADE,
  
  -- Dados básicos
  date DATE NOT NULL,
  amount DECIMAL(15,2) NOT NULL CHECK (amount > 0),
  type transaction_type_enum NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(100),
  
  -- Classificação fiscal
  fiscal_type fiscal_type_enum NOT NULL DEFAULT 'NAO_CLASSIFICADO',
  user_context user_context_enum NOT NULL,
  
  -- Metadados de entrada
  input_source input_source_enum NOT NULL,
  original_input TEXT, -- Transcrição original (voz/manual)
  document_url TEXT, -- URL S3 do documento
  
  -- IA
  ai_confidence_score DECIMAL(3,2) CHECK (ai_confidence_score BETWEEN 0 AND 1),
  ai_suggested_fiscal_type fiscal_type_enum,
  user_confirmed BOOLEAN DEFAULT false,
  
  -- Auditoria
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  edited_by_user_at TIMESTAMP
);

-- Índices críticos para performance
CREATE INDEX idx_transactions_user_date ON transactions(user_id, date DESC);
CREATE INDEX idx_transactions_account_date ON transactions(account_id, date DESC);
CREATE INDEX idx_transactions_user_fiscal ON transactions(user_id, fiscal_type);
CREATE INDEX idx_transactions_composite ON transactions(user_id, date, account_id);
```

#### Tabela: assets
```sql
CREATE TYPE asset_type_enum AS ENUM ('IMOVEL', 'VEICULO', 'INVESTIMENTO', 'OUTRO');

CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  type asset_type_enum NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  
  acquisition_date DATE NOT NULL,
  acquisition_value DECIMAL(15,2) NOT NULL,
  current_estimated_value DECIMAL(15,2) NOT NULL,
  
  documents TEXT[], -- Array de URLs
  
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_assets_user_id ON assets(user_id);
CREATE INDEX idx_assets_user_type ON assets(user_id, type);
```

#### Tabela: tax_simulations
```sql
CREATE TABLE tax_simulations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  
  year INT NOT NULL,
  month INT, -- NULL = simulação anual
  
  total_income DECIMAL(15,2) NOT NULL,
  taxable_income DECIMAL(15,2) NOT NULL,
  deductions DECIMAL(15,2) DEFAULT 0,
  estimated_tax DECIMAL(15,2) NOT NULL,
  
  scenarios JSONB, -- Cenários comparativos
  
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_simulations_user_year ON tax_simulations(user_id, year);
```

### 3.2 Schema Prisma (prisma/schema.prisma)

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String    @id @default(uuid())
  email         String    @unique
  passwordHash  String    @map("password_hash")
  name          String
  cpf           String?
  phone         String?
  preferences   Json      @default("{\"default_context\": \"PF\", \"notification_enabled\": true, \"theme\": \"light\"}")
  
  createdAt     DateTime  @default(now()) @map("created_at")
  updatedAt     DateTime  @updatedAt @map("updated_at")
  lastLogin     DateTime? @map("last_login")
  
  accounts      Account[]
  transactions  Transaction[]
  assets        Asset[]
  simulations   TaxSimulation[]
  
  @@map("users")
}

enum AccountType {
  CORRENTE
  POUPANCA
  INVESTIMENTO
  OUTRO
}

model Account {
  id             String      @id @default(uuid())
  userId         String      @map("user_id")
  user           User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  name           String
  bankName       String?     @map("bank_name")
  accountType    AccountType @map("account_type")
  
  initialBalance Decimal     @default(0) @map("initial_balance") @db.Decimal(15, 2)
  currentBalance Decimal     @default(0) @map("current_balance") @db.Decimal(15, 2)
  
  isActive       Boolean     @default(true) @map("is_active")
  createdAt      DateTime    @default(now()) @map("created_at")
  updatedAt      DateTime    @updatedAt @map("updated_at")
  
  transactions   Transaction[]
  
  @@index([userId])
  @@index([userId, isActive])
  @@map("accounts")
}

enum TransactionType {
  CREDITO
  DEBITO
}

enum FiscalType {
  TRIBUTAVEL
  ISENTO
  DEDUTIVEL
  NEUTRO
  NAO_CLASSIFICADO
}

enum UserContext {
  PF
  AUTONOMO
}

enum InputSource {
  MANUAL
  VOZ
  FOTO
  PDF
  CSV
  XML_NFE
}

model Transaction {
  id                    String          @id @default(uuid())
  userId                String          @map("user_id")
  user                  User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  accountId             String          @map("account_id")
  account               Account         @relation(fields: [accountId], references: [id], onDelete: Cascade)
  
  date                  DateTime        @db.Date
  amount                Decimal         @db.Decimal(15, 2)
  type                  TransactionType
  description           String
  category              String?
  
  fiscalType            FiscalType      @default(NAO_CLASSIFICADO) @map("fiscal_type")
  userContext           UserContext     @map("user_context")
  
  inputSource           InputSource     @map("input_source")
  originalInput         String?         @map("original_input")
  documentUrl           String?         @map("document_url")
  
  aiConfidenceScore     Decimal?        @map("ai_confidence_score") @db.Decimal(3, 2)
  aiSuggestedFiscalType FiscalType?     @map("ai_suggested_fiscal_type")
  userConfirmed         Boolean         @default(false) @map("user_confirmed")
  
  createdAt             DateTime        @default(now()) @map("created_at")
  updatedAt             DateTime        @updatedAt @map("updated_at")
  editedByUserAt        DateTime?       @map("edited_by_user_at")
  
  @@index([userId, date(sort: Desc)])
  @@index([accountId, date(sort: Desc)])
  @@index([userId, fiscalType])
  @@index([userId, date, accountId])
  @@map("transactions")
}

enum AssetType {
  IMOVEL
  VEICULO
  INVESTIMENTO
  OUTRO
}

model Asset {
  id                    String    @id @default(uuid())
  userId                String    @map("user_id")
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  type                  AssetType
  name                  String
  description           String?
  
  acquisitionDate       DateTime  @map("acquisition_date") @db.Date
  acquisitionValue      Decimal   @map("acquisition_value") @db.Decimal(15, 2)
  currentEstimatedValue Decimal   @map("current_estimated_value") @db.Decimal(15, 2)
  
  documents             String[]
  
  createdAt             DateTime  @default(now()) @map("created_at")
  updatedAt             DateTime  @updatedAt @map("updated_at")
  
  @@index([userId])
  @@index([userId, type])
  @@map("assets")
}

model TaxSimulation {
  id            String   @id @default(uuid())
  userId        String   @map("user_id")
  user          User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  year          Int
  month         Int?
  
  totalIncome   Decimal  @map("total_income") @db.Decimal(15, 2)
  taxableIncome Decimal  @map("taxable_income") @db.Decimal(15, 2)
  deductions    Decimal  @default(0) @db.Decimal(15, 2)
  estimatedTax  Decimal  @map("estimated_tax") @db.Decimal(15, 2)
  
  scenarios     Json?
  
  createdAt     DateTime @default(now()) @map("created_at")
  
  @@index([userId, year])
  @@map("tax_simulations")
}
```

---

## 4. Stack Tecnológica

### 4.1 Backend

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| Node.js | 20.x LTS | Runtime |
| NestJS | 10.x | Framework |
| TypeScript | 5.x | Linguagem |
| Prisma | 5.x | ORM |
| PostgreSQL | 15.x | Banco de dados |
| Redis | 7.x | Cache e filas |
| Bull/BullMQ | 4.x | Job queue |
| JWT | - | Autenticação |
| bcrypt | - | Hash de senhas |
| class-validator | - | Validação de DTOs |
| Multer | - | Upload de arquivos |
| Swagger | - | Documentação API |

### 4.2 Mobile

| Tecnologia | Versão | Uso |
|------------|--------|-----|
| React Native | 0.73.x | Framework |
| Expo | ~50.x | SDK e build |
| TypeScript | 5.x | Linguagem |
| React Navigation | 6.x | Navegação |
| Axios | 1.x | HTTP client |
| React Hook Form | 7.x | Formulários |
| AsyncStorage | - | Storage local |
| expo-camera | - | Câmera |
| expo-av | - | Áudio |
| expo-image-picker | - | Galeria |
| react-native-chart-kit | - | Gráficos |

### 4.3 Serviços Externos

| Serviço | Uso | Custo Estimado |
|---------|-----|----------------|
| Google Cloud Vision API | OCR de documentos | ~R$ 50-100/mês |
| OpenAI Whisper API | Speech-to-text | ~R$ 50-100/mês |
| OpenAI GPT-4 / Claude | Classificação fiscal | ~R$ 100-200/mês |
| AWS S3 / DigitalOcean Spaces | Storage de arquivos | ~R$ 10-30/mês |

### 4.4 DevOps

| Ferramenta | Uso |
|------------|-----|
| Docker | Containerização |
| Docker Compose | Dev local |
| GitHub Actions | CI/CD |
| Heroku / Railway / DigitalOcean | Hosting backend |
| Expo EAS | Build e distribuição mobile |

---

## 5. Setup do Ambiente

### 5.1 Pré-requisitos

Instale as seguintes ferramentas:

```bash
# Node.js (versão 20 LTS)
# Baixar de: https://nodejs.org/

# Verificar instalação
node --version  # v20.x.x
npm --version   # 10.x.x

# Git
# Baixar de: https://git-scm.com/

# Docker Desktop
# Baixar de: https://www.docker.com/products/docker-desktop/

# VS Code (recomendado)
# Baixar de: https://code.visualstudio.com/

# Extensões VS Code recomendadas:
# - ESLint
# - Prettier
# - Prisma
# - GitLens
# - Thunder Client (testar APIs)
```

### 5.2 Setup do Backend

#### 5.2.1 Criar o projeto

```bash
# Instalar NestJS CLI globalmente
npm install -g @nestjs/cli

# Criar projeto
nest new backend
cd backend

# Escolher npm como package manager
```

#### 5.2.2 Instalar dependências

```bash
# Core dependencies
npm install @nestjs/config @nestjs/jwt @nestjs/passport passport passport-jwt
npm install @prisma/client
npm install @nestjs/bull bull
npm install redis ioredis
npm install bcrypt
npm install class-validator class-transformer
npm install @nestjs/swagger swagger-ui-express
npm install @nestjs/platform-express multer
npm install axios

# Dev dependencies
npm install -D @types/passport-jwt
npm install -D @types/bcrypt
npm install -D @types/multer
npm install -D prisma
npm install -D @types/node

# Inicializar Prisma
npx prisma init
```

#### 5.2.3 Configurar Docker Compose

Crie `docker-compose.yml` na raiz do backend:

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: fiscal-postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: fiscal_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: fiscal-redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  adminer:
    image: adminer
    container_name: fiscal-adminer
    restart: always
    ports:
      - "8080:8080"
    depends_on:
      - postgres

volumes:
  postgres_data:
  redis_data:
```

#### 5.2.4 Iniciar bancos de dados

```bash
# Subir containers
docker-compose up -d

# Verificar se está rodando
docker ps

# Acessar Adminer (GUI do banco)
# http://localhost:8080
# Server: postgres
# Username: postgres
# Password: postgres
# Database: fiscal_db
```

#### 5.2.5 Configurar variáveis de ambiente

Crie `.env` na raiz do backend:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/fiscal_db?schema=public"

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this
JWT_REFRESH_EXPIRES_IN=7d

# API Keys (substituir pelos seus)
OPENAI_API_KEY=sk-...
GOOGLE_CLOUD_VISION_API_KEY=...

# Storage (local para MVP)
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# App
PORT=3000
NODE_ENV=development
```

Crie `.env.example` (versão sem secrets para o Git):

```env
DATABASE_URL="postgresql://user:password@localhost:5432/db_name?schema=public"
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=change-me
JWT_EXPIRES_IN=15m
JWT_REFRESH_SECRET=change-me
JWT_REFRESH_EXPIRES_IN=7d
OPENAI_API_KEY=your-key-here
GOOGLE_CLOUD_VISION_API_KEY=your-key-here
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760
PORT=3000
NODE_ENV=development
```

#### 5.2.6 Configurar Prisma Schema

Edite `prisma/schema.prisma` (copiar o schema da seção 3.2)

#### 5.2.7 Executar migrations

```bash
# Gerar migration inicial
npx prisma migrate dev --name init

# Gerar Prisma Client
npx prisma generate

# (Opcional) Abrir Prisma Studio para visualizar dados
npx prisma studio
```

### 5.3 Setup do Mobile

#### 5.3.1 Criar o projeto

```bash
# Voltar para o diretório raiz
cd ..

# Criar app Expo
npx create-expo-app mobile --template blank-typescript

cd mobile
```

#### 5.3.2 Instalar dependências

```bash
# Navegação
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# HTTP e state
npm install axios
npm install react-hook-form

# Storage
npx expo install @react-native-async-storage/async-storage

# Camera e mídia
npx expo install expo-camera expo-image-picker expo-av

# Utils
npm install date-fns

# (Opcional) Charts
npm install react-native-chart-kit
npx expo install react-native-svg
```

#### 5.3.3 Configurar variáveis de ambiente

Crie `.env` na raiz do mobile:

```env
EXPO_PUBLIC_API_URL=http://localhost:3000
```

Para Android, use `http://10.0.2.2:3000` (emulador) ou o IP da sua máquina (dispositivo físico).

Crie `.env.example`:

```env
EXPO_PUBLIC_API_URL=http://your-api-url:3000
```

#### 5.3.4 Atualizar app.json

```json
{
  "expo": {
    "name": "Fiscal App",
    "slug": "fiscal-app",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "automatic",
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "assetBundlePatterns": [
      "**/*"
    ],
    "ios": {
      "supportsTablet": true,
      "bundleIdentifier": "com.yourcompany.fiscalapp"
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      },
      "package": "com.yourcompany.fiscalapp",
      "permissions": [
        "android.permission.CAMERA",
        "android.permission.RECORD_AUDIO",
        "android.permission.READ_EXTERNAL_STORAGE",
        "android.permission.WRITE_EXTERNAL_STORAGE"
      ]
    },
    "plugins": [
      [
        "expo-camera",
        {
          "cameraPermission": "Permitir acesso à câmera para digitalizar documentos"
        }
      ],
      [
        "expo-av",
        {
          "microphonePermission": "Permitir acesso ao microfone para entrada por voz"
        }
      ]
    ]
  }
}
```

### 5.4 Estrutura inicial de pastas

```bash
# Backend
cd backend
mkdir -p src/modules/{auth,users,accounts,transactions,assets,simulations,processing,storage}
mkdir -p src/common/{decorators,filters,guards,interceptors,pipes}
mkdir -p src/config
mkdir -p uploads

# Mobile
cd ../mobile
mkdir -p src/{components,screens,services,hooks,context,utils,types,theme}
mkdir -p src/components/{common,forms,charts}
mkdir -p src/screens/{auth,dashboard,transactions,accounts,assets,simulations,profile}
```

### 5.5 Testar setup

#### Backend

```bash
cd backend

# Iniciar servidor de desenvolvimento
npm run start:dev

# Deve aparecer:
# [Nest] Application successfully started
# [Nest] Listening on http://localhost:3000
```

Teste no browser: `http://localhost:3000` (deve retornar "Hello World!")

#### Mobile

```bash
cd mobile

# Iniciar Expo
npx expo start

# Opções:
# - Pressione 'a' para Android
# - Pressione 'i' para iOS
# - Escaneie QR code com Expo Go (dispositivo físico)
```

### 5.6 Git Setup

```bash
# Na raiz do projeto
git init

# Criar .gitignore global
cat > .gitignore << EOF
# Dependencies
node_modules/
.pnp/
.pnp.js

# Environment
.env
.env.local
.env.*.local

# Logs
logs/
*.log
npm-debug.log*

# OS
.DS_Store
Thumbs.db

# IDE
.vscode/
.idea/
*.swp
*.swo

# Build
dist/
build/
*.tsbuildinfo

# Uploads
uploads/
EOF

# Primeiro commit
git add .
git commit -m "chore: initial setup"

# Criar repo no GitHub e conectar
git remote add origin https://github.com/seu-usuario/fiscal-app.git
git branch -M main
git push -u origin main
```

---

## 6. Estrutura de Pastas

### 6.1 Backend (NestJS)

```
backend/
├── src/
│   ├── main.ts
│   ├── app.module.ts
│   ├── app.controller.ts
│   ├── app.service.ts
│   │
│   ├── common/
│   │   ├── decorators/
│   │   │   ├── current-user.decorator.ts
│   │   │   └── public.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   └── refresh-jwt.guard.ts
│   │   ├── interceptors/
│   │   │   └── transform.interceptor.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   │
│   ├── config/
│   │   ├── database.config.ts
│   │   ├── redis.config.ts
│   │   ├── jwt.config.ts
│   │   └── multer.config.ts
│   │
│   └── modules/
│       ├── auth/
│       │   ├── auth.module.ts
│       │   ├── auth.controller.ts
│       │   ├── auth.service.ts
│       │   ├── strategies/
│       │   │   ├── jwt.strategy.ts
│       │   │   └── refresh-jwt.strategy.ts
│       │   └── dto/
│       │       ├── login.dto.ts
│       │       ├── register.dto.ts
│       │       └── auth-response.dto.ts
│       │
│       ├── users/
│       │   ├── users.module.ts
│       │   ├── users.controller.ts
│       │   ├── users.service.ts
│       │   ├── entities/
│       │   │   └── user.entity.ts
│       │   └── dto/
│       │       ├── create-user.dto.ts
│       │       └── update-user.dto.ts
│       │
│       ├── accounts/
│       │   ├── accounts.module.ts
│       │   ├── accounts.controller.ts
│       │   ├── accounts.service.ts
│       │   └── dto/
│       │
│       ├── transactions/
│       │   ├── transactions.module.ts
│       │   ├── transactions.controller.ts
│       │   ├── transactions.service.ts
│       │   ├── dto/
│       │   └── enums/
│       │
│       ├── assets/
│       │   ├── assets.module.ts
│       │   ├── assets.controller.ts
│       │   └── assets.service.ts
│       │
│       ├── simulations/
│       │   ├── simulations.module.ts
│       │   ├── simulations.controller.ts
│       │   ├── simulations.service.ts
│       │   └── calculators/
│       │       └── irpf.calculator.ts
│       │
│       ├── processing/
│       │   ├── processing.module.ts
│       │   ├── processors/
│       │   │   ├── ocr.processor.ts
│       │   │   ├── voice.processor.ts
│       │   │   └── classification.processor.ts
│       │   └── services/
│       │       ├── ocr.service.ts
│       │       ├── speech-to-text.service.ts
│       │       └── ai-classification.service.ts
│       │
│       └── storage/
│           ├── storage.module.ts
│           ├── storage.controller.ts
│           └── storage.service.ts
│
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
│
├── test/
├── uploads/
├── .env
├── .env.example
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

### 6.2 Mobile (React Native)

```
mobile/
├── src/
│   ├── App.tsx
│   │
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── OnboardingScreen.tsx
│   │   │
│   │   ├── dashboard/
│   │   │   ├── DashboardScreen.tsx
│   │   │   └── components/
│   │   │       ├── SummaryCard.tsx
│   │   │       └── RecentTransactions.tsx
│   │   │
│   │   ├── transactions/
│   │   │   ├── TransactionListScreen.tsx
│   │   │   ├── TransactionDetailScreen.tsx
│   │   │   ├── AddTransactionScreen.tsx
│   │   │   └── ClassifyTransactionScreen.tsx
│   │   │
│   │   ├── input/
│   │   │   ├── VoiceInputScreen.tsx
│   │   │   ├── PhotoInputScreen.tsx
│   │   │   └── ManualInputScreen.tsx
│   │   │
│   │   ├── accounts/
│   │   │   ├── AccountsScreen.tsx
│   │   │   └── AddAccountScreen.tsx
│   │   │
│   │   ├── assets/
│   │   │   ├── AssetsScreen.tsx
│   │   │   └── AddAssetScreen.tsx
│   │   │
│   │   ├── simulations/
│   │   │   └── IRPFSimulationScreen.tsx
│   │   │
│   │   └── profile/
│   │       ├── ProfileScreen.tsx
│   │       └── SettingsScreen.tsx
│   │
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Loading.tsx
│   │   │   └── EmptyState.tsx
│   │   │
│   │   ├── forms/
│   │   │   ├── DatePicker.tsx
│   │   │   ├── CurrencyInput.tsx
│   │   │   └── Dropdown.tsx
│   │   │
│   │   └── charts/
│   │       ├── LineChart.tsx
│   │       └── PieChart.tsx
│   │
│   ├── services/
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   ├── transactions.service.ts
│   │   ├── accounts.service.ts
│   │   └── storage.service.ts
│   │
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useTransactions.ts
│   │   ├── useAccounts.ts
│   │   ├── useVoiceRecorder.ts
│   │   └── useCamera.ts
│   │
│   ├── context/
│   │   ├── AuthContext.tsx
│   │   ├── ThemeContext.tsx
│   │   └── AppContext.tsx
│   │
│   ├── utils/
│   │   ├── formatters.ts
│   │   ├── validators.ts
│   │   ├── constants.ts
│   │   └── helpers.ts
│   │
│   ├── types/
│   │   ├── transaction.types.ts
│   │   ├── account.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts
│   │
│   └── theme/
│       ├── colors.ts
│       ├── typography.ts
│       └── spacing.ts
│
├── assets/
│   ├── images/
│   ├── icons/
│   └── fonts/
│
├── .env
├── .env.example
├── .gitignore
├── app.json
├── babel.config.js
├── package.json
├── tsconfig.json
└── README.md
```

---

## 7. Desenvolvimento Backend

### 7.1 Módulo de Autenticação

#### auth.module.ts
```typescript
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshJwtStrategy } from './strategies/refresh-jwt.strategy';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshJwtStrategy],
  exports: [AuthService],
})
export class AuthModule {}
```

#### auth.service.ts
```typescript
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    // Hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    
    // Create user
    const user = await this.usersService.create({
      ...registerDto,
      password: hashedPassword,
    });

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      ...tokens,
    };
  }

  async login(loginDto: LoginDto) {
    // Find user
    const user = await this.usersService.findByEmail(loginDto.email);
    
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    // Update last login
    await this.usersService.updateLastLogin(user.id);

    // Generate tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        preferences: user.preferences,
      },
      ...tokens,
    };
  }

  async refreshTokens(userId: string, refreshToken: string) {
    const user = await this.usersService.findById(userId);
    
    if (!user) {
      throw new UnauthorizedException('Acesso negado');
    }

    // Generate new tokens
    const tokens = await this.generateTokens(user.id, user.email);

    return tokens;
  }

  private async generateTokens(userId: string, email: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_SECRET'),
          expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
        },
      ),
      this.jwtService.signAsync(
        { sub: userId, email },
        {
          secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
          expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRES_IN'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
```

#### auth.controller.ts
```typescript
import { Controller, Post, Body, UseGuards, Get, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { RefreshJwtGuard } from '../../common/guards/refresh-jwt.guard';
import { Public } from '../../common/decorators/public.decorator';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Registrar novo usuário' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @UseGuards(RefreshJwtGuard)
  @Post('refresh')
  @ApiOperation({ summary: 'Renovar tokens' })
  @ApiBearerAuth()
  async refreshTokens(@Req() req) {
    return this.authService.refreshTokens(req.user.sub, req.user.refreshToken);
  }
}
```

#### dto/login.dto.ts
```typescript
import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;
}
```

#### dto/register.dto.ts
```typescript
import { IsEmail, IsString, MinLength, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'João Silva' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: 'senha123' })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  password: string;

  @ApiProperty({ example: '(88) 99999-9999', required: false })
  @IsOptional()
  @IsString()
  phone?: string;
}
```

#### strategies/jwt.strategy.ts
```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
    };
  }
}
```

#### strategies/refresh-jwt.strategy.ts
```typescript
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class RefreshJwtStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(private configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_REFRESH_SECRET'),
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: any) {
    const refreshToken = req.get('Authorization').replace('Bearer', '').trim();
    return { ...payload, refreshToken };
  }
}
```

### 7.2 Guards e Decorators

#### common/guards/jwt-auth.guard.ts
```typescript
import { Injectable, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (isPublic) {
      return true;
    }
    
    return super.canActivate(context);
  }
}
```

#### common/decorators/public.decorator.ts
```typescript
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
```

#### common/decorators/current-user.decorator.ts
```typescript
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
```

### 7.3 Módulo de Transações

#### transactions.service.ts
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { FilterTransactionDto } from './dto/filter-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  async create(userId: string, createDto: CreateTransactionDto) {
    // Verificar se conta pertence ao usuário
    const account = await this.prisma.account.findFirst({
      where: { id: createDto.accountId, userId },
    });

    if (!account) {
      throw new NotFoundException('Conta não encontrada');
    }

    // Criar transação
    const transaction = await this.prisma.transaction.create({
      data: {
        ...createDto,
        userId,
      },
      include: {
        account: {
          select: {
            name: true,
            bankName: true,
          },
        },
      },
    });

    // Atualizar saldo da conta
    await this.updateAccountBalance(createDto.accountId);

    return transaction;
  }

  async findAll(userId: string, filterDto: FilterTransactionDto) {
    const {
      page = 1,
      limit = 20,
      accountId,
      fiscalType,
      startDate,
      endDate,
    } = filterDto;

    const where: any = { userId };

    if (accountId) {
      where.accountId = accountId;
    }

    if (fiscalType) {
      where.fiscalType = fiscalType;
    }

    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = new Date(startDate);
      if (endDate) where.date.lte = new Date(endDate);
    }

    const [transactions, total] = await Promise.all([
      this.prisma.transaction.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: { date: 'desc' },
        include: {
          account: {
            select: {
              name: true,
              bankName: true,
            },
          },
        },
      }),
      this.prisma.transaction.count({ where }),
    ]);

    return {
      data: transactions,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string, userId: string) {
    const transaction = await this.prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        account: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException('Transação não encontrada');
    }

    return transaction;
  }

  async update(
    id: string,
    userId: string,
    updateDto: UpdateTransactionDto,
  ) {
    // Verificar se transação pertence ao usuário
    await this.findOne(id, userId);

    const transaction = await this.prisma.transaction.update({
      where: { id },
      data: {
        ...updateDto,
        userConfirmed: true,
        editedByUserAt: new Date(),
      },
      include: {
        account: true,
      },
    });

    // Recalcular saldo se valor ou tipo mudou
    if (updateDto.amount || updateDto.type) {
      await this.updateAccountBalance(transaction.accountId);
    }

    return transaction;
  }

  async remove(id: string, userId: string) {
    const transaction = await this.findOne(id, userId);

    await this.prisma.transaction.delete({
      where: { id },
    });

    // Recalcular saldo
    await this.updateAccountBalance(transaction.accountId);

    return { message: 'Transação removida com sucesso' };
  }

  async getMonthlySummary(userId: string, year: number, month: number) {
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0, 23, 59, 59);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    const summary = transactions.reduce(
      (acc, t) => {
        if (t.type === 'CREDITO') {
          acc.totalIncome += Number(t.amount);
        } else {
          acc.totalExpense += Number(t.amount);
        }

        if (t.fiscalType === 'TRIBUTAVEL') {
          acc.taxableIncome += Number(t.amount);
        } else if (t.fiscalType === 'DEDUTIVEL') {
          acc.deductions += Number(t.amount);
        }

        return acc;
      },
      {
        totalIncome: 0,
        totalExpense: 0,
        taxableIncome: 0,
        deductions: 0,
        balance: 0,
      },
    );

    summary.balance = summary.totalIncome - summary.totalExpense;

    return summary;
  }

  private async updateAccountBalance(accountId: string) {
    const account = await this.prisma.account.findUnique({
      where: { id: accountId },
      include: {
        transactions: true,
      },
    });

    const balance = account.transactions.reduce((acc, t) => {
      if (t.type === 'CREDITO') {
        return acc + Number(t.amount);
      } else {
        return acc - Number(t.amount);
      }
    }, Number(account.initialBalance));

    await this.prisma.account.update({
      where: { id: accountId },
      data: { currentBalance: balance },
    });
  }
}
```

#### dto/create-transaction.dto.ts
```typescript
import {
  IsDate,
  IsDecimal,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import {
  TransactionType,
  FiscalType,
  UserContext,
  InputSource,
} from '@prisma/client';

export class CreateTransactionDto {
  @ApiProperty({ example: '2026-01-15' })
  @Type(() => Date)
  @IsDate()
  date: Date;

  @ApiProperty({ example: 1500.50 })
  @Transform(({ value }) => parseFloat(value))
  @Min(0.01)
  amount: number;

  @ApiProperty({ enum: TransactionType })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ example: 'Salário janeiro' })
  @IsString()
  description: string;

  @ApiProperty({ example: 'Renda', required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ enum: FiscalType })
  @IsEnum(FiscalType)
  fiscalType: FiscalType;

  @ApiProperty({ enum: UserContext })
  @IsEnum(UserContext)
  userContext: UserContext;

  @ApiProperty({ enum: InputSource })
  @IsEnum(InputSource)
  inputSource: InputSource;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  originalInput?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  documentUrl?: string;

  @ApiProperty()
  @IsUUID()
  accountId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @Transform(({ value }) => parseFloat(value))
  @Min(0)
  aiConfidenceScore?: number;

  @ApiProperty({ enum: FiscalType, required: false })
  @IsOptional()
  @IsEnum(FiscalType)
  aiSuggestedFiscalType?: FiscalType;
}
```

### 7.4 Processamento Assíncrono (OCR/Voice)

#### processing/processors/ocr.processor.ts
```typescript
import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import { OcrService } from '../services/ocr.service';
import { TransactionsService } from '../../transactions/transactions.service';

@Processor('ocr')
export class OcrProcessor {
  constructor(
    private ocrService: OcrService,
    private transactionsService: TransactionsService,
  ) {}

  @Process('extract-document')
  async handleOcrExtraction(job: Job) {
    const { userId, fileUrl, accountId } = job.data;

    try {
      // Extrair texto da imagem
      const extractedText = await this.ocrService.extractText(fileUrl);

      // Processar texto e extrair dados estruturados
      const transactionData = await this.ocrService.parseTransactionData(
        extractedText,
      );

      // Criar transação automaticamente (ou retornar para confirmação)
      const transaction = await this.transactionsService.create(userId, {
        ...transactionData,
        accountId,
        inputSource: 'FOTO',
        documentUrl: fileUrl,
        originalInput: extractedText,
      });

      return { success: true, transaction };
    } catch (error) {
      throw new Error(`OCR processing failed: ${error.message}`);
    }
  }
}
```

#### processing/services/ocr.service.ts
```typescript
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OcrService {
  constructor(private configService: ConfigService) {}

  async extractText(imageUrl: string): Promise<string> {
    // Exemplo com Google Cloud Vision API
    const apiKey = this.configService.get('GOOGLE_CLOUD_VISION_API_KEY');
    
    const response = await axios.post(
      `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
      {
        requests: [
          {
            image: { source: { imageUri: imageUrl } },
            features: [{ type: 'TEXT_DETECTION' }],
          },
        ],
      },
    );

    const textAnnotations = response.data.responses[0]?.textAnnotations;
    return textAnnotations?.[0]?.description || '';
  }

  async parseTransactionData(text: string): Promise<any> {
    // Usar IA para extrair dados estruturados
    // Exemplo simplificado - em produção, usar GPT-4 ou Claude
    
    const amountMatch = text.match(/R\$\s*([\d.,]+)/);
    const amount = amountMatch
      ? parseFloat(amountMatch[1].replace(',', '.'))
      : 0;

    return {
      amount,
      description: text.substring(0, 100),
      date: new Date(),
      type: 'DEBITO',
      fiscalType: 'NAO_CLASSIFICADO',
      userContext: 'PF',
      aiConfidenceScore: 0.7,
    };
  }
}
```

---

## 8. Desenvolvimento Mobile

### 8.1 Configuração da API Client

#### src/services/api.ts
```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para adicionar token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('@fiscal_app:access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Interceptor para refresh token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await AsyncStorage.getItem(
          '@fiscal_app:refresh_token',
        );

        const response = await axios.post(`${API_URL}/auth/refresh`, null, {
          headers: { Authorization: `Bearer ${refreshToken}` },
        });

        const { accessToken, refreshToken: newRefreshToken } = response.data;

        await AsyncStorage.setItem('@fiscal_app:access_token', accessToken);
        await AsyncStorage.setItem(
          '@fiscal_app:refresh_token',
          newRefreshToken,
        );

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Logout se refresh falhar
        await AsyncStorage.multiRemove([
          '@fiscal_app:access_token',
          '@fiscal_app:refresh_token',
          '@fiscal_app:user',
        ]);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);

export default api;
```

#### src/services/auth.service.ts
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from './api';

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData extends LoginData {
  name: string;
  phone?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
}

class AuthService {
  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    await this.saveTokens(response.data);
    return response.data;
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    await this.saveTokens(response.data);
    return response.data;
  }

  async logout(): Promise<void> {
    await AsyncStorage.multiRemove([
      '@fiscal_app:access_token',
      '@fiscal_app:refresh_token',
      '@fiscal_app:user',
    ]);
  }

  async getUser() {
    const userJson = await AsyncStorage.getItem('@fiscal_app:user');
    return userJson ? JSON.parse(userJson) : null;
  }

  async isAuthenticated(): Promise<boolean> {
    const token = await AsyncStorage.getItem('@fiscal_app:access_token');
    return !!token;
  }

  private async saveTokens(authResponse: AuthResponse): Promise<void> {
    await AsyncStorage.setItem(
      '@fiscal_app:access_token',
      authResponse.accessToken,
    );
    await AsyncStorage.setItem(
      '@fiscal_app:refresh_token',
      authResponse.refreshToken,
    );
    await AsyncStorage.setItem(
      '@fiscal_app:user',
      JSON.stringify(authResponse.user),
    );
  }
}

export default new AuthService();
```

### 8.2 Context de Autenticação

#### src/context/AuthContext.tsx
```typescript
import React, { createContext, useState, useContext, useEffect } from 'react';
import authService, { AuthResponse } from '../services/auth.service';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthContextData {
  user: User | null;
  loading: boolean;
  signIn(email: string, password: string): Promise<void>;
  signUp(name: string, email: string, password: string): Promise<void>;
  signOut(): Promise<void>;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      const storedUser = await authService.getUser();
      if (storedUser) {
        setUser(storedUser);
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  }

  async function signIn(email: string, password: string) {
    try {
      const response = await authService.login({ email, password });
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  }

  async function signUp(name: string, email: string, password: string) {
    try {
      const response = await authService.register({ name, email, password });
      setUser(response.user);
    } catch (error) {
      throw error;
    }
  }

  async function signOut() {
    await authService.logout();
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

### 8.3 Navegação

#### src/navigation/AppNavigator.tsx
```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { ActivityIndicator, View } from 'react-native';

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
```

#### src/navigation/AuthNavigator.tsx
```typescript
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />
    </Stack.Navigator>
  );
}
```

#### src/navigation/MainNavigator.tsx
```typescript
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import DashboardScreen from '../screens/dashboard/DashboardScreen';
import TransactionListScreen from '../screens/transactions/TransactionListScreen';
import AccountsScreen from '../screens/accounts/AccountsScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import AddTransactionScreen from '../screens/transactions/AddTransactionScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function DashboardStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
      <Stack.Screen name="AddTransaction" component={AddTransactionScreen} />
    </Stack.Navigator>
  );
}

export default function MainNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Dashboard" component={DashboardStack} />
      <Tab.Screen name="Transactions" component={TransactionListScreen} />
      <Tab.Screen name="Accounts" component={AccountsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

### 8.4 Telas Principais

#### src/screens/auth/LoginScreen.tsx
```typescript
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';

export default function LoginScreen({ navigation }: any) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert('Erro', 'Preencha todos os campos');
      return;
    }

    try {
      setLoading(true);
      await signIn(email, password);
    } catch (error: any) {
      Alert.alert('Erro', error.response?.data?.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo de volta</Text>
      <Text style={styles.subtitle}>
        A Receita já sabe. Você também deveria.
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Entrando...' : 'Entrar'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Não tem conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 32,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  link: {
    textAlign: 'center',
    color: '#007AFF',
    marginTop: 16,
  },
});
```

#### src/screens/dashboard/DashboardScreen.tsx
```typescript
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import api from '../../services/api';

export default function DashboardScreen({ navigation }: any) {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);

  useEffect(() => {
    loadSummary();
  }, []);

  async function loadSummary() {
    try {
      const now = new Date();
      const response = await api.get(
        `/transactions/summary/${now.getFullYear()}/${now.getMonth() + 1}`,
      );
      setSummary(response.data);
    } catch (error) {
      console.error('Error loading summary:', error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Dashboard</Text>

      <View style={styles.summaryCard}>
        <Text style={styles.cardTitle}>Resumo do Mês</Text>
        
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Receitas:</Text>
          <Text style={styles.summaryValue}>
            R$ {summary?.totalIncome?.toFixed(2) || '0.00'}
          </Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Despesas:</Text>
          <Text style={[styles.summaryValue, styles.expense]}>
            R$ {summary?.totalExpense?.toFixed(2) || '0.00'}
          </Text>
        </View>

        <View style={[styles.summaryRow, styles.balanceRow]}>
          <Text style={styles.balanceLabel}>Saldo:</Text>
          <Text style={[styles.balanceValue, summary?.balance >= 0 && styles.positive]}>
            R$ {summary?.balance?.toFixed(2) || '0.00'}
          </Text>
        </View>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddTransaction', { mode: 'voice' })}
        >
          <Text style={styles.actionIcon}>🎤</Text>
          <Text style={styles.actionText}>Por voz</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddTransaction', { mode: 'photo' })}
        >
          <Text style={styles.actionIcon}>📸</Text>
          <Text style={styles.actionText}>Tirar foto</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => navigation.navigate('AddTransaction', { mode: 'manual' })}
        >
          <Text style={styles.actionIcon}>✍️</Text>
          <Text style={styles.actionText}>Manual</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    padding: 20,
    paddingBottom: 10,
  },
  summaryCard: {
    backgroundColor: '#fff',
    margin: 20,
    marginTop: 10,
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#666',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  expense: {
    color: '#ff3b30',
  },
  balanceRow: {
    borderTopWidth: 1,
    borderTopColor: '#eee',
    marginTop: 8,
    paddingTop: 16,
  },
  balanceLabel: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  balanceValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ff3b30',
  },
  positive: {
    color: '#34c759',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
  },
  actionButton: {
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    flex: 1,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
```

---

## 9. Integrações com IA

### 9.1 Google Cloud Vision (OCR)

```bash
# Criar conta e habilitar API
# https://console.cloud.google.com/
# APIs & Services > Enable APIs > Cloud Vision API
# Credentials > Create API Key
```

#### Exemplo de uso
```typescript
import axios from 'axios';

export async function extractTextFromImage(imageBase64: string): Promise<string> {
  const apiKey = process.env.GOOGLE_CLOUD_VISION_API_KEY;
  
  const response = await axios.post(
    `https://vision.googleapis.com/v1/images:annotate?key=${apiKey}`,
    {
      requests: [
        {
          image: { content: imageBase64 },
          features: [{ type: 'DOCUMENT_TEXT_DETECTION' }],
        },
      ],
    },
  );

  return response.data.responses[0]?.fullTextAnnotation?.text || '';
}
```

### 9.2 OpenAI Whisper (Speech-to-Text)

```bash
# Criar conta OpenAI
# https://platform.openai.com/
# API Keys > Create new secret key
```

#### Exemplo de uso
```typescript
import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function transcribeAudio(audioPath: string): Promise<string> {
  const transcription = await openai.audio.transcriptions.create({
    file: fs.createReadStream(audioPath),
    model: 'whisper-1',
    language: 'pt',
  });

  return transcription.text;
}
```

### 9.3 Classificação Fiscal com GPT-4

```typescript
export async function classifyTransaction(
  description: string,
  amount: number,
  userContext: 'PF' | 'AUTONOMO',
): Promise<{
  fiscalType: string;
  confidence: number;
  reasoning: string;
}> {
  const prompt = `
Você é um especialista em tributação brasileira. Classifique a seguinte transação:

Descrição: ${description}
Valor: R$ ${amount}
Contexto: ${userContext === 'PF' ? 'Pessoa Física' : 'Autônomo'}

Classifique como:
- TRIBUTAVEL: Renda tributável (salário, aluguel recebido, etc.)
- ISENTO: Isento de imposto (poupança, herança, etc.)
- DEDUTIVEL: Despesa dedutível (educação, saúde, etc.)
- NEUTRO: Transferências internas, investimentos

Responda APENAS em JSON:
{
  "fiscalType": "...",
  "confidence": 0.0-1.0,
  "reasoning": "Explicação breve"
}
  `.trim();

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.3,
  });

  const result = JSON.parse(response.choices[0].message.content);
  return result;
}
```

---

## 10. User Journeys

(Já detalhado anteriormente na seção de User Journeys)

---

## 11. Roadmap de 8 Semanas

(Já detalhado anteriormente no artefact de Roadmap)

---

## 12. Segurança e Compliance

### 12.1 Checklist de Segurança

#### Backend
- ✅ HTTPS obrigatório em produção
- ✅ JWT com expiração curta (15min)
- ✅ Refresh token com rotação
- ✅ Passwords hasheados com bcrypt (salt rounds >= 10)
- ✅ Rate limiting (express-rate-limit)
- ✅ Helmet.js para headers de segurança
- ✅ CORS configurado corretamente
- ✅ Validação de inputs (class-validator)
- ✅ Sanitização contra SQL injection (Prisma ORM)
- ✅ Sanitização contra XSS

#### Mobile
- ✅ Armazenamento seguro (AsyncStorage criptografado)
- ✅ Nunca logar dados sensíveis
- ✅ Timeout de sessão
- ✅ Validação de certificados SSL

### 12.2 LGPD Compliance

#### Dados coletados
- Nome, email, telefone
- CPF (criptografado)
- Transações financeiras
- Documentos (notas fiscais, comprovantes)

#### Obrigações
1. **Termo de Consentimento** claro no cadastro
2. **Política de Privacidade** acessível
3. **Direito ao esquecimento**: endpoint para deletar conta
4. **Portabilidade**: exportar dados em JSON
5. **Minimização**: coletar apenas o necessário

#### Implementação
```typescript
// Deletar conta (LGPD - direito ao esquecimento)
async deleteAccount(userId: string) {
  // Anonimizar em vez de deletar (para histórico fiscal)
  await this.prisma.user.update({
    where: { id: userId },
    data: {
      email: `deleted_${userId}@anonymized.com`,
      name: 'Usuário Removido',
      cpf: null,
      phone: null,
      passwordHash: 'DELETED',
    },
  });
}

// Exportar dados
async exportUserData(userId: string) {
  const user = await this.prisma.user.findUnique({
    where: { id: userId },
    include: {
      accounts: true,
      transactions: true,
      assets: true,
    },
  });

  return JSON.stringify(user, null, 2);
}
```

### 12.3 Disclaimers Obrigatórios

Em todas as simulações e classificações:

> ⚠️ **Aviso Legal**: Este aplicativo fornece apenas estimativas educativas. Não substitui a orientação de um contador ou advogado tributarista. Para declarações oficiais, consulte um profissional habilitado.

---

## 13. Testes

### 13.1 Testes Unitários (Backend)

```bash
npm install --save-dev @nestjs/testing jest ts-jest @types/jest
```

#### Exemplo: auth.service.spec.ts
```typescript
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: {
            findByEmail: jest.fn(),
            create: jest.fn(),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should return tokens when credentials are valid', async () => {
      const mockUser = {
        id: '1',
        email: 'test@test.com',
        passwordHash: '$2b$10$hashedpassword',
        name: 'Test User',
      };

      jest.spyOn(usersService, 'findByEmail').mockResolvedValue(mockUser as any);
      jest.spyOn(service as any, 'generateTokens').mockResolvedValue({
        accessToken: 'token',
        refreshToken: 'refresh',
      });

      const result = await service.login({
        email: 'test@test.com',
        password: 'password123',
      });

      expect(result).toHaveProperty('accessToken');
      expect(result).toHaveProperty('refreshToken');
    });
  });
});
```

### 13.2 Testes E2E

```typescript
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Auth (e2e)', () => {
  let app;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/auth/register (POST)', () => {
    return request(app.getHttpServer())
      .post('/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
      .expect(201)
      .expect((res) => {
        expect(res.body).toHaveProperty('accessToken');
        expect(res.body.user.email).toBe('test@example.com');
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
```

---

## 14. Deploy

### 14.1 Deploy Backend (Railway/Heroku)

#### Railway
```bash
# Instalar CLI
npm install -g @railway/cli

# Login
railway login

# Criar projeto
railway init

# Deploy
railway up
```

#### Variáveis de ambiente no Railway
```
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
JWT_SECRET=...
OPENAI_API_KEY=...
NODE_ENV=production
```

### 14.2 Deploy Mobile (Expo EAS)

```bash
# Instalar EAS CLI
npm install -g eas-cli

# Login
eas login

# Configurar projeto
eas build:configure

# Build para Android
eas build --platform android

# Build para iOS (requer conta Apple Developer)
eas build --platform ios

# Submeter para lojas
eas submit -p android
eas submit -p ios
```

---

## 15. O Que NÃO Entra no MVP

✖️ Integração Open Finance (bancário)  
✖️ Multi-usuário / Família  
✖️ Exportação DIRPF oficial  
✖️ Painel contador (B2B)  
✖️ App web completo  
✖️ Notificações push  
✖️ Backup Google Drive/iCloud  

**Motivo**: Complexidade alta, risco jurídico, ou não essencial para validação.

---

## 16. Custos e Recursos

### 16.1 Custos Mensais (MVP)

| Item | Custo Mensal | Observação |
|------|--------------|------------|
| **Servidor Backend** | R$ 50-100 | Railway/Heroku/DigitalOcean |
| **Banco de Dados** | R$ 0-50 | Supabase/Railway (free tier) |
| **Redis** | R$ 0-30 | Upstash (free tier + paid) |
| **OpenAI API** | R$ 100-200 | GPT-4 + Whisper |
| **Google Cloud Vision** | R$ 50-100 | OCR |
| **Storage (S3)** | R$ 10-30 | AWS/DigitalOcean Spaces |
| **Domínio** | R$ 40/ano | .com.br |
| **Total** | **R$ 210-510** | Durante desenvolvimento |

### 16.2 Ferramentas Gratuitas

- ✅ GitHub (repositório)
- ✅ VS Code (IDE)
- ✅ Expo Go (teste mobile)
- ✅ Prisma Studio (DB GUI)
- ✅ Thunder Client (API testing)
### 16.2 Ferramentas Gratuitas

- ✅ GitHub (repositório)
- ✅ VS Code (IDE)
- ✅ Expo Go (teste mobile)
- ✅ Prisma Studio (DB GUI)
- ✅ Thunder Client (API testing)
- ✅ Postman (alternativa)

---

## 17. Referências e Links Úteis

### 17.1 Documentação Oficial

- **NestJS**: https://docs.nestjs.com/
- **Prisma**: https://www.prisma.io/docs
- **React Native**: https://reactnative.dev/
- **Expo**: https://docs.expo.dev/
- **React Navigation**: https://reactnavigation.org/

### 17.2 APIs de IA

- **OpenAI**: https://platform.openai.com/docs
- **Google Cloud Vision**: https://cloud.google.com/vision/docs
- **Anthropic Claude**: https://docs.anthropic.com/

### 17.3 Recursos Fiscais

- **Receita Federal**: https://www.gov.br/receitafederal/
- **IN 2.278/2025**: Buscar no site da RFB
- **Tabela IRPF 2025**: https://www.gov.br/receitafederal/

### 17.4 Comunidades

- **Stack Overflow**: https://stackoverflow.com/
- **Reddit r/reactnative**: https://reddit.com/r/reactnative
- **NestJS Discord**: https://discord.gg/nestjs

---

## Apêndice A: Comandos Úteis

### Backend (NestJS)

```bash
# Desenvolvimento
npm run start:dev

# Build
npm run build

# Testes
npm run test
npm run test:e2e
npm run test:cov

# Prisma
npx prisma migrate dev --name nome_da_migration
npx prisma generate
npx prisma studio
npx prisma db seed

# Docker
docker-compose up -d
docker-compose down
docker-compose logs -f
```

### Mobile (Expo)

```bash
# Desenvolvimento
npx expo start

# Limpar cache
npx expo start -c

# Build
eas build --platform android
eas build --platform ios

# Submeter
eas submit -p android

# Atualizar
eas update
```

---

## Apêndice B: Scripts Úteis

### package.json (Backend)

```json
{
  "scripts": {
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    "build": "nest build",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:cov": "jest --coverage",
    "test:e2e": "jest --config ./test/jest-e2e.json",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio",
    "prisma:seed": "ts-node prisma/seed.ts"
  }
}
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: fiscal-postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: fiscal_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: fiscal-redis
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data

  adminer:
    image: adminer
    container_name: fiscal-adminer
    restart: always
    ports:
      - "8080:8080"
    depends_on:
      - postgres

volumes:
  postgres_data:
  redis_data:
```

---

## Apêndice C: Exemplos de Código Adicionais

### Hook useTransactions (Mobile)

```typescript
import { useState, useEffect } from 'react';
import { transactionsService } from '../services/transactions.service';

export function useTransactions(accountId?: string) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadTransactions();
  }, [accountId]);

  async function loadTransactions() {
    try {
      setLoading(true);
      const data = await transactionsService.getAll({ accountId });
      setTransactions(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }

  async function createTransaction(data: any) {
    const newTransaction = await transactionsService.create(data);
    setTransactions([newTransaction, ...transactions]);
    return newTransaction;
  }

  async function updateTransaction(id: string, data: any) {
    const updated = await transactionsService.update(id, data);
    setTransactions(
      transactions.map((t) => (t.id === id ? updated : t))
    );
    return updated;
  }

  async function deleteTransaction(id: string) {
    await transactionsService.delete(id);
    setTransactions(transactions.filter((t) => t.id !== id));
  }

  return {
    transactions,
    loading,
    error,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    refresh: loadTransactions,
  };
}
```

### Componente CurrencyInput (Mobile)

```typescript
import React from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface CurrencyInputProps extends TextInputProps {
  onValueChange: (value: number) => void;
}

export function CurrencyInput({ onValueChange, ...props }: CurrencyInputProps) {
  const [displayValue, setDisplayValue] = React.useState('');

  function handleChange(text: string) {
    // Remove tudo exceto números
    const numbers = text.replace(/[^0-9]/g, '');
    
    // Converte para centavos
    const cents = parseInt(numbers || '0');
    const reais = cents / 100;
    
    // Formata para exibição
    const formatted = new Intl.NumberFormat('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(reais);
    
    setDisplayValue(formatted);
    onValueChange(reais);
  }

  return (
    <TextInput
      {...props}
      value={displayValue}
      onChangeText={handleChange}
      keyboardType="numeric"
      placeholder="0,00"
    />
  );
}
```

---

## Apêndice D: Checklist de Go-Live

### Antes do lançamento

#### Backend
- [ ] Todas as variáveis de ambiente configuradas
- [ ] HTTPS configurado
- [ ] Rate limiting ativado
- [ ] Logs estruturados implementados
- [ ] Monitoramento básico (Sentry/LogRocket)
- [ ] Backup automatizado do banco
- [ ] Testes passando
- [ ] Documentação API (Swagger) atualizada

#### Mobile
- [ ] Ícones e splash screen finalizados
- [ ] Permissões de câmera/microfone configuradas
- [ ] Deep linking configurado
- [ ] Analytics básico (Amplitude/Mixpanel)
- [ ] Crash reporting (Sentry)
- [ ] Testes em dispositivos reais
- [ ] App store assets preparados

#### Legal
- [ ] Termos de Uso revisados
- [ ] Política de Privacidade completa
- [ ] Disclaimers em todas simulações
- [ ] LGPD compliance verificado

#### Marketing
- [ ] Landing page no ar
- [ ] Links de download prontos
- [ ] Material de divulgação preparado

---

## Conclusão

Este documento fornece uma base sólida para iniciar o desenvolvimento do MVP em 8 semanas. Lembre-se:

1. **Foco no core**: Transações + Classificação + Multi-conta
2. **IA para reduzir fricção**: Voz, foto, classificação automática
3. **Educação, não substituição**: Sempre disclaimers claros
4. **Iteração rápida**: Entregas semanais funcionais
5. **Segurança em primeiro lugar**: LGPD, criptografia, JWT

### Próximos Passos Imediatos

1. Setup do ambiente (Seção 5)
2. Criar repositório Git
3. Iniciar Semana 1 do roadmap
4. Daily commits no GitHub
5. Testar continuamente

**Boa sorte no desenvolvimento! 🚀**

---

*Documentação criada em Janeiro de 2026*  
*Versão 1.0 - MVP*