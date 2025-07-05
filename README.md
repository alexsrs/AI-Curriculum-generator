# Gerador de Currículos com IA 🚀

Um gerador de currículos moderno e inteligente que utiliza IA para criar resumos profissionais otimizados.

## 🔥 Funcionalidades

### MVP (Versão 1.0)
- ✅ **Autenticação**: Login com email/senha ou Google
- ✅ **Templates Responsivos**: 2-3 templates modernos com CSS bonito
- ✅ **Editor Completo**: Formulário para todas as informações do currículo
- ✅ **IA Integrada**: Geração de resumo profissional com GPT-4
- ✅ **Exportação PDF**: Download do currículo em PDF
- ✅ **Painel do Usuário**: Gerenciamento de currículos salvos

### Planos e Monetização
- **Gratuito**: 3 downloads PDF/mês, 2 templates, 5 gerações de IA/mês
- **Premium**: Downloads ilimitados, 6+ templates, IA ilimitada, suporte prioritário
- **Preços**: R$ 5,90/mês ou R$ 19,90/ano (economia de 67%)

## 🛠️ Stack Tecnológica

- **Frontend**: Next.js 14 + TypeScript + Tailwind CSS
- **Backend**: Next.js API Routes + Prisma + PostgreSQL
- **Autenticação**: NextAuth.js
- **IA**: OpenAI GPT-4 + Vercel AI SDK
- **PDF**: @react-pdf/renderer
- **Pagamentos**: Stripe
- **Deploy**: Vercel

## 🚀 Como Executar

### Configuração Rápida

1. **Clone o repositório**
   ```bash
   git clone <url-do-repo>
   cd AI-Curriculum-generator
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure o Stripe (Pagamentos)**
   ```bash
   # Configuração automática
   node setup-stripe.js
   
   # OU manual: copie .env.example para .env.local
   cp .env.example .env.local
   ```
   
   📋 **Para configuração manual do Stripe, consulte**: `STRIPE-QUICKSTART.md`

4. **Configure o banco de dados**
   ```bash
   npx prisma migrate dev
   ```

5. **Execute o projeto**
   ```bash
   npm run dev
   ```

6. **Teste os pagamentos**
   - Acesse: http://localhost:3000/pricing
   - Use cartão de teste: `4242 4242 4242 4242`

### Scripts Úteis

```bash
# Testar configuração do Stripe
node test-stripe-config.js

# Reset do banco de dados
npx prisma migrate reset

# Visualizar banco de dados
npx prisma studio
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # App Router (Next.js 14)
│   ├── api/               # API Routes
│   ├── auth/              # Páginas de autenticação
│   ├── dashboard/         # Dashboard do usuário
│   ├── editor/            # Editor de currículo
│   └── pricing/           # Página de preços
├── components/            # Componentes reutilizáveis
├── lib/                   # Utilitários e configurações
├── store/                 # Gerenciamento de estado (Zustand)
├── styles/               # Estilos globais
└── types/                # Tipos TypeScript
```

## 🎨 Templates Disponíveis

1. **Moderno**: Layout clean e minimalista
2. **Executivo**: Formato tradicional e elegante
3. **Criativo**: Design diferenciado para áreas criativas (Premium)

## 🔧 Variáveis de Ambiente

```env
# Database
DATABASE_URL="your_postgresql_url"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your_secret_key"

# Google OAuth
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

# OpenAI
OPENAI_API_KEY="your_openai_api_key"

# Stripe (Pagamentos)
STRIPE_PUBLISHABLE_KEY="pk_test_your_stripe_publishable_key"
STRIPE_SECRET_KEY="sk_test_your_stripe_secret_key"
STRIPE_WEBHOOK_SECRET="whsec_your_webhook_secret"
STRIPE_PREMIUM_MONTHLY_PRICE_ID="price_your_monthly_plan_id"
STRIPE_PREMIUM_YEARLY_PRICE_ID="price_your_yearly_plan_id"
```

📋 **Para configuração detalhada**: consulte `docs/STRIPE-SETUP.md`

## 📈 Roadmap

### Versão 1.1
- [ ] Mais templates
- [ ] Sugestões de IA para experiências
- [ ] Integração com LinkedIn
- [ ] Análise de ATS (Applicant Tracking System)

### Versão 1.2
- [ ] Cartas de apresentação
- [ ] Portfólio online
- [ ] Compartilhamento de currículos
- [ ] Analytics de visualizações

## 🤝 Contribuição

Contribuições são sempre bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Fazer pull requests

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido com ❤️ e IA**