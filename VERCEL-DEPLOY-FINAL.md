# 🚀 Deploy na Vercel - Gerador de Currículos com IA

## ✅ Pré-requisitos Concluídos

- [x] Código commitado no Git
- [x] Build testado localmente  
- [x] Configuração do Stripe finalizada
- [x] Sistema de PDF funcionando

## 🌐 Deploy na Vercel

### 1. Acesso à Vercel
1. **Acesse**: https://vercel.com
2. **Login** com GitHub/GitLab/Bitbucket
3. **Import Project** → Selecione seu repositório

### 2. Configuração do Projeto
```bash
Framework Preset: Next.js
Root Directory: ./
Build Command: npm run build
Output Directory: .next
Install Command: npm install
```

### 3. Variáveis de Ambiente na Vercel

Na página de configuração do projeto, adicione:

```bash
# Database (use um PostgreSQL na nuvem)
DATABASE_URL="postgresql://user:password@host:port/database"

# NextAuth
NEXTAUTH_URL="https://seu-projeto.vercel.app"
NEXTAUTH_SECRET="seu-secret-super-seguro-aqui"

# Google OAuth  
GOOGLE_CLIENT_ID="sua-google-client-id"
GOOGLE_CLIENT_SECRET="sua-google-client-secret"

# OpenAI
OPENAI_API_KEY="sk-proj-sua-chave-openai"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_SUA_CHAVE_PUBLICA_AQUI"
STRIPE_SECRET_KEY="sk_test_SUA_CHAVE_SECRETA_AQUI"
STRIPE_WEBHOOK_SECRET="whsec_SERÁ_CONFIGURADO_DEPOIS"
STRIPE_PREMIUM_MONTHLY_PRICE_ID="price_SEU_PRICE_ID_MENSAL"
STRIPE_PREMIUM_YEARLY_PRICE_ID="price_SEU_PRICE_ID_ANUAL"
```

## 🗄️ Configuração do Banco de Dados

### Opção 1: Neon (PostgreSQL Grátis)
1. **Acesse**: https://neon.tech
2. **Crie conta** e novo banco
3. **Copie a connection string**
4. **Atualize** `DATABASE_URL` na Vercel

### Opção 2: Supabase (PostgreSQL Grátis)
1. **Acesse**: https://supabase.com
2. **Crie projeto** 
3. **Vá em Settings** → Database
4. **Copie a connection string**
5. **Atualize** `DATABASE_URL` na Vercel

### Opção 3: Vercel Postgres (Pago)
1. **Na Vercel**, vá em Storage
2. **Crie Postgres Database**
3. **Connection string** será automática

## 🔧 Após o Deploy

### 1. Aplicar Migrations
Na Vercel, vá em Functions e execute:
```bash
npx prisma migrate deploy
```

### 2. Configurar Webhook do Stripe
1. **URL do webhook**: `https://seu-projeto.vercel.app/api/stripe/webhook`
2. **Eventos**: 
   - checkout.session.completed
   - customer.subscription.created
   - customer.subscription.updated
   - customer.subscription.deleted
   - invoice.payment_succeeded
   - invoice.payment_failed
3. **Copie o Webhook Secret**
4. **Atualize** `STRIPE_WEBHOOK_SECRET` na Vercel

### 3. Atualizar URLs do Stripe
No Stripe Dashboard:
- **Success URL**: `https://seu-projeto.vercel.app/dashboard?success=true`
- **Cancel URL**: `https://seu-projeto.vercel.app/pricing?canceled=true`

## 🧪 Testar o Sistema

### 1. Funcionalidades Básicas
- ✅ Login funciona
- ✅ Dashboard carrega
- ✅ Editor de currículo funciona
- ✅ Preview funciona

### 2. Sistema de Pagamentos
- ✅ Página /pricing carrega
- ✅ Checkout do Stripe abre
- ✅ Pagamento com cartão teste funciona
- ✅ Webhook processa pagamento
- ✅ Plano do usuário é atualizado

### 3. Geração de PDF
- ✅ Botão de download aparece
- ✅ PDF é gerado e baixado
- ✅ Templates funcionam corretamente

## 🎯 Checklist de Deploy

### Antes do Deploy
- [x] Código commitado
- [x] Build local funcionando
- [x] Variáveis de ambiente preparadas
- [x] Banco de dados escolhido

### Durante o Deploy
- [ ] Projeto importado na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy bem-sucedido
- [ ] Migrations aplicadas

### Após o Deploy
- [ ] Site acessível
- [ ] Login funcionando
- [ ] Webhook Stripe configurado
- [ ] Teste de pagamento realizado
- [ ] Geração de PDF testada

## 🔍 Troubleshooting

### Build Falha
```bash
# Verificar localmente
npm run build

# Ver logs na Vercel
- Function Logs
- Edge Logs  
- Build Logs
```

### Banco de Dados
```bash
# Se migrations falharem
npx prisma db push

# Se conexão falhar
- Verificar DATABASE_URL
- Whitelist IPs na Vercel
- Testar conexão local
```

### Webhooks
```bash
# Se webhook falhar
- Verificar URL correta
- Verificar secret correto
- Ver logs na Vercel
- Testar no Stripe Dashboard
```

## 📊 Monitoramento

### Métricas da Vercel
- **Analytics**: Tráfego e performance
- **Functions**: Execução das APIs
- **Edge**: Cache e CDN

### Métricas do Stripe
- **Dashboard**: Pagamentos e conversões
- **Webhooks**: Status dos eventos
- **Logs**: Debugging de problemas

---

## 🎉 Próximos Passos

Após deploy bem-sucedido:

1. **Compartilhe o link** do projeto
2. **Teste todas as funcionalidades**
3. **Configure domínio personalizado** (opcional)
4. **Configure analytics** (Google Analytics, etc.)
5. **Monitore performance** e conversões

**Deploy URL**: `https://seu-projeto.vercel.app` 🚀
