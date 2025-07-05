# Configuração do Stripe - Gerador de Currículos com IA

Este guia detalha como configurar completamente o sistema de pagamentos Stripe no projeto.

## 📋 Pré-requisitos

1. Conta no Stripe (https://stripe.com)
2. Projeto já configurado com as dependências instaladas
3. Banco de dados PostgreSQL configurado
4. Arquivo `.env.local` criado a partir do `.env.example`

## 🚀 Passo a Passo

### 1. Configuração Inicial do Stripe

1. **Acesse o Dashboard do Stripe**
   - Vá para https://dashboard.stripe.com
   - Faça login ou crie uma conta

2. **Obtenha as Chaves da API**
   - No menu lateral, vá em "Developers" → "API keys"
   - Copie a "Publishable key" (pk_test_...)
   - Copie a "Secret key" (sk_test_...)
   - ⚠️ **IMPORTANTE**: Use as chaves de teste primeiro!

### 2. Criação dos Produtos e Preços

#### 2.1 Criar Produto Premium Mensal

1. No Dashboard, vá em "Products" → "Add product"
2. Configure:
   - **Name**: `Curriculum Generator Premium Monthly`
   - **Description**: `Plano premium mensal do gerador de currículos com IA`
   - **Pricing model**: `Standard pricing`
   - **Price**: `R$ 5,90`
   - **Billing period**: `Monthly`
   - **Currency**: `BRL`
3. Clique em "Save product"
4. **Copie o Price ID** (price_xxxxxxxxxxxx)

#### 2.2 Criar Produto Premium Anual

1. No Dashboard, vá em "Products" → "Add product"
2. Configure:
   - **Name**: `Curriculum Generator Premium Yearly`
   - **Description**: `Plano premium anual do gerador de currículos com IA`
   - **Pricing model**: `Standard pricing`
   - **Price**: `R$ 19,90`
   - **Billing period**: `Yearly`
   - **Currency**: `BRL`
3. Clique em "Save product"
4. **Copie o Price ID** (price_xxxxxxxxxxxx)

### 3. Configuração de Webhooks

1. No Dashboard, vá em "Developers" → "Webhooks"
2. Clique em "Add endpoint"
3. Configure:
   - **Endpoint URL**: `https://seu-dominio.com/api/stripe/webhook`
   - Para desenvolvimento local: `http://localhost:3000/api/stripe/webhook`
   - **Listen to**: `Events on your account`
4. **Selecione os eventos**:
   ```
   customer.subscription.created
   customer.subscription.updated
   customer.subscription.deleted
   invoice.payment_succeeded
   invoice.payment_failed
   ```
5. Clique em "Add endpoint"
6. **Copie o Webhook Secret** (whsec_xxxxxxxxxxxx)

### 4. Configuração das Variáveis de Ambiente

Edite seu arquivo `.env.local`:

```bash
# Stripe Configuration
STRIPE_PUBLISHABLE_KEY="pk_test_sua_chave_publica_aqui"
STRIPE_SECRET_KEY="sk_test_sua_chave_secreta_aqui"
STRIPE_WEBHOOK_SECRET="whsec_seu_webhook_secret_aqui"

# Price IDs dos produtos criados
STRIPE_PREMIUM_MONTHLY_PRICE_ID="price_premium_mensal_id"
STRIPE_PREMIUM_YEARLY_PRICE_ID="price_premium_anual_id"
```

### 5. Teste da Configuração

#### 5.1 Executar o Projeto

```bash
npm run dev
```

#### 5.2 Testar Fluxo de Pagamento

1. Acesse http://localhost:3000/pricing
2. Clique em "Assinar Premium"
3. Use cartões de teste do Stripe:
   - **Sucesso**: `4242 4242 4242 4242`
   - **Falha**: `4000 0000 0000 0002`
   - **CVV**: qualquer 3 dígitos
   - **Data**: qualquer data futura

#### 5.3 Verificar Webhooks

1. No Dashboard do Stripe, vá em "Developers" → "Webhooks"
2. Clique no webhook criado
3. Verifique se os eventos estão sendo recebidos

### 6. Configuração para Produção

#### 6.1 Ativar Conta Stripe

1. Complete as informações da empresa
2. Forneça documentos necessários
3. Ative a conta para live mode

#### 6.2 Atualizar Chaves

Substitua as chaves de teste pelas de produção:
```bash
STRIPE_PUBLISHABLE_KEY="pk_live_sua_chave_publica_producao"
STRIPE_SECRET_KEY="sk_live_sua_chave_secreta_producao"
```

#### 6.3 Configurar Webhook de Produção

1. Crie novo webhook com URL de produção
2. Copie o novo webhook secret
3. Atualize `STRIPE_WEBHOOK_SECRET`

### 7. Funcionalidades Implementadas

#### 7.1 Fluxo de Checkout
- **Endpoint**: `/api/stripe/checkout`
- **Função**: Cria sessão de checkout
- **Redirecionamentos**:
  - Sucesso: `/dashboard?success=true`
  - Cancelamento: `/pricing?canceled=true`

#### 7.2 Processamento de Webhooks
- **Endpoint**: `/api/stripe/webhook`
- **Função**: Atualiza plano do usuário automaticamente
- **Eventos processados**:
  - Assinatura criada/atualizada
  - Pagamento bem-sucedido
  - Assinatura cancelada

#### 7.3 Portal do Cliente
- **Endpoint**: `/api/stripe/portal`
- **Função**: Permite ao usuário gerenciar assinatura
- **Funcionalidades**:
  - Alterar método de pagamento
  - Ver histórico de faturas
  - Cancelar assinatura

### 8. Estrutura de Dados

#### 8.1 Schema do Banco (Prisma)

```prisma
model User {
  id               String  @id @default(cuid())
  email            String  @unique
  name             String?
  stripeCustomerId String? @unique
  plan             String  @default("free")
  planExpiresAt    DateTime?
  downloads        Int     @default(0)
  // ... outros campos
}
```

#### 8.2 Planos Disponíveis

```typescript
// Definidos em src/lib/stripe.ts
- free: Gratuito (3 downloads/mês)
- premium: R$ 19,90/mês (ilimitado)
- premium-yearly: R$ 199,90/ano (ilimitado + economia)
```

### 9. Troubleshooting

#### 9.1 Problemas Comuns

**Webhook não funciona localmente**:
- Use ngrok: `ngrok http 3000`
- Configure webhook com URL do ngrok

**Erro de autenticação**:
- Verifique se as chaves estão corretas
- Certifique-se de usar as chaves do mesmo ambiente (test/live)

**Webhook secret inválido**:
- Copie exatamente o secret do dashboard
- Verifique se não há espaços extras

#### 9.2 Logs e Debug

Para debug, verifique:
1. Console do navegador (erros de frontend)
2. Terminal do Next.js (erros de API)
3. Dashboard do Stripe (eventos de webhook)

### 10. Monitoramento

#### 10.1 Métricas Importantes

Monitore no Dashboard do Stripe:
- Taxa de conversão de checkout
- Churn rate (cancelamentos)
- MRR (Monthly Recurring Revenue)
- Falhas de pagamento

#### 10.2 Alertas Recomendados

Configure alertas para:
- Falhas de webhook
- Pagamentos recusados
- Cancelamentos de assinatura

## 📞 Suporte

Se encontrar problemas:
1. Verifique a documentação do Stripe
2. Consulte os logs de erro
3. Teste com cartões de teste primeiro
4. Use o ambiente de teste antes da produção

## 🔒 Segurança

- ✅ Nunca exponha chaves secretas no frontend
- ✅ Valide webhooks com o secret
- ✅ Use HTTPS em produção
- ✅ Implemente rate limiting nas APIs

---

**Última atualização**: Dezembro 2024
**Versão do Stripe API**: 2023-10-16
