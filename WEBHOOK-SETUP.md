# 🔗 Configuração de Webhook Local - Guia Rápido

## 🚀 Método Recomendado: ngrok

### 1. Executar o Projeto
```bash
npm run dev
```

### 2. Abrir Nova Aba do Terminal e Executar ngrok
```bash
ngrok http 3000
```

### 3. Copiar a URL do ngrok
O ngrok mostrará algo como:
```
Forwarding    https://abc123.ngrok.io -> http://localhost:3000
```

### 4. Configurar Webhook no Stripe Dashboard

1. **Acesse**: https://dashboard.stripe.com/test/webhooks
2. **Clique em**: "Add endpoint"  
3. **URL**: `https://abc123.ngrok.io/api/stripe/webhook` (substitua pela sua URL do ngrok)
4. **Eventos**: Selecione:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. **Salvar** e copiar o **Webhook Secret**

### 5. Atualizar .env.local
```bash
STRIPE_WEBHOOK_SECRET="whsec_sua_chave_aqui"
```

## 🧪 Testar o Webhook

1. **Acesse**: `https://abc123.ngrok.io/pricing`
2. **Teste pagamento** com cartão: `4242 4242 4242 4242`
3. **Verificar logs** no terminal do Next.js
4. **Verificar eventos** no Stripe Dashboard

## ⚡ Comandos Rápidos

```bash
# Terminal 1: Projeto Next.js
npm run dev

# Terminal 2: ngrok (nova aba)
ngrok http 3000

# Depois de configurar webhook, testar:
node test-stripe-config.js
```

## 🔍 Verificar se Funciona

- ✅ ngrok rodando e mostrando URL pública
- ✅ Next.js rodando em localhost:3000
- ✅ Webhook configurado no Stripe com URL do ngrok
- ✅ Webhook Secret atualizado no .env.local
- ✅ Teste de pagamento funciona

---

**💡 Dica**: Mantenha ngrok e Next.js sempre rodando durante o desenvolvimento!
