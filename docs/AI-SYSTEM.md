# 🤖 Sistema de IA - Documentação

## 📋 Visão Geral

O sistema de IA foi implementado para auxiliar os usuários na criação de currículos profissionais através da geração automática de texto usando GPT-3.5 Turbo da OpenAI. O sistema oferece três tipos principais de geração: resumo profissional, descrições de experiência e sugestões de habilidades.

## 🎯 Funcionalidades Implementadas

### 1. **Geração de Resumo Profissional**
- **Local**: Formulário de informações pessoais
- **Botão**: "Gerar com IA" ao lado do campo "Resumo Profissional"
- **Funcionamento**: Analisa todas as informações do usuário (experiências, formação, habilidades) e gera um resumo profissional de até 150 palavras
- **Requisitos**: Nome completo obrigatório

### 2. **Geração de Descrição de Experiência**
- **Local**: Formulário de experiência profissional
- **Botão**: "Gerar com IA" em cada experiência
- **Funcionamento**: Gera descrição detalhada baseada no cargo e empresa informados
- **Requisitos**: Cargo e empresa obrigatórios

### 3. **Sugestões de Habilidades**
- **Local**: Formulário de habilidades
- **Botão**: "Sugerir com IA"
- **Funcionamento**: Analisa perfil e habilidades existentes para sugerir novas habilidades relevantes
- **Resultado**: Lista de 8-12 habilidades categorizadas automaticamente

## 🔧 Arquitetura Técnica

### **Configuração do OpenAI**
```typescript
// src/lib/openai.ts
import OpenAI from 'openai'

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export const AI_CONFIG = {
  maxTokens: 1000,
  temperature: 0.7,
  defaultModel: 'gpt-3.5-turbo',
}
```

### **API Route Principal**
```typescript
// src/app/api/ai/generate/route.ts
POST /api/ai/generate

// Parâmetros:
{
  personalInfo: object,
  experiences: array,
  education: array,
  skills: array,
  type: 'summary' | 'experience' | 'skills'
}

// Resposta:
{
  success: boolean,
  generatedText: string,
  type: string,
  tokensUsed: number
}
```

### **Hook Customizado**
```typescript
// src/hooks/use-ai-generation.ts
const { 
  generateSummary,
  generateExperienceDescription,
  generateSkillsSuggestions,
  isLoading 
} = useAIGeneration()
```

## 📊 Fluxo de Funcionamento

### **1. Geração de Resumo**
```mermaid
graph TD
    A[Usuário clica "Gerar com IA"] --> B{Nome preenchido?}
    B -->|Não| C[Alerta de validação]
    B -->|Sim| D[Hook useAIGeneration]
    D --> E[API /ai/generate]
    E --> F[OpenAI GPT-3.5]
    F --> G[Texto gerado]
    G --> H[Atualiza campo resumo]
    G --> I[Toast de sucesso]
```

### **2. Estados de Loading**
- ✅ **Botões desabilitados** durante geração
- ✅ **Ícone de loading** animado (Loader2)
- ✅ **Texto do botão alterado** ("Gerando...")
- ✅ **Campos de input desabilitados** durante processo
- ✅ **Toast notifications** para feedback

## 🎨 Interface do Usuário

### **Botões de IA nos Formulários**
```tsx
<Button 
  variant="outline" 
  size="sm"
  onClick={handleGenerateWithAI}
  disabled={isLoading || !hasRequiredFields}
>
  {isLoading ? (
    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
  ) : (
    <Sparkles className="h-4 w-4 mr-2" />
  )}
  {isLoading ? 'Gerando...' : 'Gerar com IA'}
</Button>
```

### **Validações de Campo**
- **Resumo**: Requer nome completo
- **Experiência**: Requer cargo e empresa
- **Habilidades**: Funciona sempre (usa habilidades existentes como base)

### **Feedback Visual**
```tsx
// Mensagem de validação
{!fieldsFilled && (
  <span className="text-orange-600 font-medium">
    Preencha os campos obrigatórios para usar a IA.
  </span>
)}
```

## 🔐 Configuração e Segurança

### **Variáveis de Ambiente**
```bash
# .env.local
OPENAI_API_KEY="sk-your-openai-api-key-here"
```

### **Validação de Autenticação**
```typescript
// Todas as API routes verificam autenticação
const session = await getServerSession(authOptions)
if (!session || !session.user?.email) {
  return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
}
```

### **Tratamento de Erros**
- ✅ **Chave API inválida**: Erro 401 da OpenAI
- ✅ **Limite de uso atingido**: Erro 429 da OpenAI
- ✅ **Erros de rede**: Timeout e conexão
- ✅ **Validação de entrada**: Campos obrigatórios

## 📈 Prompts Otimizados

### **Prompt para Resumo Profissional**
```typescript
const prompt = `
Gere um resumo profissional impactante e conciso (máximo 150 palavras) para o seguinte perfil:

