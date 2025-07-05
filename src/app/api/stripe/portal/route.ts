import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCustomerPortalSession } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        email: true, 
        stripeCustomerId: true 
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    if (!user.stripeCustomerId) {
      return NextResponse.json(
        { error: 'Customer ID do Stripe não encontrado' },
        { status: 400 }
      )
    }

    // Criar sessão do portal do cliente
    const portalSession = await createCustomerPortalSession(user.stripeCustomerId)

    return NextResponse.json({
      url: portalSession.url,
    })

  } catch (error) {
    console.error('Erro ao criar portal do cliente:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
