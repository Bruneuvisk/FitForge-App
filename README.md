# 🔥 FitForge

**Transforme seu corpo com IA**

FitForge é uma plataforma completa de acompanhamento fitness que usa inteligência artificial para criar treinos e dietas personalizados, com suporte de treinadores profissionais.

![FitForge](https://img.shields.io/badge/Status-Produção-success)
![React](https://img.shields.io/badge/React-18.3-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5-blue)
![Supabase](https://img.shields.io/badge/Supabase-2.57-green)

---

## 📋 Índice

- [Funcionalidades](#-funcionalidades)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Como Usar](#-como-usar)
- [Estrutura do Projeto](#-estrutura-do-projeto)
- [Banco de Dados](#-banco-de-dados)
- [Edge Functions (IA)](#-edge-functions-ia)

---

## ✨ Funcionalidades

### Para Treinadores 👨‍🏫
- ✅ **Gerenciamento de Clientes**: Adicione e acompanhe múltiplos clientes
- 🤖 **Geração de Treinos com IA**: Crie planos de treino personalizados automaticamente
- 🍽️ **Geração de Dietas com IA**: Crie planos alimentares com cálculo de macros
- 📊 **Acompanhamento**: Visualize progresso e métricas dos clientes
- ⚙️ **Personalização**: Ajuste treinos e dietas conforme necessário

### Para Clientes 💪
- 📱 **Dashboard Personalizado**: Acesse todos os seus dados em um lugar
- 🏋️ **Treinos Detalhados**: Veja exercícios, séries, repetições e orientações
- 🥗 **Plano Alimentar**: Acesse receitas, ingredientes e valores nutricionais
- 📈 **Acompanhamento de Progresso**: Veja sua evolução de peso e medidas
- 🎯 **Objetivos Claros**: Acompanhe seu progresso em direção às metas

### IA Inteligente 🧠
- **Treinos Personalizados** baseados em:
  - Objetivo (perder peso, ganhar massa, resistência, manutenção)
  - Nível de atividade física
  - Condições médicas e limitações
  - Equipamentos disponíveis

- **Dietas Calculadas** com:
  - Cálculo de TMB (Taxa Metabólica Basal)
  - Ajuste por nível de atividade
  - Distribuição de macronutrientes
  - Consideração de restrições alimentares

---

## 🚀 Tecnologias

### Frontend
- **React 18.3** - Biblioteca UI
- **TypeScript 5.5** - Tipagem estática
- **Vite 5.4** - Build tool ultrarrápido
- **Tailwind CSS 3.4** - Framework CSS utilitário
- **Lucide React** - Ícones modernos

### Backend & Database
- **Supabase** - Backend-as-a-Service
  - PostgreSQL - Banco de dados relacional
  - Row Level Security (RLS) - Segurança avançada
  - Authentication - Sistema de autenticação completo
  - Edge Functions - Serverless functions

### Segurança
- ✅ Autenticação JWT
- ✅ Row Level Security (RLS)
- ✅ Políticas de acesso por role
- ✅ Validação de dados

---

## 📦 Pré-requisitos

- Node.js 18+
- npm ou yarn
- Conta no Supabase (gratuita)

---

## 🔧 Instalação

1. **Clone o repositório**
```bash
git clone <seu-repositorio>
cd fitforge
```

2. **Instale as dependências**
```bash
npm install
```

3. **Configure as variáveis de ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
```

4. **Execute o projeto**
```bash
npm run dev
```

O projeto estará disponível em `http://localhost:5173`

---

## ⚙️ Configuração

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta (se necessário)
3. Clique em "New Project"
4. Preencha os dados e aguarde a criação

### 2. Obter Credenciais

No dashboard do Supabase:
1. Vá em **Settings** → **API**
2. Copie a **Project URL** → Cole em `VITE_SUPABASE_URL`
3. Copie a **anon public key** → Cole em `VITE_SUPABASE_ANON_KEY`

### 3. Executar Migrations

As migrations do banco de dados já foram aplicadas. O schema inclui:
- ✅ Tabela de perfis (profiles)
- ✅ Tabela de clientes (clients)
- ✅ Tabela de medições (measurements)
- ✅ Tabela de treinos (workouts) e exercícios (exercises)
- ✅ Tabela de planos alimentares (meal_plans) e refeições (meals)
- ✅ Políticas RLS configuradas

### 4. Edge Functions

As Edge Functions de IA já estão implantadas:
- ✅ `generate-workout` - Gera treinos personalizados
- ✅ `generate-meal-plan` - Gera dietas personalizadas

---

## 📖 Como Usar

### Para Treinadores

#### 1. Criar Conta de Treinador
1. Acesse a página inicial
2. Clique em "Começar agora"
3. Selecione **"Treinador"**
4. Preencha seus dados e crie a conta

#### 2. Adicionar Cliente
1. No dashboard, clique em **"Adicionar Cliente"**
2. Preencha os dados do cliente:
   - **Pessoais**: Nome, email, senha, data de nascimento
   - **Físicos**: Altura, peso atual, peso meta
   - **Objetivos**: Objetivo fitness e nível de atividade
   - **Observações**: Condições médicas e restrições alimentares
3. Clique em **"Adicionar Cliente"**

#### 3. Gerar Treino com IA
1. Clique no cliente na lista
2. Clique no card verde **"Gerar Treino com IA"**
3. A IA cria automaticamente:
   - Plano de treino específico para o objetivo
   - Exercícios organizados por dia da semana
   - Séries, repetições e tempo de descanso
   - Notas e orientações técnicas
4. O cliente já pode visualizar no painel dele

#### 4. Gerar Dieta com IA
1. No painel do cliente, clique no card laranja **"Gerar Dieta com IA"**
2. A IA cria automaticamente:
   - Cálculo de calorias diárias
   - Distribuição de macronutrientes
   - 5 refeições completas (café, lanche, almoço, lanche, jantar)
   - Ingredientes e modo de preparo
3. O cliente já pode visualizar no painel dele

### Para Clientes

#### 1. Acessar Conta
1. Seu treinador criará sua conta
2. Use email e senha fornecidos para fazer login
3. Selecione **"Cliente"** no tipo de conta

#### 2. Visualizar Treino
1. No dashboard, clique em **"Meu Treino"**
2. Selecione o dia da semana
3. Veja todos os exercícios com:
   - Nome do exercício
   - Séries e repetições
   - Tempo de descanso
   - Notas do treinador

#### 3. Visualizar Dieta
1. No dashboard, clique em **"Minha Dieta"**
2. Veja todas as refeições do dia
3. Para cada refeição:
   - Nome e descrição
   - Calorias e macros
   - Lista de ingredientes
   - Modo de preparo

#### 4. Acompanhar Progresso
1. Clique em **"Minhas Medidas"**
2. Veja seu histórico de:
   - Peso corporal
   - Percentual de gordura
   - Medidas corporais (peito, cintura, quadril, etc)
   - IMC calculado automaticamente

---

## 📁 Estrutura do Projeto

```
fitforge/
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx          # Formulário de login
│   │   │   └── SignupForm.tsx         # Formulário de cadastro
│   │   ├── trainer/
│   │   │   ├── AddClientModal.tsx     # Modal adicionar cliente
│   │   │   ├── ClientDetails.tsx      # Detalhes do cliente
│   │   │   ├── GenerateWorkoutModal.tsx    # Modal gerar treino
│   │   │   └── GenerateMealPlanModal.tsx   # Modal gerar dieta
│   │   ├── client/
│   │   │   ├── WorkoutView.tsx        # Visualização de treino
│   │   │   ├── MealPlanView.tsx       # Visualização de dieta
│   │   │   └── ProgressView.tsx       # Progresso e medidas
│   │   ├── ClientDashboard.tsx        # Dashboard do cliente
│   │   ├── TrainerDashboard.tsx       # Dashboard do treinador
│   │   ├── LandingPage.tsx            # Página inicial
│   │   └── Logo.tsx                   # Componente do logo
│   ├── context/
│   │   └── AuthContext.tsx            # Contexto de autenticação
│   ├── lib/
│   │   └── supabase.ts                # Cliente Supabase
│   ├── types/
│   │   └── database.ts                # Tipos do banco de dados
│   ├── App.tsx                        # Componente principal
│   ├── main.tsx                       # Entry point
│   └── index.css                      # Estilos globais
├── supabase/
│   └── functions/
│       ├── generate-workout/          # Edge Function treinos
│       │   └── index.ts
│       └── generate-meal-plan/        # Edge Function dietas
│           └── index.ts
├── .env                               # Variáveis de ambiente
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🗄️ Banco de Dados

### Schema Principal

#### profiles
- Armazena dados de usuários (treinadores e clientes)
- Campos: id, role, full_name, email, avatar_url

#### clients
- Dados completos dos clientes
- Campos: peso, altura, objetivos, nível de atividade, restrições

#### measurements
- Histórico de medições corporais
- Campos: peso, % gordura, medidas corporais

#### workouts & exercises
- Planos de treino e exercícios
- Campos: nome, descrição, exercícios por dia

#### meal_plans & meals
- Planos alimentares e refeições
- Campos: calorias, macros, ingredientes, preparo

### Segurança (RLS)

Todas as tabelas possuem Row Level Security ativado:
- ✅ Treinadores acessam apenas seus clientes
- ✅ Clientes acessam apenas seus próprios dados
- ✅ Políticas específicas por operação (SELECT, INSERT, UPDATE, DELETE)

---

## 🤖 Edge Functions (IA)

### generate-workout

**Entrada:**
```typescript
{
  clientId: string,
  trainerId: string,
  clientData: {
    weight: number,
    height: number,
    fitnessGoal: string,
    activityLevel: string,
    medicalConditions?: string
  }
}
```

**Saída:**
- Cria workout completo no banco
- Exercícios organizados por dia
- Séries, repetições e descanso
- Notas técnicas

### generate-meal-plan

**Entrada:**
```typescript
{
  clientId: string,
  trainerId: string,
  clientData: {
    weight: number,
    height: number,
    gender: string,
    fitnessGoal: string,
    activityLevel: string,
    dietaryRestrictions?: string
  }
}
```

**Saída:**
- Calcula calorias e macros
- Cria 5 refeições balanceadas
- Ingredientes e preparo
- Considera restrições

---

## 🎨 Design System

### Cores Principais
- **Emerald Green** (#10b981) - Primária, ações principais
- **Teal** (#14b8a6) - Secundária, gradientes
- **Orange** (#f97316) - Dietas e alimentação
- **Gray** (#6b7280) - Textos e backgrounds

### Tipografia
- **Font Family**: System fonts (sans-serif)
- **Tamanhos**:
  - Títulos: 2xl-4xl
  - Corpo: base-lg
  - Pequeno: sm-xs

### Componentes
- Botões com hover states
- Cards com shadow e hover
- Modals com overlay
- Forms com validação visual

---

## 🚢 Deploy

### Build de Produção
```bash
npm run build
```

### Preview
```bash
npm run preview
```

Os arquivos de build ficam em `dist/`

### Plataformas Recomendadas
- **Vercel** (recomendado)
- **Netlify**
- **Cloudflare Pages**

---

## 📝 Scripts Disponíveis

```bash
npm run dev        # Inicia servidor de desenvolvimento
npm run build      # Cria build de produção
npm run preview    # Preview do build
npm run lint       # Roda ESLint
npm run typecheck  # Verifica tipos TypeScript
```

---

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
1. Fork o projeto
2. Criar uma branch (`git checkout -b feature/NovaFuncionalidade`)
3. Commit suas mudanças (`git commit -m 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/NovaFuncionalidade`)
5. Abrir um Pull Request

---

## 📄 Licença

Este projeto está sob a licença MIT.

---

## 👨‍💻 Autor

Desenvolvido com 💚 usando React, TypeScript e Supabase

---

## 🆘 Suporte

Encontrou um bug? Tem uma sugestão?
- Abra uma issue no GitHub
- Entre em contato com o suporte

---

## 🎯 Roadmap

### Em Desenvolvimento
- [ ] Gráficos de evolução
- [ ] Edição manual de treinos
- [ ] Chat entre treinador e cliente
- [ ] Notificações push
- [ ] App mobile (React Native)

### Planejado
- [ ] Biblioteca de exercícios com vídeos
- [ ] Integração com wearables
- [ ] Planos de assinatura
- [ ] Marketplace de treinadores

---

**FitForge** - Forjando o corpo ideal através da tecnologia 🔥
