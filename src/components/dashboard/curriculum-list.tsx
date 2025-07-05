'use client'

import { useState } from 'react'
import { useToast } from '@/hooks/use-toast'
import { CurriculumCard } from './curriculum-card'
import { CurriculumCardSkeleton } from '@/components/ui/dashboard-skeleton'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import Link from 'next/link'

interface CurriculumListProps {
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

export function CurriculumList({ curriculums: initialCurriculums }: CurriculumListProps) {
  const [curriculums, setCurriculums] = useState(initialCurriculums)
  const [isLoading, setIsLoading] = useState(false)
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set())
  const [duplicatingIds, setDuplicatingIds] = useState<Set<string>>(new Set())
  const { success, error, warning } = useToast()

  const handleDelete = async (id: string) => {
    // Confirmar antes de deletar
    if (!confirm('Tem certeza que deseja deletar este currículo? Esta ação não pode ser desfeita.')) {
      return
    }

    setDeletingIds(prev => new Set(prev).add(id))
    try {
      const response = await fetch(`/api/curriculum/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Erro ao deletar currículo')
      }

      // Remover da lista local
      setCurriculums(prev => prev.filter(c => c.id !== id))
      success('Currículo deletado!', 'O currículo foi removido com sucesso.')
      
    } catch (err) {
      console.error('Erro ao deletar:', err)
      error('Erro ao deletar', 'Não foi possível deletar o currículo. Tente novamente.')
    } finally {
      setDeletingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleDuplicate = async (curriculum: any) => {
    setDuplicatingIds(prev => new Set(prev).add(curriculum.id))
    try {
      // Criar uma cópia do currículo
      const duplicateData = {
        ...curriculum,
        title: `${curriculum.title} - Cópia`,
        id: undefined, // Remover ID para criar novo
      }

      const response = await fetch('/api/curriculum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(duplicateData),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao duplicar currículo')
      }

      // Adicionar à lista local
      setCurriculums(prev => [result.curriculum, ...prev])
      success('Currículo duplicado!', 'Uma cópia do currículo foi criada.')
      
    } catch (err) {
      console.error('Erro ao duplicar:', err)
      error('Erro ao duplicar', 'Não foi possível duplicar o currículo. Tente novamente.')
    } finally {
      setDuplicatingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(curriculum.id)
        return newSet
      })
    }
  }

  if (curriculums.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 mb-4">
          <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Nenhum currículo encontrado
        </h3>
        <p className="text-gray-500 mb-6">
          Crie seu primeiro currículo para começar
        </p>
        <Button size="lg" asChild>
          <Link href="/editor">
            <Plus className="h-5 w-5 mr-2" />
            Criar Primeiro Currículo
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {curriculums.map((curriculum) => {
        const isDeleting = deletingIds.has(curriculum.id)
        const isDuplicating = duplicatingIds.has(curriculum.id)
        
        if (isDeleting) {
          return (
            <div key={`deleting-${curriculum.id}`} className="relative">
              <CurriculumCardSkeleton />
              <div className="absolute inset-0 bg-red-50 bg-opacity-75 flex items-center justify-center rounded-lg">
                <div className="text-red-600 font-medium">Deletando...</div>
              </div>
            </div>
          )
        }
        
        return (
          <CurriculumCard
            key={curriculum.id}
            curriculum={curriculum}
            onDelete={handleDelete}
            onDuplicate={handleDuplicate}
            isLoading={isDuplicating}
          />
        )
      })}
      
      {/* Mostrar skeleton para currículos sendo duplicados */}
      {Array.from(duplicatingIds).map((id) => (
        <div key={`duplicating-${id}`} className="relative">
          <CurriculumCardSkeleton />
          <div className="absolute inset-0 bg-blue-50 bg-opacity-75 flex items-center justify-center rounded-lg">
            <div className="text-blue-600 font-medium">Criando cópia...</div>
          </div>
        </div>
      ))}
    </div>
  )
}
