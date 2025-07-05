'use client'

import { PdfExportButton } from '@/components/ui/pdf-export-button'
import { Button } from '@/components/ui/button'
import { Edit3 } from 'lucide-react'
import Link from 'next/link'

interface PreviewActionsProps {
  curriculumId: string
  curriculumTitle: string
}

export function PreviewActions({ curriculumId, curriculumTitle }: PreviewActionsProps) {
  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" asChild>
        <Link href={`/editor/${curriculumId}`}>
          <Edit3 className="h-4 w-4 mr-2" />
          Editar
        </Link>
      </Button>
      
      <PdfExportButton
        curriculumId={curriculumId}
        title={curriculumTitle}
      />
    </div>
  )
}

export function PreviewBottomActions({ curriculumId, curriculumTitle }: PreviewActionsProps) {
  return (
    <div className="mt-6 flex justify-center gap-4">
      <Button variant="outline" asChild>
        <Link href={`/editor/${curriculumId}`}>
          <Edit3 className="h-4 w-4 mr-2" />
          Continuar Editando
        </Link>
      </Button>
      
      <PdfExportButton
        curriculumId={curriculumId}
        title={curriculumTitle}
      >
        Exportar para PDF
      </PdfExportButton>
    </div>
  )
}
