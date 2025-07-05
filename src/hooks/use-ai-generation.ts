import { useState } from 'react'
import { useToast } from './use-toast'

export interface AIGenerationRequest {
  personalInfo?: any
  experiences?: any[]
  education?: any[]
  skills?: string[]
  type: 'summary' | 'experience' | 'skills'
}

export interface AIGenerationResponse {
  success: boolean
  generatedText: string
  type: string
  tokensUsed: number
}

export function useAIGeneration() {
  const [isLoading, setIsLoading] = useState(false)
  const [lastGeneration, setLastGeneration] = useState<AIGenerationResponse | null>(null)
  const { success, error } = useToast()

  const generateText = async (request: AIGenerationRequest): Promise<string | null> => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao gerar texto com IA')
      }

      setLastGeneration(result)
      
      // Mostrar feedback de sucesso
      const typeLabels = {
        summary: 'resumo profissional',
        experience: 'descrição da experiência',
        skills: 'sugestões de habilidades'
      }
      
      success(
        'Texto gerado com IA! ✨',
        `${typeLabels[request.type]} foi gerado com sucesso usando ${result.tokensUsed} tokens.`
      )

      return result.generatedText
      
    } catch (err: any) {
      console.error('Erro na geração de IA:', err)
      
      // Tratar diferentes tipos de erro
      const errorMessage = err.message || 'Erro desconhecido ao gerar texto'
      
      if (errorMessage.includes('API')) {
        error(
          'Erro de API',
          'Problema com a chave do OpenAI. Verifique a configuração.'
        )
      } else if (errorMessage.includes('limite')) {
        error(
          'Limite atingido',
          'Limite de uso da API atingido. Tente novamente em alguns minutos.'
        )
      } else {
        error(
          'Erro na geração de IA',
          'Não foi possível gerar o texto. Tente novamente.'
        )
      }
      
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const generateSummary = async (personalInfo: any, experiences: any[], education: any[], skills: string[]) => {
    return await generateText({
      personalInfo,
      experiences,
      education,
      skills,
      type: 'summary'
    })
  }

  const generateExperienceDescription = async (experience: any, personalInfo?: any) => {
    return await generateText({
      personalInfo,
      experiences: [experience],
      type: 'experience'
    })
  }

  const generateSkillsSuggestions = async (currentSkills: string[], personalInfo?: any) => {
    return await generateText({
      personalInfo,
      skills: currentSkills,
      type: 'skills'
    })
  }

  return {
    generateText,
    generateSummary,
    generateExperienceDescription,
    generateSkillsSuggestions,
    isLoading,
    lastGeneration,
  }
}
