'use client'

import { useState } from 'react'
import { toast } from '@/hooks/use-toast'

interface UsePdfDownloadOptions {
  onSuccess?: () => void
  onError?: (error: string) => void
}

interface UsePdfDownloadReturn {
  downloadPdf: (curriculumId: string, title?: string) => Promise<void>
  isDownloading: boolean
}

export function usePdfDownload(options: UsePdfDownloadOptions = {}): UsePdfDownloadReturn {
  const [isDownloading, setIsDownloading] = useState(false)

  const downloadPdf = async (curriculumId: string, title = 'curriculo') => {
    if (isDownloading) return

    setIsDownloading(true)
    
    try {
      const response = await fetch('/api/pdf/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ curriculumId }),
      })

      if (!response.ok) {
        const error = await response.json()
        
        if (error.code === 'LIMIT_EXCEEDED') {
          toast({
            title: 'Limite atingido',
            description: error.message,
            variant: 'destructive',
          })
          options.onError?.(error.message)
          return
        }
        
        throw new Error(error.error || 'Erro ao gerar PDF')
      }

      // Converter resposta em blob
      const blob = await response.blob()
      
      // Criar URL temporária para download
      const url = window.URL.createObjectURL(blob)
      
      // Criar elemento de link para forçar download
      const link = document.createElement('a')
      link.href = url
      link.download = `${title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`
      document.body.appendChild(link)
      link.click()
      
      // Limpar recursos
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)

      toast({
        title: 'PDF gerado com sucesso!',
        description: 'O download foi iniciado automaticamente.',
        variant: 'default',
      })

      options.onSuccess?.()

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido'
      
      toast({
        title: 'Erro ao gerar PDF',
        description: errorMessage,
        variant: 'destructive',
      })

      options.onError?.(errorMessage)
    } finally {
      setIsDownloading(false)
    }
  }

  return {
    downloadPdf,
    isDownloading,
  }
}
