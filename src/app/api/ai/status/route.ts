import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Verificar se a chave do OpenAI está configurada
    const hasOpenAIKey = !!process.env.OPENAI_API_KEY

    return NextResponse.json({
      hasOpenAIKey,
      isConfigured: hasOpenAIKey,
      message: hasOpenAIKey 
        ? 'IA está configurada e pronta para uso' 
        : 'Configure OPENAI_API_KEY no arquivo .env.local para usar a IA'
    })

  } catch (error) {
    console.error('Erro ao verificar status da IA:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
