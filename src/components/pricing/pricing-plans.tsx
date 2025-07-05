'use client';

import { useState } from 'react';
import { User } from 'next-auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import { pricingPlans } from '@/lib/stripe'; // Corrigido: importação nomeada

interface PricingPlansProps {
  user: User | null;
}

// Definir PLANS baseado no pricingPlans importado
const PLANS = {
  FREE: {
    name: 'Gratuito',
    description: 'Para começar a criar seus currículos',
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
    description: 'Para profissionais que querem se destacar',
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
    description: 'Melhor valor - economia de 67%',
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

export function PricingPlans({ user }: PricingPlansProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (priceId: string, planType: string) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    setLoading(planType);

    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          planType,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Redirecionar para o Stripe Checkout
        const stripe = (await import('@stripe/stripe-js')).loadStripe(
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
        );
        
        const stripeInstance = await stripe;
        await stripeInstance?.redirectToCheckout({
          sessionId: data.sessionId,
        });
      } else {
        console.error('Error creating checkout session:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
      {/* Free Plan */}
      <Card className="relative">
        <CardHeader>
          <CardTitle className="text-center">
            {PLANS.FREE.name}
          </CardTitle>
          <CardDescription className="text-center">
            {PLANS.FREE.description}
          </CardDescription>
          <div className="text-center">
            <span className="text-4xl font-bold">Grátis</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            {PLANS.FREE.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <Button 
            className="w-full" 
            variant="outline"
            disabled={!user}
          >
            {user ? 'Plano Atual' : 'Fazer Login'}
          </Button>
        </CardContent>
      </Card>

      {/* Monthly Plan */}
      <Card className="relative border-2 border-primary">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-primary text-primary-foreground">
            Mais Popular
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="text-center">
            {PLANS.MONTHLY.name}
          </CardTitle>
          <CardDescription className="text-center">
            {PLANS.MONTHLY.description}
          </CardDescription>
          <div className="text-center">
            <span className="text-4xl font-bold">R$ 5,90</span>
            <span className="text-gray-600">/mês</span>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            {PLANS.MONTHLY.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <Button 
            className="w-full" 
            onClick={() => handleCheckout(PLANS.MONTHLY.priceId, 'MONTHLY')}
            disabled={loading === 'MONTHLY'}
          >
            {loading === 'MONTHLY' ? 'Processando...' : 'Assinar Mensal'}
          </Button>
        </CardContent>
      </Card>

      {/* Yearly Plan */}
      <Card className="relative">
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge variant="secondary">
            Economize 67%
          </Badge>
        </div>
        <CardHeader>
          <CardTitle className="text-center">
            {PLANS.YEARLY.name}
          </CardTitle>
          <CardDescription className="text-center">
            {PLANS.YEARLY.description}
          </CardDescription>
          <div className="text-center">
            <span className="text-4xl font-bold">R$ 19,90</span>
            <span className="text-gray-600">/ano</span>
            <div className="text-sm text-green-600 mt-1">
              ~R$ 1,66/mês
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 mb-6">
            {PLANS.YEARLY.features.map((feature, index) => (
              <li key={index} className="flex items-center">
                <Check className="h-4 w-4 text-green-500 mr-2" />
                <span className="text-sm">{feature}</span>
              </li>
            ))}
          </ul>
          <Button 
            className="w-full" 
            variant="outline"
            onClick={() => handleCheckout(PLANS.YEARLY.priceId, 'YEARLY')}
            disabled={loading === 'YEARLY'}
          >
            {loading === 'YEARLY' ? 'Processando...' : 'Assinar Anual'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
