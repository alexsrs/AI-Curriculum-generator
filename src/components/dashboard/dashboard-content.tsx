'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { CurriculumList } from './curriculum-list'
import { StatsOverview } from './stats-overview'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { PlanInfo } from '@/components/ui/plan-info'
import { Plus, FileText, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { StatsOverviewSkeleton, CurriculumCardSkeleton } from '@/components/ui/dashboard-skeleton'

interface DashboardContentProps {
  initialUser: {
    id: string
    name: string | null
    email: string
    image: string | null
    plan: string
    pdfDownloads: number
    curriculums: Array<{
      id: string
      title: string
      template: string
      createdAt: Date
      updatedAt: Date
      personalInfo: {
        fullName: string
        email: string
        phone: string | null
      } | null
    }>
  }
}

export function DashboardContent({ initialUser }: DashboardContentProps) {
  const { data: session } = useSession()
  const [user, setUser] = useState(initialUser)
  const [isLoading, setIsLoading] = useState(false)
  const [statsLoading, setStatsLoading] = useState(true)

  // Simular carregamento inicial das estatísticas
  useEffect(() => {
    const loadStats = async () => {
      // Simular delay de carregamento das estatísticas
      await new Promise(resolve => setTimeout(resolve, 800))
      setStatsLoading(false)
    }
    
    loadStats()
  }, [])

  // Função para recarregar dados do usuário
  const refreshUserData = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/user/dashboard')
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      }
    } catch (error) {
      console.error('Erro ao recarregar dados:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Calcular estatísticas
  const totalCurriculums = user.curriculums.length
  const completedCurriculums = user.curriculums.length // Por enquanto, considerar todos como completos
  const totalDownloads = user.pdfDownloads || 0

  return (
    <>
      {/* Estatísticas */}
      <div className="mb-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            {statsLoading ? (
              <StatsOverviewSkeleton />
            ) : (
              <StatsOverview
                totalCurriculums={totalCurriculums}
                completedCurriculums={completedCurriculums}
                totalDownloads={totalDownloads}
                userPlan={user.plan}
              />
            )}
          </div>
          <div className="lg:col-span-1">
            <PlanInfo />
          </div>
        </div>
      </div>

      {/* Ações Rápidas */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button size="lg" asChild>
            <Link href="/editor">
              <Plus className="h-5 w-5 mr-2" />
              Criar Novo Currículo
            </Link>
          </Button>
          
          <Button variant="outline" size="lg" asChild>
            <Link href="/templates">
              <FileText className="h-5 w-5 mr-2" />
              Explorar Templates
            </Link>
          </Button>
          
          <Button 
            variant="outline" 
            size="lg" 
            onClick={refreshUserData} 
            disabled={isLoading || statsLoading}
          >
            <RefreshCw className={`h-5 w-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            {isLoading ? 'Atualizando...' : 'Atualizar Dados'}
          </Button>
          
          {user.plan === 'FREE' && (
            <Button variant="outline" size="lg" asChild>
              <Link href="/pricing">
                ⭐ Upgrade para Premium
              </Link>
            </Button>
          )}
        </div>
      </div>

      {/* Lista de Currículos */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Meus Currículos ({totalCurriculums})
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CurriculumCardSkeleton />
            <CurriculumCardSkeleton />
            <CurriculumCardSkeleton />
          </div>
        ) : totalCurriculums === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-gray-400 mb-4">
                <FileText className="h-16 w-16 mx-auto" />
              </div>
              <CardTitle className="text-xl text-gray-600 mb-2">
                Nenhum currículo encontrado
              </CardTitle>
              <p className="text-gray-500 mb-6">
                Comece criando seu primeiro currículo profissional
              </p>
              <Button size="lg" asChild>
                <Link href="/editor">
                  <Plus className="h-5 w-5 mr-2" />
                  Criar Primeiro Currículo
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <CurriculumList curriculums={user.curriculums} />
        )}
      </div>
    </>
  )
}
