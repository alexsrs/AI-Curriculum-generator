import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { createCheckoutSession, createOrUpdateCustomer, getPlan } from '@/lib/stripe'
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

    const { planId } = await request.json()

    if (!planId) {
      return NextResponse.json(
        { error: 'ID do plano é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se o plano existe
    const plan = getPlan(planId)
    if (!plan || plan.id === 'free') {
      return NextResponse.json(
        { error: 'Plano inválido' },
        { status: 400 }
      )
    }

    // Buscar usuário no banco
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { 
        id: true, 
        name: true, 
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

    // Criar ou atualizar customer no Stripe
    const customer = await createOrUpdateCustomer(
      user.email,
      user.name || undefined,
      user.stripeCustomerId || undefined
    )

    // Salvar customer ID se não existir
    if (!user.stripeCustomerId) {
      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: customer.id }
      })
    }

    // Criar sessão de checkout
    const checkoutSession = await createCheckoutSession(
      plan.stripePriceId,
      customer.id,
      {
        userId: user.id,
        planId: plan.id,
      }
    )

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    })

  } catch (error) {
    console.error('Erro ao criar checkout:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
