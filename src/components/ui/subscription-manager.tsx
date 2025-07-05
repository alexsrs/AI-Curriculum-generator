'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Settings, Crown } from 'lucide-react'

type SubscriptionManagerProps = {
  userPlan: 'FREE' | 'MONTHLY' | 'YEARLY'
  hasActiveSubscription: boolean
}

export function SubscriptionManager({ userPlan, hasActiveSubscription }: SubscriptionManagerProps) {
  const [isLoading, setIsLoading] = useState(false)

  const handleManageSubscription = async () => {
    setIsLoading(true)
    
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (data.url) {
        window.location.href = data.url
      } else {
        throw new Error('URL do portal não encontrada')
      }
    } catch (error) {
      console.error('Erro ao abrir portal:', error)
      alert('Erro ao abrir portal de gerenciamento. Tente novamente.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = () => {
    window.location.href = '/pricing'
  }

  const isPremium = userPlan === 'MONTHLY' || userPlan === 'YEARLY'
  const planName = userPlan === 'YEARLY' ? 'Premium Anual' : 
                  userPlan === 'MONTHLY' ? 'Premium Mensal' : 'Gratuito'

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {isPremium ? (
              <Crown className="h-5 w-5 text-yellow-500" />
            ) : (
              <CreditCard className="h-5 w-5 text-gray-500" />
            )}
            <CardTitle>Assinatura</CardTitle>
          </div>
          <Badge variant={isPremium ? 'default' : 'secondary'}>
            {planName}
          </Badge>
        </div>
        <CardDescription>
          Gerencie sua assinatura e acesso às funcionalidades
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h4 className="font-medium">Recursos do seu plano:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {isPremium ? (
              <>
                <li>✅ Downloads ilimitados de PDF</li>
                <li>✅ Todos os templates</li>
                <li>✅ Geração com IA ilimitada</li>
                <li>✅ Suporte prioritário</li>
              </>
            ) : (
              <>
                <li>✅ 2 downloads de PDF por mês</li>
                <li>✅ Templates básicos</li>
                <li>✅ Geração com IA limitada</li>
                <li>❌ Templates premium</li>
                <li>❌ Suporte prioritário</li>
              </>
            )}
          </ul>
        </div>

        <div className="flex gap-2">
          {isPremium && hasActiveSubscription ? (
            <Button
              onClick={handleManageSubscription}
              disabled={isLoading}
              className="flex-1"
              variant="outline"
            >
              <Settings className="h-4 w-4 mr-2" />
              {isLoading ? 'Carregando...' : 'Gerenciar Assinatura'}
            </Button>
          ) : (
            <Button
              onClick={handleUpgrade}
              className="flex-1"
              variant="default"
            >
              <Crown className="h-4 w-4 mr-2" />
              {isPremium ? 'Reativar Assinatura' : 'Fazer Upgrade'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