**Nome:** ${personalInfo.fullName}
**Experiências:** ${experienceText}
**Formação:** ${educationText}
**Habilidades:** ${skillsText}

O resumo deve:
- Destacar os pontos fortes do candidato
- Ser escrito em terceira pessoa
- Usar linguagem profissional e brasileira
- Focar em resultados e competências
- Ser atrativo para recrutadores

Retorne apenas o texto do resumo, sem títulos ou formatação adicional.
`
```

### **Prompt para Experiência**
```typescript
const prompt = `
Gere uma descrição profissional e impactante para a seguinte experiência de trabalho:

**Cargo:** ${experience.position}
**Empresa:** ${experience.company}
**Período:** ${experience.startDate} - ${experience.endDate || 'Atual'}

A descrição deve:
- Ter entre 50-100 palavras
- Destacar responsabilidades e conquistas
- Usar verbos de ação no passado
- Incluir resultados quantificáveis quando possível
- Ser escrita em português brasileiro profissional

Retorne apenas o texto da descrição, sem formatação adicional.
`
```

## 🔄 Integração com Componentes

### **PersonalInfoForm**
```tsx
// Novas props adicionadas
interface PersonalInfoFormProps {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
  allData?: {
    experiences?: any[]
    education?: any[]
    skills?: string[]
  }
}
```

### **ExperienceForm**
```tsx
// Nova prop para contexto
interface ExperienceFormProps {
  data: Experience[]
  onChange: (data: Experience[]) => void
  personalInfo?: any
}
```

### **SkillsForm**
```tsx
// Nova prop para personalização
interface SkillsFormProps {
  data: { skills: Skill[], languages: Language[] }
  onChange: (data: { skills: Skill[], languages: Language[] }) => void
  personalInfo?: any
}
```

## 📊 Métricas e Monitoramento

### **Uso de Tokens**
- ✅ **Tracking de tokens** em cada requisição
- ✅ **Feedback ao usuário** sobre consumo
- ✅ **Limites configuráveis** no AI_CONFIG

### **Status da API**
```typescript
// src/app/api/ai/status/route.ts
GET /api/ai/status

// Resposta:
{
  hasOpenAIKey: boolean,
  isConfigured: boolean,
  message: string
}
```

## 🚀 Benefícios Implementados

### **Para o Usuário**
1. **Economia de tempo**: Geração automática de texto profissional
2. **Qualidade profissional**: Textos otimizados para recrutadores
3. **Inspiração**: Sugestões quando o usuário não sabe o que escrever
4. **Personalização**: IA usa dados específicos do usuário

### **Para o Sistema**
1. **Diferencial competitivo**: Funcionalidade única de IA
2. **Engagement**: Usuários passam mais tempo na plataforma
3. **Qualidade**: Currículos gerados são mais profissionais
4. **Escalabilidade**: Sistema preparado para diferentes tipos de geração

## 📝 Arquivos Modificados/Criados

### **Novos Arquivos**
1. `src/lib/openai.ts` - Configuração da OpenAI
2. `src/app/api/ai/generate/route.ts` - API principal de geração
3. `src/app/api/ai/status/route.ts` - Status da configuração
4. `src/hooks/use-ai-generation.ts` - Hook customizado
5. `docs/AI-SYSTEM.md` - Esta documentação

### **Arquivos Modificados**
1. `src/components/editor/personal-info-form.tsx` - Botão de geração de resumo
2. `src/components/editor/experience-form.tsx` - Botão de geração de descrição
3. `src/components/editor/skills-form.tsx` - Botão de sugestões
4. `src/app/editor/page.tsx` - Passagem de dados entre componentes
5. `.env.example` - Variável OPENAI_API_KEY documentada
6. `package.json` - Dependência openai adicionada

## 🎯 Próximos Passos

1. **Analytics de uso**: Implementar tracking de uso da IA
2. **Modelos avançados**: Upgrade para GPT-4 quando necessário
3. **Templates personalizados**: IA adaptada por setor/cargo
4. **Otimização de custos**: Cache de respostas similares
5. **Feedback do usuário**: Sistema de avaliação das gerações

## 💡 Dicas de Uso

### **Para Usuários**
- ✅ **Preencha dados básicos** antes de usar a IA
- ✅ **Edite o texto gerado** para personalizar
- ✅ **Use como inspiração** quando não souber o que escrever
- ✅ **Teste diferentes variações** clicando novamente

### **Para Desenvolvedores**
- ✅ **Configure OPENAI_API_KEY** no .env.local
- ✅ **Monitore uso de tokens** em desenvolvimento
- ✅ **Teste diferentes prompts** para melhorar qualidade
- ✅ **Implemente rate limiting** em produção

---

✅ **Status**: Implementado e funcionando perfeitamente!
🎯 **Resultado**: Sistema de IA completo integrado ao editor de currículos, proporcionando geração automática de texto profissional com feedback visual claro e tratamento robusto de erros.
