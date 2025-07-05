import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!

export async function POST(request: NextRequest) {
  try {
    const body = await request.text()
    const headersList = headers()
    const signature = headersList.get('stripe-signature')

    if (!signature) {
      console.error('Webhook: Assinatura não encontrada')
      return NextResponse.json(
        { error: 'Assinatura não encontrada' },
        { status: 400 }
      )
    }

    let event
    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err) {
      console.error('Webhook: Erro na verificação da assinatura:', err)
      return NextResponse.json(
        { error: 'Assinatura inválida' },
        { status: 400 }
      )
    }

    console.log('Webhook recebido:', event.type)

    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionCanceled(event.data.object)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object)
        break

      case 'invoice.payment_failed':
        await handlePaymentFailed(event.data.object)
        break

      default:
        console.log(`Evento não tratado: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Erro no webhook:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

async function handleCheckoutCompleted(session: any) {
  try {
    console.log('Processando checkout completo:', session.id)

    const customerId = session.customer
    const subscriptionId = session.subscription

    // Buscar usuário pelo customer ID
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    })

    if (!user) {
      console.error('Usuário não encontrado para customer:', customerId)
      return
    }

    // Buscar detalhes da subscription
    const subscription = await stripe.subscriptions.retrieve(subscriptionId)
    const priceId = subscription.items.data[0]?.price.id

    // Determinar o plano baseado no price ID
    let newPlan = 'FREE'
    if (priceId === process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || 
        priceId === process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID) {
      newPlan = 'PREMIUM'
    }

    // Atualizar plano do usuário
    await prisma.user.update({
      where: { id: user.id },
      data: { 
        plan: newPlan,
        // Reset PDF downloads count for new premium users
        ...(newPlan === 'PREMIUM' && { pdfDownloads: 0 })
      },
    })

    console.log(`Usuário ${user.email} atualizado para plano ${newPlan}`)

  } catch (error) {
    console.error('Erro ao processar checkout:', error)
  }
}

async function handleSubscriptionUpdate(subscription: any) {
  try {
    console.log('Processando atualização de subscription:', subscription.id)

    const customerId = subscription.customer
    const status = subscription.status
    const priceId = subscription.items.data[0]?.price.id

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    })

    if (!user) {
      console.error('Usuário não encontrado para customer:', customerId)
      return
    }

    // Determinar plano baseado no status e price ID
    let newPlan = 'FREE'
    if (status === 'active' && 
        (priceId === process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID || 
         priceId === process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID)) {
      newPlan = 'PREMIUM'
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { plan: newPlan },
    })

    console.log(`Plano do usuário ${user.email} atualizado para ${newPlan}`)

  } catch (error) {
    console.error('Erro ao processar atualização de subscription:', error)
  }
}

async function handleSubscriptionCanceled(subscription: any) {
  try {
    console.log('Processando cancelamento de subscription:', subscription.id)

    const customerId = subscription.customer

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    })

    if (!user) {
      console.error('Usuário não encontrado para customer:', customerId)
      return
    }

    // Downgrade para plano gratuito
    await prisma.user.update({
      where: { id: user.id },
      data: { plan: 'FREE' },
    })

    console.log(`Usuário ${user.email} foi rebaixado para plano FREE`)

  } catch (error) {
    console.error('Erro ao processar cancelamento:', error)
  }
}

async function handlePaymentSucceeded(invoice: any) {
  try {
    console.log('Pagamento bem-sucedido:', invoice.id)
    
    const customerId = invoice.customer

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    })

    if (!user) {
      console.error('Usuário não encontrado para customer:', customerId)
      return
    }

    // Resetar downloads para usuários premium no início do ciclo
    if (user.plan === 'PREMIUM') {
      await prisma.user.update({
        where: { id: user.id },
        data: { pdfDownloads: 0 },
      })
    }

    console.log(`Downloads resetados para usuário premium: ${user.email}`)

  } catch (error) {
    console.error('Erro ao processar pagamento bem-sucedido:', error)
  }
}

async function handlePaymentFailed(invoice: any) {
  try {
    console.log('Pagamento falhou:', invoice.id)
    
    const customerId = invoice.customer

    // Buscar usuário
    const user = await prisma.user.findUnique({
      where: { stripeCustomerId: customerId },
    })

    if (!user) {
      console.error('Usuário não encontrado para customer:', customerId)
      return
    }

    // Opcional: Implementar lógica de grace period ou notificação
    console.log(`Pagamento falhou para usuário: ${user.email}`)

  } catch (error) {
    console.error('Erro ao processar falha de pagamento:', error)
  }
}
