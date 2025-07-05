'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Crown, Download, Zap } from 'lucide-react'

interface PlanInfoProps {
  className?: string
}

interface UserPlan {
  plan: string
  pdfDownloads: number
}

const MAX_FREE_DOWNLOADS = 3

export function PlanInfo({ className }: PlanInfoProps) {
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserPlan = async () => {
      try {
        const response = await fetch('/api/user/plan')
        if (response.ok) {
          const data = await response.json()
          setUserPlan(data)
        }
      } catch (error) {
        console.error('Erro ao buscar plano do usuário:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserPlan()
  }, [])

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-2 bg-gray-200 rounded w-full"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!userPlan) return null

  const isPremium = userPlan.plan !== 'FREE'
  const downloadsUsed = userPlan.pdfDownloads
  const downloadsRemaining = isPremium ? 'Ilimitado' : Math.max(0, MAX_FREE_DOWNLOADS - downloadsUsed)
  const progressValue = isPremium ? 0 : (downloadsUsed / MAX_FREE_DOWNLOADS) * 100

  return (
    <Card className={className}>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium flex items-center gap-2">
          {isPremium ? (
            <>
              <Crown className="h-4 w-4 text-yellow-500" />
              Plano Premium
            </>
          ) : (
            <>
              <Zap className="h-4 w-4 text-blue-500" />
              Plano Gratuito
            </>
          )}
          <Badge variant={isPremium ? 'default' : 'secondary'} className="ml-auto">
            {isPremium ? 'Premium' : 'Gratuito'}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Downloads PDF</span>
            <span className="font-medium">
              {downloadsUsed} / {isPremium ? '∞' : MAX_FREE_DOWNLOADS}
            </span>
          </div>
          
          {!isPremium && (
            <div className="space-y-2">
              <Progress value={progressValue} className="h-2" />
              <p className="text-xs text-gray-500">
                {downloadsRemaining === 0 ? (
                  <span className="text-orange-600 font-medium">
                    Limite atingido. Faça upgrade para continuar.
                  </span>
                ) : (
                  `${downloadsRemaining} downloads restantes`
                )}
              </p>
            </div>
          )}
          
          {!isPremium && (
            <Button size="sm" className="w-full" variant="outline">
              <Crown className="h-4 w-4 mr-2" />
              Fazer Upgrade
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
