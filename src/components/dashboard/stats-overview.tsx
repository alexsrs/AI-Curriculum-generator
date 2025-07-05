import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { FileText, Download, Star, TrendingUp } from 'lucide-react'

interface StatsOverviewProps {
  totalCurriculums: number
  completedCurriculums: number
  totalDownloads: number
  userPlan: string
}

export function StatsOverview({ 
  totalCurriculums, 
  completedCurriculums, 
  totalDownloads, 
  userPlan 
}: StatsOverviewProps) {
  const completionRate = totalCurriculums > 0 
    ? Math.round((completedCurriculums / totalCurriculums) * 100) 
    : 0

  const stats = [
    {
      title: 'Total de Currículos',
      value: totalCurriculums,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Currículos Concluídos',
      value: completedCurriculums,
      icon: Star,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: 'Downloads PDF',
      value: totalDownloads,
      icon: Download,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Taxa de Conclusão',
      value: `${completionRate}%`,
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">
              {stat.title}
            </CardTitle>
            <div className={`p-2 rounded-full ${stat.bgColor}`}>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold text-gray-900">
                {stat.value}
              </div>
              {stat.title === 'Taxa de Conclusão' && (
                <div className="text-xs text-gray-500">
                  {completedCurriculums}/{totalCurriculums}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Card do Plano do Usuário */}
      <Card className="md:col-span-2 lg:col-span-1 hover:shadow-md transition-shadow">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">
            Plano Atual
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900 capitalize">
              {userPlan}
            </div>
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              userPlan === 'PREMIUM' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {userPlan === 'PREMIUM' ? '⭐ Premium' : '🆓 Gratuito'}
            </div>
          </div>
          {userPlan === 'FREE' && (
            <p className="text-xs text-gray-500 mt-1">
              Upgrade para acessar templates premium
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
