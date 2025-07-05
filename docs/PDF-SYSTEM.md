# Sistema de Exportação PDF - Documentação

## 📄 Visão Geral

O sistema de exportação PDF permite que os usuários baixem seus currículos em formato PDF profissional. O sistema implementa controle de acesso baseado em planos (gratuito vs premium) e oferece uma experiência completa de geração de PDF.

## 🏗️ Arquitetura

### Componentes Principais

#### 1. **API Route** (`/api/pdf/generate`)
- **Arquivo**: `src/app/api/pdf/generate/route.ts`
- **Função**: Endpoint para gerar e baixar PDFs
- **Autenticação**: Verifica se usuário está logado
- **Autorização**: Verifica se usuário tem acesso ao currículo
- **Rate Limiting**: Controla downloads baseado no plano

#### 2. **PDF Generator** 
- **Arquivo**: `src/lib/pdf-generator.tsx`
- **Função**: Gera PDF usando @react-pdf/renderer
- **Template**: Replica o design do componente Preview
- **Formatação**: Layout profissional com cores e tipografia otimizadas

#### 3. **Hook de Download**
- **Arquivo**: `src/hooks/use-pdf-download.ts`
- **Função**: Hook customizado para gerenciar downloads
- **Estado**: Controla loading states e feedback
- **Error Handling**: Trata erros e limites de plano

#### 4. **Componente de Botão**
- **Arquivo**: `src/components/ui/pdf-export-button.tsx`
- **Função**: Botão reutilizável para exportar PDF
- **Props**: Aceita curriculumId, title, variant, size
- **UX**: Feedback visual durante geração

#### 5. **Informações do Plano**
- **Arquivo**: `src/components/ui/plan-info.tsx`
- **Função**: Mostra informações do plano do usuário
- **Progresso**: Barra de progresso para plano gratuito
- **Upgrade**: CTA para fazer upgrade

## 🎯 Funcionalidades

### Para Usuários Gratuitos
- ✅ **3 downloads PDF gratuitos**
- ✅ **Contador de downloads usado**
- ✅ **Barra de progresso visual**
- ✅ **Aviso quando limite atingido**
- ✅ **CTA para upgrade**

### Para Usuários Premium
- ✅ **Downloads ilimitados**
- ✅ **Badge de plano premium**
- ✅ **Sem restrições de uso**

### Experiência Geral
- ✅ **Download automático do arquivo**
- ✅ **Nome do arquivo personalizado**
- ✅ **Loading states durante geração**
- ✅ **Toast notifications para feedback**
- ✅ **Error handling robusto**

## 📍 Localização dos Botões

### 1. **Dashboard** (`/dashboard`)
- **Arquivo**: `src/components/dashboard/curriculum-card.tsx`
- **Localização**: Ações rápidas do card (ícone download)
- **Comportamento**: Download direto via hover actions

### 2. **Editor** (`/editor/[id]`)
- **Arquivo**: `src/app/editor/[id]/page.tsx`
- **Localização**: Header superior direito
- **Comportamento**: Salva antes de exportar (se necessário)

### 3. **Preview** (`/preview/[id]`)
- **Arquivo**: `src/components/preview/preview-actions.tsx`
- **Localização**: Header e ações inferiores
- **Comportamento**: Export direto da visualização

## 🔧 Configuração

### Dependências
```json
{
  "@react-pdf/renderer": "^3.1.14",
  "@radix-ui/react-progress": "^1.0.3"
}
```

### Variáveis de Ambiente
```bash
# Já configuradas no projeto
DATABASE_URL="..."
NEXTAUTH_SECRET="..."
```

### Limites de Plano
```typescript
const MAX_FREE_DOWNLOADS = 3
```

## 🚀 Como Usar

### Para Desenvolvedores

#### 1. Adicionar botão de PDF em nova página:
```tsx
import { PdfExportButton } from '@/components/ui/pdf-export-button'

<PdfExportButton
  curriculumId={curriculumId}
  title={curriculumTitle}
  variant="default"
  size="sm"
/>
```

#### 2. Hook para controle personalizado:
```tsx
import { usePdfDownload } from '@/hooks/use-pdf-download'

const { downloadPdf, isDownloading } = usePdfDownload({
  onSuccess: () => console.log('PDF baixado!'),
  onError: (error) => console.error(error)
})
```

### Para Usuários

#### 1. **No Dashboard:**
- Hover sobre um card de currículo
- Clique no ícone de download
- PDF é baixado automaticamente

#### 2. **No Editor:**
- Clique em "Baixar PDF" no header
- PDF é gerado com dados atuais

#### 3. **No Preview:**
- Clique em "Baixar PDF" ou "Exportar para PDF"
- Download imediato

## 📊 Monitoramento

### Métricas Importantes
- **Downloads por usuário**: Rastreado em `user.pdfDownloads`
- **Limites de plano**: Validado na API
- **Erros de geração**: Logados no console
- **Tempo de geração**: Pode ser otimizado

### Logs
```typescript
// API Route
console.error('Erro ao gerar PDF:', error)

// Hook
console.error('Erro ao baixar PDF:', error)
```

## 🔮 Próximos Passos

### Melhorias Planejadas
1. **Templates múltiplos**: Diferentes estilos de PDF
2. **Compressão**: Otimizar tamanho dos arquivos
3. **Async generation**: Geração em background para PDFs grandes
4. **Analytics**: Rastrear uso e performance
5. **Custom branding**: Logo e cores personalizadas

### Otimizações Técnicas
1. **Caching**: Cache de PDFs gerados
2. **CDN**: Servir PDFs via CDN
3. **Batch processing**: Múltiplos PDFs
4. **Quality settings**: Diferentes qualidades de export

## 🐛 Troubleshooting

### Problemas Comuns

#### 1. **PDF não baixa**
- Verificar se usuário está autenticado
- Verificar limite de downloads
- Verificar console para erros

#### 2. **Formatação incorreta**
- Verificar dados do currículo
- Testar com dados completos
- Verificar estilos do PDF

#### 3. **Erro de servidor**
- Verificar logs da API
- Verificar conexão com banco
- Verificar dependências

### Debug
```bash
# Verificar status do servidor
npm run dev

# Verificar banco de dados
npm run db:studio

# Verificar build
npm run build
```

## ✅ Status Atual

- ✅ **API Route implementada**
- ✅ **PDF Generator funcionando**
- ✅ **Hook customizado criado**
- ✅ **Botões integrados em todas as páginas**
- ✅ **Sistema de planos integrado**
- ✅ **Informações de plano no dashboard**
- ✅ **Error handling completo**
- ✅ **Loading states implementados**
- ✅ **Toast notifications funcionando**

**🎉 Sistema de PDF 100% funcional e pronto para uso!**
