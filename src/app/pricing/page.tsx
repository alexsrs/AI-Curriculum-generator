'use client'

import { useState } from 'react'
import { Check, Sparkles, Crown } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { pricingPlans } from '@/lib/stripe'

export default function PricingPage() {
  const [isLoading, setIsLoading] = useState<string | null>(null)

  const handleCheckout = async (planId: string) => {
    if (planId === 'free') {
      window.location.href = '/dashboard'
      return
    }

    setIsLoading(planId)
    
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ planId }),
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL de checkout não encontrada')
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error)
      alert('Erro ao processar pagamento. Tente novamente.')
    } finally {
      setIsLoading(null)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha seu plano
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Crie currículos profissionais com IA e se destaque no mercado de trabalho
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {pricingPlans.map((plan) => (
            <Card 
              key={plan.id} 
              className={`relative ${
                plan.popular 
                  ? 'border-blue-500 border-2 scale-105 shadow-xl' 
                  : 'border-gray-200'
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                    <Sparkles className="w-4 h-4" />
                    Mais Popular
                  </span>
                </div>
              )}

              <CardHeader className="text-center pb-8">
                <div className="flex justify-center mb-4">
                  {plan.id === 'free' && (
                    <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                      <Check className="w-6 h-6 text-gray-600" />
                    </div>
                  )}
                  {(plan.id === 'premium' || plan.id === 'premium-yearly') && (
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Crown className="w-6 h-6 text-blue-600" />
                    </div>
                  )}
                </div>

                <CardTitle className="text-2xl font-bold text-gray-900">
                  {plan.name}
                </CardTitle>
                
                <CardDescription className="text-gray-600 mt-2">
                  {plan.description}
                </CardDescription>

                <div className="mt-6">
                  <div className="flex items-center justify-center">
                    <span className="text-4xl font-bold text-gray-900">
                      R$ {plan.price.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{plan.interval === 'month' ? 'mês' : 'ano'}
                    </span>
                  </div>
                  
                  {plan.id === 'premium-yearly' && (
                    <p className="text-sm text-green-600 mt-2">
                      Economize R$ 39,80 por ano
                    </p>
                  )}
                </div>
              </CardHeader>

              <CardContent>
                <Button
                  className={`w-full mb-6 ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-900 hover:bg-gray-800 text-white'
                  }`}
                  onClick={() => handleCheckout(plan.id)}
                  disabled={isLoading === plan.id}
                >
                  {isLoading === plan.id ? (
                    'Processando...'
                  ) : plan.id === 'free' ? (
                    'Começar Grátis'
                  ) : (
                    'Assinar Agora'
                  )}
                </Button>

                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600">
            Todos os planos incluem garantia de 30 dias. 
            <br />
            Cancele a qualquer momento sem taxas adicionais.
          </p>
        </div>
      </div>
    </div>
  )
}
