'use client'

import { Download, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { usePdfDownload } from '@/hooks/use-pdf-download'

interface PdfExportButtonProps {
  curriculumId: string
  title?: string
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  className?: string
  disabled?: boolean
  children?: React.ReactNode
}

export function PdfExportButton({
  curriculumId,
  title,
  variant = 'default',
  size = 'default',
  className,
  disabled,
  children,
}: PdfExportButtonProps) {
  const { downloadPdf, isDownloading } = usePdfDownload()

  const handleDownload = () => {
    downloadPdf(curriculumId, title)
  }

  return (
    <Button
      onClick={handleDownload}
      disabled={disabled || isDownloading}
      variant={variant}
      size={size}
      className={className}
    >
      {isDownloading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Download className="h-4 w-4" />
      )}
      {children || (isDownloading ? 'Gerando PDF...' : 'Baixar PDF')}
    </Button>
  )
}
