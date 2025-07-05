import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { openai, AI_CONFIG } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { personalInfo, experiences, education, skills, type = 'summary' } = body

    // Validar dados mínimos
    if (!personalInfo?.fullName) {
      return NextResponse.json(
        { error: 'Nome completo é obrigatório para geração de IA' },
        { status: 400 }
      )
    }

    let prompt = ''
    
    switch (type) {
      case 'summary':
        prompt = generateSummaryPrompt(personalInfo, experiences, education, skills)
        break
      case 'experience':
        prompt = generateExperiencePrompt(experiences?.[0] || {})
        break
      case 'skills':
        prompt = generateSkillsPrompt(skills, personalInfo)
        break
      default:
        return NextResponse.json(
          { error: 'Tipo de geração não suportado' },
          { status: 400 }
        )
    }

    const completion = await openai.chat.completions.create({
      model: AI_CONFIG.defaultModel,
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em recursos humanos e redação de currículos profissionais. Sua tarefa é gerar textos profissionais, concisos e impactantes para currículos brasileiros.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: AI_CONFIG.maxTokens,
      temperature: AI_CONFIG.temperature,
    })

    const generatedText = completion.choices[0]?.message?.content?.trim()

    if (!generatedText) {
      return NextResponse.json(
        { error: 'Falha ao gerar texto com IA' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      generatedText,
      type,
      tokensUsed: completion.usage?.total_tokens || 0
    })

  } catch (error: any) {
    console.error('Erro na geração de IA:', error)
    
    // Tratar erros específicos do OpenAI
    if (error?.status === 401) {
      return NextResponse.json(
        { error: 'Chave de API do OpenAI inválida ou expirada' },
        { status: 500 }
      )
    }
    
    if (error?.status === 429) {
      return NextResponse.json(
        { error: 'Limite de uso da API atingido. Tente novamente em alguns minutos.' },
        { status: 429 }
      )
    }

    return NextResponse.json(
      { error: 'Erro interno do servidor ao gerar texto com IA' },
      { status: 500 }
    )
  }
}

function generateSummaryPrompt(personalInfo: any, experiences: any[], education: any[], skills: string[]) {
  const experienceText = experiences?.map(exp => 
    `${exp.position} na ${exp.company} (${exp.startDate} - ${exp.endDate || 'Atual'})`
  ).join(', ') || 'Sem experiências informadas'

  const educationText = education?.map(edu => 
    `${edu.degree} em ${edu.field} - ${edu.institution}`
  ).join(', ') || 'Sem formação informada'

  const skillsText = skills?.join(', ') || 'Sem habilidades informadas'

  return `
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
}

function generateExperiencePrompt(experience: any) {
  return `
Gere uma descrição profissional e impactante para a seguinte experiência de trabalho:

**Cargo:** ${experience.position || 'Não informado'}
**Empresa:** ${experience.company || 'Não informada'}
**Período:** ${experience.startDate || 'Não informado'} - ${experience.endDate || 'Atual'}
**Descrição atual:** ${experience.description || 'Sem descrição'}

A descrição deve:
- Ter entre 50-100 palavras
- Destacar responsabilidades e conquistas
- Usar verbos de ação no passado
- Incluir resultados quantificáveis quando possível
- Ser escrita em português brasileiro profissional

Retorne apenas o texto da descrição, sem formatação adicional.
`
}

function generateSkillsPrompt(skills: string[], personalInfo: any) {
  const currentSkills = skills?.join(', ') || 'Não informado'
  
  return `
Com base no perfil profissional de ${personalInfo?.fullName || 'candidato'}, sugira 8-12 habilidades relevantes e modernas para complementar as seguintes habilidades já informadas:

**Habilidades atuais:** ${currentSkills}

As habilidades sugeridas devem:
- Ser relevantes para o mercado atual
- Incluir habilidades técnicas e comportamentais
- Estar em português brasileiro
- Ser específicas e profissionais
- Complementar o perfil existente

Retorne apenas a lista de habilidades separadas por vírgula, sem numeração ou formatação adicional.
`
}
