# ⚡ Configuração Rápida do Stripe

## ✅ Checklist de Configuração

### 1. Conta e Chaves
- [ ] Criar conta no Stripe: https://stripe.com
- [ ] Copiar Publishable Key (`pk_test_...`)
- [ ] Copiar Secret Key (`sk_test_...`)

### 2. Produtos no Stripe Dashboard

**Premium Mensal**:
- [ ] Products → Add product
- [ ] Nome: `Curriculum Generator Premium Monthly`
- [ ] Preço: `R$ 5,90` mensal
- [ ] Copiar Price ID (`price_...`)

**Premium Anual**:
- [ ] Products → Add product  
- [ ] Nome: `Curriculum Generator Premium Yearly`
- [ ] Preço: `R$ 19,90` anual
- [ ] Copiar Price ID (`price_...`)

### 3. Webhook
- [ ] Developers → Webhooks → Add endpoint
- [ ] URL: `http://localhost:3000/api/stripe/webhook`
- [ ] Eventos: `customer.subscription.*`, `invoice.payment_*`
- [ ] Copiar Webhook Secret (`whsec_...`)

### 4. Variáveis de Ambiente

Adicione no `.env.local`:

```bash
# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
STRIPE_PREMIUM_MONTHLY_PRICE_ID="price_..."
STRIPE_PREMIUM_YEARLY_PRICE_ID="price_..."
```

### 5. Teste
- [ ] `npm run dev`
- [ ] Acessar `/pricing`
- [ ] Testar com cartão: `4242 4242 4242 4242`

## 🚀 Comandos Úteis

```bash
# Instalar dependências
npm install

# Executar migrations
npx prisma migrate dev

# Executar projeto
npm run dev

# Build para produção
npm run build
```

## 💳 Cartões de Teste

| Tipo | Número | Resultado |
|------|--------|-----------|
| Sucesso | `4242 4242 4242 4242` | Pagamento aprovado |
| Falha | `4000 0000 0000 0002` | Pagamento recusado |
| 3D Secure | `4000 0000 0000 3220` | Requer autenticação |

**CVV**: Qualquer 3 dígitos  
**Data**: Qualquer data futura

## 🔗 Links Úteis

- [Dashboard Stripe](https://dashboard.stripe.com)
- [Documentação Stripe](https://stripe.com/docs)
- [Cartões de Teste](https://stripe.com/docs/testing#cards)
- [Webhooks](https://stripe.com/docs/webhooks)

## ⚠️ Problemas Comuns

**Webhook não funciona**: Use ngrok para desenvolvimento local
```bash
npm install -g ngrok
ngrok http 3000
# Use a URL do ngrok no webhook
```

**Erro de chaves**: Verifique se está usando test/live consistentemente

**Price ID inválido**: Certifique-se de copiar o ID correto do dashboard

---

Para configuração completa, consulte `docs/STRIPE-SETUP.md`
