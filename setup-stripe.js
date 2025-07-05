#!/usr/bin/env node

/**
 * Script de configuração automática do Stripe
 * Execute: node setup-stripe.js
 */

const readline = require('readline');
const fs = require('fs');
const path = require('path');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🎯 Configuração Automática do Stripe\n');

const questions = [
  'Digite sua Stripe Publishable Key (pk_test_...): ',
  'Digite sua Stripe Secret Key (sk_test_...): ',
  'Digite o Price ID do plano mensal (price_...): ',
  'Digite o Price ID do plano anual (price_...): ',
  'Digite o Webhook Secret (whsec_...) [opcional]: '
];

const envKeys = [
  'STRIPE_PUBLISHABLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_PREMIUM_MONTHLY_PRICE_ID',
  'STRIPE_PREMIUM_YEARLY_PRICE_ID',
  'STRIPE_WEBHOOK_SECRET'
];

async function askQuestion(question) {
  return new Promise(resolve => {
    rl.question(question, resolve);
  });
}

async function setupStripe() {
  const answers = [];
  
  console.log('📝 Por favor, forneça as seguintes informações do Stripe:\n');
  
  for (let i = 0; i < questions.length; i++) {
    const answer = await askQuestion(questions[i]);
    answers.push(answer.trim());
  }
  
  // Lê o arquivo .env.example
  const envExamplePath = path.join(process.cwd(), '.env.example');
  const envLocalPath = path.join(process.cwd(), '.env.local');
  
  let envContent = '';
  
  if (fs.existsSync(envLocalPath)) {
    // Se .env.local já existe, lê o conteúdo atual
    envContent = fs.readFileSync(envLocalPath, 'utf8');
    console.log('\n📄 Atualizando .env.local existente...');
  } else if (fs.existsSync(envExamplePath)) {
    // Se não existe .env.local, copia do .env.example
    envContent = fs.readFileSync(envExamplePath, 'utf8');
    console.log('\n📄 Criando .env.local a partir do .env.example...');
  } else {
    console.log('\n❌ Arquivo .env.example não encontrado!');
    process.exit(1);
  }
  
  // Atualiza ou adiciona as variáveis do Stripe
  for (let i = 0; i < envKeys.length; i++) {
    const key = envKeys[i];
    const value = answers[i];
    
    if (value) {
      const regex = new RegExp(`^${key}=.*$`, 'm');
      const replacement = `${key}="${value}"`;
      
      if (envContent.match(regex)) {
        envContent = envContent.replace(regex, replacement);
      } else {
        envContent += `\n${replacement}`;
      }
    }
  }
  
  // Salva o arquivo .env.local
  fs.writeFileSync(envLocalPath, envContent);
  
  console.log('\n✅ Configuração salva em .env.local');
  
  // Testa a configuração
  console.log('\n🧪 Testando configuração...');
  
  try {
    // Importa o teste dinamicamente
    delete require.cache[require.resolve('./test-stripe-config.js')];
    require('./test-stripe-config.js');
  } catch (error) {
    console.log('\n⚠️  Para testar a configuração, execute:');
    console.log('npm install stripe dotenv');
    console.log('node test-stripe-config.js');
  }
  
  console.log('\n🎉 Configuração concluída!');
  console.log('\n📝 Próximos passos:');
  console.log('1. npm install (se ainda não fez)');
  console.log('2. npx prisma migrate dev (configurar banco)');
  console.log('3. npm run dev (executar projeto)');
  console.log('4. Acessar http://localhost:3000/pricing');
  
  rl.close();
}

// Verifica se as dependências necessárias estão instaladas
const packagePath = path.join(process.cwd(), 'package.json');
if (!fs.existsSync(packagePath)) {
  console.log('❌ package.json não encontrado. Execute este script na raiz do projeto.');
  process.exit(1);
}

const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
const hasStripe = packageJson.dependencies?.stripe || packageJson.devDependencies?.stripe;

if (!hasStripe) {
  console.log('⚠️  Dependência do Stripe não encontrada.');
  console.log('Execute primeiro: npm install stripe');
  process.exit(1);
}

setupStripe().catch(error => {
  console.error('❌ Erro durante a configuração:', error);
  process.exit(1);
});
