import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { generatePDF } from '@/lib/pdf-generator'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { curriculumId } = await request.json()

    if (!curriculumId) {
      return NextResponse.json(
        { error: 'ID do currículo é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar currículo completo
    const curriculum = await prisma.curriculum.findUnique({
      where: {
        id: curriculumId,
        userId: session.user.id, // Garantir que o usuário tem acesso
      },
      include: {
        personalInfo: true,
        experiences: {
          orderBy: { order: 'asc' }
        },
        educations: {
          orderBy: { order: 'asc' }
        },
        skills: {
          orderBy: { order: 'asc' }
        },
        languages: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!curriculum) {
      return NextResponse.json(
        { error: 'Currículo não encontrado' },
        { status: 404 }
      )
    }

    // Buscar dados do usuário para verificar plano
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { plan: true, pdfDownloads: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuário não encontrado' },
        { status: 404 }
      )
    }

    // Verificar limites do plano
    const MAX_FREE_DOWNLOADS = 3
    if (user.plan === 'FREE' && user.pdfDownloads >= MAX_FREE_DOWNLOADS) {
      return NextResponse.json(
        { 
          error: 'Limite de downloads atingido',
          message: `Você já fez ${MAX_FREE_DOWNLOADS} downloads gratuitos. Faça upgrade para continuar.`,
          code: 'LIMIT_EXCEEDED'
        },
        { status: 403 }
      )
    }

    // Gerar PDF
    const pdfBuffer = await generatePDF(curriculum as any)

    // Incrementar contador de downloads
    await prisma.user.update({
      where: { id: session.user.id },
      data: { pdfDownloads: { increment: 1 } }
    })

    // Retornar PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${curriculum.title || 'curriculo'}.pdf"`
      }
    })

  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
