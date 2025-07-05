import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

export interface PricingPlan {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  stripePriceId: string
  popular?: boolean
}

export const pricingPlans: PricingPlan[] = [
  {
    id: 'free',
    name: 'Gratuito',
    description: 'Para começar a criar seus currículos',
    price: 0,
    currency: 'BRL',
    interval: 'month',
    stripePriceId: '', // Não tem price ID pois é gratuito
    features: [
      '3 downloads de PDF por mês',
      '2 templates básicos',
      '5 gerações de IA por mês',
      'Suporte por email',
    ],
  },
  {
    id: 'premium',
    name: 'Premium',
    description: 'Para profissionais que querem se destacar',
    price: 5.90,
    currency: 'BRL',
    interval: 'month',
    stripePriceId: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID!,
    popular: true,
    features: [
      'Downloads ilimitados de PDF',
      'Todos os templates (6+)',
      'IA ilimitada',
      'Suporte prioritário',
      'Análise de ATS',
      'Templates exclusivos',
    ],
  },
  {
    id: 'premium-yearly',
    name: 'Premium Anual',
    description: 'Melhor valor - economia de 67%',
    price: 19.90,
    currency: 'BRL',
    interval: 'year',
    stripePriceId: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!,
    features: [
      'Tudo do Premium',
      'Economia de R$ 50,90 por ano',
      'Templates sazonais exclusivos',
      'Consultoria de carreira (1x)',
    ],
  },
]

export const getPlan = (planId: string): PricingPlan | undefined => {
  return pricingPlans.find((plan) => plan.id === planId)
}

export const createCheckoutSession = async (
  priceId: string,
  customerId?: string,
  metadata?: Record<string, string>
): Promise<Stripe.Checkout.Session> => {
  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    customer: customerId,
    metadata,
    success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
    cancel_url: `${process.env.NEXTAUTH_URL}/pricing?canceled=true`,
    allow_promotion_codes: true,
    billing_address_collection: 'auto',
    automatic_tax: {
      enabled: true,
    },
  })

  return session
}

export const createCustomerPortalSession = async (
  customerId: string
): Promise<Stripe.BillingPortal.Session> => {
  const session = await stripe.billingPortal.sessions.create({
    customer: customerId,
    return_url: `${process.env.NEXTAUTH_URL}/dashboard`,
  })

  return session
}

export const createOrUpdateCustomer = async (
  email: string,
  name?: string,
  customerId?: string
): Promise<Stripe.Customer> => {
  if (customerId) {
    // Atualizar customer existente
    const customer = await stripe.customers.update(customerId, {
      email,
      name,
    })
    return customer
  } else {
    // Criar novo customer
    const customer = await stripe.customers.create({
      email,
      name,
      metadata: {
        createdAt: new Date().toISOString(),
      },
    })
    return customer
  }
}

export const getCustomerSubscriptions = async (
  customerId: string
): Promise<Stripe.Subscription[]> => {
  const subscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
  })

  return subscriptions.data
}

export const cancelSubscription = async (
  subscriptionId: string
): Promise<Stripe.Subscription> => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: true,
  })

  return subscription
}

export const reactivateSubscription = async (
  subscriptionId: string
): Promise<Stripe.Subscription> => {
  const subscription = await stripe.subscriptions.update(subscriptionId, {
    cancel_at_period_end: false,
  })

  return subscription
}

// Verificar se um customer tem uma assinatura ativa
export const hasActiveSubscription = async (customerId: string): Promise<boolean> => {
  try {
    const subscriptions = await getCustomerSubscriptions(customerId)
    return subscriptions.length > 0
  } catch (error) {
    console.error('Erro ao verificar assinatura:', error)
    return false
  }
}

// Obter plano atual do customer
export const getCurrentPlan = async (customerId: string): Promise<string> => {
  try {
    const subscriptions = await getCustomerSubscriptions(customerId)
    
    if (subscriptions.length === 0) {
      return 'FREE'
    }

    const subscription = subscriptions[0]
    const priceId = subscription.items.data[0]?.price.id

    // Mapear price ID para plano
    const plan = pricingPlans.find((p) => p.stripePriceId === priceId)
    
    if (plan?.id === 'premium' || plan?.id === 'premium-yearly') {
      return 'PREMIUM'
    }

    return 'FREE'
  } catch (error) {
    console.error('Erro ao obter plano atual:', error)
    return 'FREE'
  }
}

export { stripe }
