#!/usr/bin/env node

/**
 * Script de teste para verificar configuração do Stripe
 * Execute: node test-stripe-config.js
 */

const stripe = require('stripe');
const dotenv = require('dotenv');

// Carrega variáveis de ambiente
dotenv.config({ path: '.env.local' });

const requiredEnvVars = [
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PREMIUM_MONTHLY_PRICE_ID',
  'STRIPE_PREMIUM_YEARLY_PRICE_ID'
];

console.log('🔍 Verificando configuração do Stripe...\n');

// Verifica variáveis de ambiente
console.log('📋 Verificando variáveis de ambiente:');
let missingVars = [];

requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (!value) {
    console.log(`❌ ${varName}: Não configurada`);
    missingVars.push(varName);
  } else {
    console.log(`✅ ${varName}: Configurada`);
  }
});

if (missingVars.length > 0) {
  console.log('\n⚠️  Variáveis faltando no .env.local:');
  missingVars.forEach(varName => {
    console.log(`   - ${varName}`);
  });
  console.log('\n📝 Consulte STRIPE-QUICKSTART.md para configuração');
  process.exit(1);
}

// Testa conexão com Stripe
console.log('\n🌐 Testando conexão com Stripe...');

const stripeClient = new stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
});

async function testStripeConnection() {
  try {
    // Testa conexão básica
    const account = await stripeClient.accounts.retrieve();
    console.log(`✅ Conexão com Stripe: OK (${account.business_type || 'individual'})`);
    
    // Verifica se está em modo de teste
    const isTestMode = process.env.STRIPE_SECRET_KEY.startsWith('sk_test_');
    console.log(`🧪 Modo de teste: ${isTestMode ? 'Sim' : 'Não'}`);
    
    // Testa price IDs
    console.log('\n💰 Verificando produtos:');
    
    const monthlyPriceId = process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID;
    const yearlyPriceId = process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID;
    
    try {
      const monthlyPrice = await stripeClient.prices.retrieve(monthlyPriceId);
      console.log(`✅ Plano mensal: ${monthlyPrice.nickname || 'Sem nome'} - ${monthlyPrice.unit_amount/100} ${monthlyPrice.currency.toUpperCase()}`);
    } catch (error) {
      console.log(`❌ Plano mensal: Price ID inválido (${monthlyPriceId})`);
    }
    
    try {
      const yearlyPrice = await stripeClient.prices.retrieve(yearlyPriceId);
      console.log(`✅ Plano anual: ${yearlyPrice.nickname || 'Sem nome'} - ${yearlyPrice.unit_amount/100} ${yearlyPrice.currency.toUpperCase()}`);
    } catch (error) {
      console.log(`❌ Plano anual: Price ID inválido (${yearlyPriceId})`);
    }
    
    // Lista webhooks
    console.log('\n🔗 Verificando webhooks:');
    const webhooks = await stripeClient.webhookEndpoints.list({ limit: 10 });
    
    if (webhooks.data.length === 0) {
      console.log('⚠️  Nenhum webhook configurado');
    } else {
      webhooks.data.forEach(webhook => {
        console.log(`✅ Webhook: ${webhook.url}`);
        console.log(`   Status: ${webhook.status}`);
        console.log(`   Eventos: ${webhook.enabled_events.join(', ')}`);
      });
    }
    
    console.log('\n🎉 Configuração do Stripe validada com sucesso!');
    console.log('\n📝 Próximos passos:');
    console.log('1. Execute: npm run dev');
    console.log('2. Acesse: http://localhost:3000/pricing');
    console.log('3. Teste com cartão: 4242 4242 4242 4242');
    
  } catch (error) {
    console.error('❌ Erro ao conectar com Stripe:', error.message);
    
    if (error.message.includes('Invalid API Key')) {
      console.log('\n💡 Dica: Verifique se a STRIPE_SECRET_KEY está correta');
    }
    
    process.exit(1);
  }
}

testStripeConnection();
