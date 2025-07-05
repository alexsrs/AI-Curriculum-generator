import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export function CurriculumCardSkeleton() {
  return (
    <Card className="group">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {/* Título do currículo */}
            <Skeleton className="h-6 w-3/4 mb-2" />
            {/* Nome do usuário */}
            <Skeleton className="h-4 w-1/2 mb-2" />
            {/* Badge */}
            <Skeleton className="h-5 w-16" />
          </div>
          <div className="flex items-center gap-2">
            {/* Botões de ação */}
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
            <Skeleton className="h-8 w-8" />
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          {/* Data de criação */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>
          
          {/* Template */}
          <div className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
          
          {/* Email */}
          <Skeleton className="h-4 w-48" />
        </div>
      </CardContent>
      
      <div className="p-6 pt-3">
        <div className="flex gap-2 w-full">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </div>
    </Card>
  )
}

export function StatsOverviewSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total de Currículos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-24" />
        </CardContent>
      </Card>

      {/* Currículos Completos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-36" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>

      {/* Downloads */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-4" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-1" />
          <Skeleton className="h-3 w-28" />
        </CardContent>
      </Card>
    </div>
  )
}

export function DashboardContentSkeleton() {
  return (
    <>
      {/* Stats Skeleton */}
      <div className="mb-8">
        <StatsOverviewSkeleton />
      </div>

      {/* Actions Skeleton */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <Skeleton className="h-12 w-48" />
          <Skeleton className="h-12 w-36" />
          <Skeleton className="h-12 w-40" />
        </div>
      </div>

      {/* Curriculums List Skeleton */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <Skeleton className="h-6 w-48" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <CurriculumCardSkeleton />
          <CurriculumCardSkeleton />
          <CurriculumCardSkeleton />
          <CurriculumCardSkeleton />
          <CurriculumCardSkeleton />
          <CurriculumCardSkeleton />
        </div>
      </div>
    </>
  )
}

export function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-20" />
              </div>
              <Skeleton className="h-8 w-16" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardContentSkeleton />
      </div>
    </div>
  )
}
