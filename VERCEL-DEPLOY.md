# 🚀 Deploy na Vercel - Gerador de Currículos

## 📋 Pré-requisitos

- [x] Projeto compila sem erros (`npm run build` ✅)
- [x] Conta no GitHub
- [x] Conta na Vercel (https://vercel.com)
- [x] Todas as variáveis de ambiente configuradas

## 🔧 Passo 1: Preparar Repositório GitHub

### 1.1 Inicializar Git (se ainda não fez)
```bash
git init
git add .
git commit -m "Initial commit - Gerador de Currículos com IA"
```

### 1.2 Criar Repositório no GitHub
1. Acesse: https://github.com/new
2. Nome: `ai-curriculum-generator`
3. Deixe público ou privado
4. NÃO inicialize com README
5. Clique em "Create repository"

### 1.3 Conectar ao GitHub
```bash
git remote add origin https://github.com/SEU_USUARIO/ai-curriculum-generator.git
git branch -M main
git push -u origin main
```

## 🌐 Passo 2: Deploy na Vercel

### 2.1 Acessar Vercel
1. Vá para: https://vercel.com
2. Faça login com GitHub
3. Clique em "New Project"

### 2.2 Importar Repositório
1. Selecione o repositório `ai-curriculum-generator`
2. Clique em "Import"
3. Framework Preset: **Next.js** (detectado automaticamente)
4. Clique em "Deploy"

### 2.3 Aguardar Deploy
- ⏱️ Primeiro deploy: ~2-3 minutos
- ✅ URL será gerada automaticamente (ex: `ai-curriculum-generator.vercel.app`)

## 🔧 Passo 3: Configurar Variáveis de Ambiente

### 3.1 Acessar Settings
1. No dashboard da Vercel, clique no projeto
2. Vá em "Settings" → "Environment Variables"

### 3.2 Adicionar Variáveis (uma por vez)

**Database (PostgreSQL na Vercel):**
```bash
# Vamos configurar depois
DATABASE_URL=postgresql://...
```

**NextAuth:**
```bash
NEXTAUTH_URL=https://SEU_PROJETO.vercel.app
NEXTAUTH_SECRET=super-secret-key-for-production
```

**Google OAuth:**
```bash
GOOGLE_CLIENT_ID=201518461106-il5ntfbu92f5tvtd2ki95a5obutdtve6.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=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
```

**OpenAI:**
```bash
OPENAI_API_KEY=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
```

**Stripe:**
```bash
STRIPE_PUBLISHABLE_KEY=pk_test_SUA_CHAVE_PUBLICA_AQUI
STRIPE_SECRET_KEY=sk_test_SUA_CHAVE_SECRETA_AQUI
STRIPE_WEBHOOK_SECRET=whsec_SERÁ_CONFIGURADO_DEPOIS
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_SEU_PRICE_ID_MENSAL
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_SEU_PRICE_ID_ANUAL
```

### 3.3 Redeploy
Após adicionar as variáveis:
1. Vá em "Deployments"
2. Clique nos "..." do último deploy
3. "Redeploy"

## 🗄️ Passo 4: Configurar Banco PostgreSQL

### 4.1 Criar Storage na Vercel
1. No projeto, vá em "Storage"
2. Clique em "Create Database"
3. Escolha "Postgres"
4. Nome: `curriculum-generator-db`
5. Clique em "Create"

### 4.2 Conectar ao Projeto
1. Selecione o projeto
2. Copie a string de conexão
3. Atualize `DATABASE_URL` nas env vars

### 4.3 Executar Migrations
```bash
# Localmente, com DATABASE_URL atualizada
npx prisma migrate deploy
```

## 🔗 Passo 5: Configurar Webhook do Stripe

### 5.1 Obter URL de Produção
- URL será: `https://SEU_PROJETO.vercel.app`

### 5.2 Configurar Webhook
1. Stripe Dashboard → Webhooks → Add endpoint
2. URL: `https://SEU_PROJETO.vercel.app/api/stripe/webhook`
3. Eventos: iguais aos de teste
4. Copiar webhook secret

### 5.3 Atualizar Variável
- Atualizar `STRIPE_WEBHOOK_SECRET` na Vercel
- Fazer redeploy

## ✅ Passo 6: Testar Deploy

### 6.1 Verificações
- [ ] Site carrega: `https://SEU_PROJETO.vercel.app`
- [ ] Página pricing: `https://SEU_PROJETO.vercel.app/pricing`
- [ ] Login funciona
- [ ] Dashboard funciona
- [ ] Pagamento funciona

### 6.2 Teste de Pagamento
1. Acessar `/pricing`
2. Fazer login
3. Tentar comprar plano
4. Usar cartão: `4242 4242 4242 4242`
5. Verificar se webhook funciona

## 🚨 Troubleshooting

### Erros Comuns:

**Build Error:**
- Verificar se todas as importações estão corretas
- Checar se todas as dependências estão no package.json

**Database Error:**
- Verificar string de conexão
- Executar migrations

**Stripe Error:**
- Verificar se webhook secret está correto
- Verificar se URL do webhook está certa

---

## 📞 Comandos Úteis

```bash
# Ver logs da Vercel
npx vercel logs

# Deploy manual
npx vercel --prod

# Ver env vars
npx vercel env ls
```

---

**🎯 Resultado Final**: Aplicação funcionando em produção com pagamentos Stripe totalmente operacionais!
