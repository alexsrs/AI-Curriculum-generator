import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const body = await request.json()
    const { id, title, personalInfo, experiences, educations, skills, languages, template } = body

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    let curriculum

    if (id) {
      // Atualizar currículo existente
      // Primeiro, deletar dados relacionados existentes
      await prisma.experience.deleteMany({
        where: { curriculumId: id }
      })
      await prisma.education.deleteMany({
        where: { curriculumId: id }
      })
      await prisma.skill.deleteMany({
        where: { curriculumId: id }
      })
      await prisma.language.deleteMany({
        where: { curriculumId: id }
      })
      await prisma.personalInfo.deleteMany({
        where: { curriculumId: id }
      })

      // Atualizar o currículo
      curriculum = await prisma.curriculum.update({
        where: { 
          id: id,
          userId: user.id // Garantir que o usuário só possa atualizar seus próprios currículos
        },
        data: {
          title: title || 'Meu Currículo',
          template: template || 'modern',
          personalInfo: personalInfo ? {
            create: {
              fullName: personalInfo.fullName || '',
              email: personalInfo.email || user.email,
              phone: personalInfo.phone || null,
              address: personalInfo.address || null,
              city: personalInfo.city || null,
              state: personalInfo.state || null,
              zipCode: personalInfo.zipCode || null,
              linkedin: personalInfo.linkedin || null,
              github: personalInfo.github || null,
              website: personalInfo.website || null,
              summary: personalInfo.summary || null,
            }
          } : undefined,
          experiences: experiences && experiences.length > 0 ? {
            create: experiences.map((exp: any, index: number) => ({
              company: exp.company,
              position: exp.position,
              location: exp.location || null,
              startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
              endDate: exp.endDate ? new Date(exp.endDate) : null,
              current: exp.current || false,
              description: exp.description || null,
              order: index,
            }))
          } : undefined,
          educations: educations && educations.length > 0 ? {
            create: educations.map((edu: any, index: number) => ({
              institution: edu.institution,
              degree: edu.degree,
              field: edu.field || null,
              location: edu.location || null,
              startDate: edu.startDate ? new Date(edu.startDate) : new Date(),
              endDate: edu.endDate ? new Date(edu.endDate) : null,
              current: edu.current || false,
              description: edu.description || null,
              order: index,
            }))
          } : undefined,
          skills: skills && skills.length > 0 ? {
            create: skills.map((skill: any, index: number) => ({
              name: skill.name,
              level: skill.level || 'INTERMEDIATE',
              category: skill.category || null,
              order: index,
            }))
          } : undefined,
          languages: languages && languages.length > 0 ? {
            create: languages.map((lang: any, index: number) => ({
              name: lang.name,
              proficiency: lang.level || lang.proficiency || 'INTERMEDIATE',
              order: index,
            }))
          } : undefined,
        },
        include: {
          personalInfo: true,
          experiences: true,
          educations: true,
          skills: true,
          languages: true,
        }
      })
    } else {
      // Criar novo currículo
      curriculum = await prisma.curriculum.create({
        data: {
          title: title || 'Meu Currículo',
          template: template || 'modern',
          userId: user.id,
          personalInfo: personalInfo ? {
            create: {
              fullName: personalInfo.fullName || '',
              email: personalInfo.email || user.email,
              phone: personalInfo.phone || null,
              address: personalInfo.address || null,
              city: personalInfo.city || null,
              state: personalInfo.state || null,
              zipCode: personalInfo.zipCode || null,
              linkedin: personalInfo.linkedin || null,
              github: personalInfo.github || null,
              website: personalInfo.website || null,
              summary: personalInfo.summary || null,
            }
          } : undefined,
          experiences: experiences && experiences.length > 0 ? {
            create: experiences.map((exp: any, index: number) => ({
              company: exp.company,
              position: exp.position,
              location: exp.location || null,
              startDate: exp.startDate ? new Date(exp.startDate) : new Date(),
              endDate: exp.endDate ? new Date(exp.endDate) : null,
              current: exp.current || false,
              description: exp.description || null,
              order: index,
            }))
          } : undefined,
          educations: educations && educations.length > 0 ? {
            create: educations.map((edu: any, index: number) => ({
              institution: edu.institution,
              degree: edu.degree,
              field: edu.field || null,
              location: edu.location || null,
              startDate: edu.startDate ? new Date(edu.startDate) : new Date(),
              endDate: edu.endDate ? new Date(edu.endDate) : null,
              current: edu.current || false,
              description: edu.description || null,
              order: index,
            }))
          } : undefined,
          skills: skills && skills.length > 0 ? {
            create: skills.map((skill: any, index: number) => ({
              name: skill.name,
              level: skill.level || 'INTERMEDIATE',
              category: skill.category || null,
              order: index,
            }))
          } : undefined,
          languages: languages && languages.length > 0 ? {
            create: languages.map((lang: any, index: number) => ({
              name: lang.name,
              proficiency: lang.level || lang.proficiency || 'INTERMEDIATE',
              order: index,
            }))
          } : undefined,
        },
        include: {
          personalInfo: true,
          experiences: true,
          educations: true,
          skills: true,
          languages: true,
        }
      })
    }

    return NextResponse.json({ 
      success: true, 
      curriculum,
      message: id ? 'Currículo atualizado com sucesso!' : 'Currículo salvo com sucesso!' 
    })

  } catch (error) {
    console.error('Erro ao salvar currículo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const curriculumId = searchParams.get('id')

    // Buscar o usuário
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 })
    }

    if (curriculumId) {
      // Buscar currículo específico
      const curriculum = await prisma.curriculum.findFirst({
        where: {
          id: curriculumId,
          userId: user.id
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
          },
        }
      })

      if (!curriculum) {
        return NextResponse.json({ error: 'Currículo não encontrado' }, { status: 404 })
      }

      return NextResponse.json({ curriculum })
    } else {
      // Listar todos os currículos do usuário
      const curriculums = await prisma.curriculum.findMany({
        where: { userId: user.id },
        include: {
          personalInfo: true,
        },
        orderBy: { updatedAt: 'desc' }
      })

      return NextResponse.json({ curriculums })
    }

  } catch (error) {
    console.error('Erro ao buscar currículo:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' }, 
      { status: 500 }
    )
  }
}
