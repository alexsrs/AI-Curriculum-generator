# 🛠️ Comandos Úteis - Gerador de Currículos

## 🚀 Setup Inicial

```bash
# 1. Clonar e instalar
git clone <repo-url>
cd AI-Curriculum-generator
npm install

# 2. Configurar Stripe automaticamente
node setup-stripe.js

# 3. Configurar banco de dados
npx prisma migrate dev

# 4. Executar projeto
npm run dev
```

## 💳 Stripe (Pagamentos)

```bash
# Configuração automática do Stripe
node setup-stripe.js

# Testar configuração
node test-stripe-config.js

# Webhook para desenvolvimento local (nova aba do terminal)
npx stripe listen --forward-to localhost:3000/api/stripe/webhook
```

## 🗄️ Banco de Dados

```bash
# Aplicar migrations
npx prisma migrate dev

# Reset completo do banco
npx prisma migrate reset

# Visualizar dados (Prisma Studio)
npx prisma studio

# Gerar cliente Prisma
npx prisma generate

# Ver status das migrations
npx prisma migrate status
```

## 🔧 Desenvolvimento

```bash
# Executar em modo dev
npm run dev

# Build para produção
npm run build

# Executar versão de produção
npm start

# Lint do código
npm run lint

# Type check
npm run type-check
```

## 🧪 Testes

```bash
# Testar Stripe
node test-stripe-config.js

# Testar build
npm run build

# Verificar tipos TypeScript
npx tsc --noEmit
```

## 📁 Estrutura de Arquivos

```
AI-Curriculum-generator/
├── docs/                           # Documentação
│   ├── STRIPE-SETUP.md            # Guia completo do Stripe
│   ├── PAYMENT-FLOW.md            # Fluxo visual de pagamentos
│   └── PDF-SYSTEM.md              # Sistema de PDF
├── src/
│   ├── app/                        # Next.js App Router
│   │   ├── api/                   # API Routes
│   │   │   ├── stripe/           # Endpoints do Stripe
│   │   │   │   ├── checkout/     # Criar checkout session
│   │   │   │   ├── webhook/      # Processar webhooks
│   │   │   │   └── portal/       # Portal do cliente
│   │   │   └── pdf/              # Geração de PDF
│   │   ├── dashboard/            # Dashboard do usuário
│   │   ├── pricing/              # Página de preços
│   │   └── editor/               # Editor de currículo
│   ├── components/                 # Componentes React
│   │   ├── ui/                   # Componentes base
│   │   └── dashboard/            # Componentes do dashboard
│   └── lib/                       # Utilitários
│       ├── stripe.ts             # Configuração Stripe
│       ├── pdf-generator.tsx     # Geração de PDF
│       └── templates.ts          # Templates de currículo
├── prisma/                        # Schema do banco
├── STRIPE-QUICKSTART.md          # Guia rápido Stripe
├── setup-stripe.js              # Script de configuração
└── test-stripe-config.js        # Script de teste
```

## 🌐 URLs Importantes

### Desenvolvimento
- **App**: http://localhost:3000
- **Pricing**: http://localhost:3000/pricing
- **Dashboard**: http://localhost:3000/dashboard
- **API**: http://localhost:3000/api
- **Prisma Studio**: http://localhost:5555

### Stripe Dashboard
- **Test Mode**: https://dashboard.stripe.com/test
- **Live Mode**: https://dashboard.stripe.com
- **Webhooks**: https://dashboard.stripe.com/test/webhooks
- **Products**: https://dashboard.stripe.com/test/products

## 🔐 Cartões de Teste Stripe

```bash
# Pagamento bem-sucedido
4242 4242 4242 4242

# Pagamento recusado
4000 0000 0000 0002

# Requer 3D Secure
4000 0000 0000 3220

# Saldo insuficiente
4000 0000 0000 9995

# Qualquer CVV (3 dígitos)
# Qualquer data futura
```

## 📊 Monitoramento

```bash
# Logs do servidor Next.js
npm run dev

# Logs do Stripe (webhook)
npx stripe listen --forward-to localhost:3000/api/stripe/webhook

# Prisma Studio (visualizar banco)
npx prisma studio
```

## 🚨 Troubleshooting

### Problemas Comuns

```bash
# Erro de tipos TypeScript
npm run type-check

# Problemas com banco
npx prisma migrate reset
npx prisma migrate dev

# Webhook não funciona
ngrok http 3000
# Configure webhook com URL do ngrok

# Stripe connection error
node test-stripe-config.js
# Verificar chaves no .env.local

# Build falha
npm run lint
npm run build
```

### Logs Úteis

1. **Console do navegador**: Erros de frontend
2. **Terminal do Next.js**: Erros de API e servidor
3. **Stripe Dashboard**: Eventos de webhook e pagamentos
4. **Prisma Studio**: Estado do banco de dados

## 📝 Variáveis de Ambiente

Copie `.env.example` para `.env.local` e configure:

```bash
# Essenciais para funcionamento
DATABASE_URL="..."
NEXTAUTH_SECRET="..."
OPENAI_API_KEY="..."

# Stripe (use script setup-stripe.js)
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PREMIUM_MONTHLY_PRICE_ID="price_..."
STRIPE_PREMIUM_YEARLY_PRICE_ID="price_..."

# Opcionais
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## 🎯 Próximos Passos

1. **Setup**: Executar `setup-stripe.js`
2. **Testar**: Acessar `/pricing` e fazer teste de pagamento
3. **Webhook**: Configurar ngrok para desenvolvimento
4. **Produção**: Usar chaves live do Stripe
5. **Monitorar**: Dashboard Stripe para métricas

---

**💡 Dica**: Mantenha sempre o terminal com `npm run dev` aberto para ver logs em tempo real!
