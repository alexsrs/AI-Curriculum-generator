import { Curriculum } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '../ui/badge'
import { PdfExportButton } from '@/components/ui/pdf-export-button'
import { CalendarDays, FileText, Edit3, Trash2, Copy, Loader2 } from 'lucide-react'
import Link from 'next/link'

interface CurriculumCardProps {
  curriculum: {
    id: string
    title: string
    template: string
    createdAt: Date
    updatedAt: Date
    personalInfo: {
      fullName: string
      email: string
      phone: string | null
      // outros campos opcionais conforme necessário
    } | null
  }
  onDelete?: (id: string) => void
  onDuplicate?: (curriculum: any) => void
  isLoading?: boolean
}

export function CurriculumCard({ curriculum, onDelete, onDuplicate, isLoading = false }: CurriculumCardProps) {
  const formatDate = (date: Date | string) => {
    try {
      const dateObj = date instanceof Date ? date : new Date(date)
      return new Intl.DateTimeFormat('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).format(dateObj)
    } catch (error) {
      console.error('Erro ao formatar data:', error)
      return 'Data inválida'
    }
  }

  return (
    <Card className={`group hover:shadow-lg transition-shadow duration-200 ${isLoading ? 'opacity-50' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 mb-1">
              {curriculum.title}
            </CardTitle>
            <p className="text-sm text-gray-600 mb-2">
              {curriculum.personalInfo?.fullName || 'Nome não informado'}
            </p>
            <Badge 
              variant="secondary" 
              className="bg-blue-100 text-blue-800"
            >
              Ativo
            </Badge>
          </div>
          <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="sm"
              asChild
              disabled={isLoading}
            >
              <Link href={`/editor/${curriculum.id}`}>
                <Edit3 className="h-4 w-4" />
              </Link>
            </Button>
            <PdfExportButton
              curriculumId={curriculum.id}
              title={curriculum.title}
              variant="ghost"
              size="sm"
              disabled={isLoading}
            />
            {onDuplicate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(curriculum)}
                className="text-blue-500 hover:text-blue-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(curriculum.id)}
                className="text-red-500 hover:text-red-700"
                disabled={isLoading}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <CalendarDays className="h-4 w-4" />
            <span>Criado em {formatDate(curriculum.createdAt)}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <FileText className="h-4 w-4" />
            <span>Template: {curriculum.template}</span>
          </div>
          
          {curriculum.personalInfo?.email && (
            <div className="text-sm text-gray-500">
              📧 {curriculum.personalInfo.email}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-3">
        <div className="flex gap-2 w-full">
          <Button 
            variant="outline" 
            className="flex-1"
            asChild
            disabled={isLoading}
          >
            <Link href={`/preview/${curriculum.id}`}>
              Visualizar
            </Link>
          </Button>
          <Button 
            className="flex-1"
            asChild
            disabled={isLoading}
          >
            <Link href={`/editor/${curriculum.id}`}>
              Editar
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
