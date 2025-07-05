import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { id } = params

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    // Verificar se o currículo pertence ao usuário antes de deletar
    const curriculum = await prisma.curriculum.findFirst({
      where: {
        id: id,
        userId: user.id
      }
    })

    if (!curriculum) {
      return NextResponse.json({ error: 'Currículo não encontrado' }, { status: 404 })
    }

    // Deletar o currículo (o Prisma vai fazer cascade delete dos dados relacionados)
    await prisma.curriculum.delete({
      where: { id: id }
    })

    return NextResponse.json({ 
      success: true, 
      message: 'Currículo deletado com sucesso!' 
    })

  } catch (error) {
    console.error('Erro ao deletar currículo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
}
