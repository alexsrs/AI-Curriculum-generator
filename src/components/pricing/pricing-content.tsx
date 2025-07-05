'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check, Crown, Star } from 'lucide-react';
import { pricingPlans } from '@/lib/stripe';

interface PricingContentProps {
  session: any;
}

// Definir os planos baseado no pricingPlans importado
const PLANS = {
  FREE: {
    name: 'Gratuito',
    price: 0,
    features: [
      '3 downloads de PDF por mês',
      '2 templates básicos',
      '5 gerações de IA por mês',
      'Suporte por email',
    ],
    priceId: '',
  },
  MONTHLY: {
    name: 'Premium Mensal',
    price: 5.90,
    features: [
      'Downloads ilimitados de PDF',
      'Todos os templates (6+)',
      'IA ilimitada',
      'Suporte prioritário',
      'Análise de ATS',
      'Templates exclusivos',
    ],
    priceId: pricingPlans.find(p => p.id === 'premium')?.stripePriceId || '',
  },
  YEARLY: {
    name: 'Premium Anual',
    price: 19.90,
    features: [
      'Tudo do Premium',
      'Economia de R$ 50,90 por ano',
      'Templates sazonais exclusivos',
      'Consultoria de carreira (1x)',
    ],
    priceId: pricingPlans.find(p => p.id === 'premium-yearly')?.stripePriceId || '',
  },
} as const;

export default function PricingContent({ session }: PricingContentProps) {
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleSubscribe = async (planType: 'MONTHLY' | 'YEARLY') => {
    if (!session) {
      window.location.href = '/login';
      return;
    }

    setIsLoading(planType);

    try {
      const plan = PLANS[planType];
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId: plan.priceId,
          planType,
        }),
      });

      const data = await response.json();

      if (data.sessionId) {
        // Redirecionar para o Stripe Checkout
        const stripe = await import('@stripe/stripe-js').then(m => 
          m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
        );
        
        if (stripe) {
          await stripe.redirectToCheckout({ sessionId: data.sessionId });
        }
      } else {
        alert('Erro ao criar sessão de checkout');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      alert('Erro ao processar pagamento');
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Plano Gratuito */}
      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-2xl">Gratuito</CardTitle>
          <CardDescription>
            Para experimentar nossa plataforma
          </CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">R$ 0</span>
            <span className="text-gray-600">/mês</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ul className="space-y-3">
              {PLANS.FREE.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full" 
              variant="outline"
              onClick={() => window.location.href = session ? '/dashboard' : '/login'}
            >
              {session ? 'Ir para Dashboard' : 'Começar Grátis'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plano Mensal */}
      <Card className="relative border-blue-500 shadow-lg">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white px-3 py-1">
            <Star className="h-4 w-4 mr-1" />
            Mais Popular
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">Premium Mensal</CardTitle>
          <CardDescription>
            Ideal para uso pessoal regular
          </CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">R$ 5,90</span>
            <span className="text-gray-600">/mês</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ul className="space-y-3">
              {PLANS.MONTHLY.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full bg-blue-600 hover:bg-blue-700" 
              onClick={() => handleSubscribe('MONTHLY')}
              disabled={isLoading === 'MONTHLY'}
            >
              {isLoading === 'MONTHLY' ? 'Processando...' : 'Assinar Premium Mensal'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plano Anual */}
      <Card className="relative border-purple-500">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-purple-500 text-white px-3 py-1">
            <Crown className="h-4 w-4 mr-1" />
            Melhor Valor
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="text-2xl">Premium Anual</CardTitle>
          <CardDescription>
            Economize 67% com o plano anual
          </CardDescription>
          <div className="mt-4">
            <span className="text-4xl font-bold">R$ 19,90</span>
            <span className="text-gray-600">/ano</span>
            <div className="text-sm text-green-600 font-medium mt-1">
              Equivale a R$ 1,66/mês
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <ul className="space-y-3">
              {PLANS.YEARLY.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-3" />
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
            
            <Button 
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700" 
              onClick={() => handleSubscribe('YEARLY')}
              disabled={isLoading === 'YEARLY'}
            >
              {isLoading === 'YEARLY' ? 'Processando...' : 'Assinar Premium Anual'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
