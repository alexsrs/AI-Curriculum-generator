'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { CreditCard, Crown } from 'lucide-react'

export function SubscriptionManager() {
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
        // Se não tem assinatura ativa, redirecionar para pricing
        window.location.href = '/pricing'
      }
    } catch (error) {
      console.error('Error managing subscription:', error)
      alert('Erro ao abrir gerenciamento de assinatura')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpgrade = () => {
    window.location.href = '/pricing'
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={handleManageSubscription}
        variant="outline"
        size="sm"
        disabled={isLoading}
      >
        <CreditCard className="h-4 w-4 mr-2" />
        {isLoading ? 'Carregando...' : 'Gerenciar Assinatura'}
      </Button>
      
      <Button
        onClick={handleUpgrade}
        size="sm"
        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
      >
        <Crown className="h-4 w-4 mr-2" />
        Fazer Upgrade
      </Button>
    </div>
  )
}
