'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreditCard, Settings, Crown } from 'lucide-react'

interface SubscriptionManagerProps {
  userPlan: string
  pdfDownloads: number
}

export function SubscriptionManager({ userPlan, pdfDownloads }: SubscriptionManagerProps) {
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

  const isPremium = userPlan === 'PREMIUM'
  const maxDownloads = isPremium ? 'Ilimitado' : '3'
  const remainingDownloads = isPremium ? 'Ilimitado' : Math.max(0, 3 - pdfDownloads)

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
            <CardTitle>Plano Atual</CardTitle>
          </div>
          <Badge variant={isPremium ? 'default' : 'secondary'}>
            {isPremium ? 'Premium' : 'Gratuito'}
          </Badge>
        </div>
        <CardDescription>
          Gerencie sua assinatura e downloads
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {remainingDownloads}
            </div>
            <div className="text-sm text-gray-600">
              Downloads restantes
            </div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-900">
              {maxDownloads}
            </div>
            <div className="text-sm text-gray-600">
              Limite mensal
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="font-medium">Recursos do seu plano:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {isPremium ? (
              <>
                <li>✅ Downloads ilimitados de PDF</li>
                <li>✅ Todos os templates (6+)</li>
                <li>✅ IA ilimitada</li>
                <li>✅ Suporte prioritário</li>
                <li>✅ Análise de ATS</li>
              </>
            ) : (
              <>
                <li>✅ 3 downloads de PDF por mês</li>
                <li>✅ 2 templates básicos</li>
                <li>✅ 5 gerações de IA por mês</li>
                <li>❌ Templates premium</li>
                <li>❌ IA ilimitada</li>
              </>
            )}
          </ul>
        </div>

        <div className="flex gap-2">
          {isPremium ? (
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
              Fazer Upgrade
            </Button>
          )}
        </div>

        {!isPremium && pdfDownloads >= 3 && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <p className="text-sm text-amber-800">
              <strong>Limite atingido!</strong> Você já usou todos os seus downloads gratuitos deste mês.
              Faça upgrade para continuar baixando PDFs.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
