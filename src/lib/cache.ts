import { unstable_cache } from 'next/cache'
import { prisma } from '@/lib/prisma'

// Cache para dados do usuário (15 minutos)
export const getCachedUserData = unstable_cache(
  async (userId: string) => {
    return await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        plan: true,
        pdfDownloads: true,
        createdAt: true,
      },
    })
  },
  ['user-data'],
  {
    revalidate: 15 * 60, // 15 minutos
    tags: ['user'],
  }
)

// Cache para currículos do usuário (5 minutos)
export const getCachedUserCurriculums = unstable_cache(
  async (userId: string) => {
    return await prisma.curriculum.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        template: true,
        createdAt: true,
        updatedAt: true,
        personalInfo: {
          select: {
            fullName: true,
            email: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    })
  },
  ['user-curriculums'],
  {
    revalidate: 5 * 60, // 5 minutos
    tags: ['curriculums'],
  }
)

// Cache para currículo específico (2 minutos)
export const getCachedCurriculum = unstable_cache(
  async (curriculumId: string, userId: string) => {
    return await prisma.curriculum.findUnique({
      where: {
        id: curriculumId,
        userId,
      },
      include: {
        personalInfo: true,
        experiences: {
          orderBy: { order: 'asc' },
        },
        educations: {
          orderBy: { order: 'asc' },
        },
        skills: {
          orderBy: { order: 'asc' },
        },
        languages: {
          orderBy: { order: 'asc' },
        },
      },
    })
  },
  ['curriculum-detail'],
  {
    revalidate: 2 * 60, // 2 minutos
    tags: ['curriculum'],
  }
)

// Função para invalidar cache do usuário
export const invalidateUserCache = (userId: string) => {
  // Invalida todos os caches relacionados ao usuário
  return Promise.all([
    // Note: Em produção, você precisaria implementar um sistema de tags mais sofisticado
    // Para este MVP, vamos usar revalidateTag quando disponível
  ])
}

// Cache para templates (1 hora - raramente mudam)
export const getCachedTemplates = unstable_cache(
  async () => {
    return [
      {
        id: 'modern',
        name: 'Moderno',
        description: 'Design limpo e profissional',
        preview: '/templates/modern-preview.jpg',
        premium: false,
      },
      {
        id: 'classic',
        name: 'Clássico',
        description: 'Layout tradicional e elegante',
        preview: '/templates/classic-preview.jpg',
        premium: false,
      },
      {
        id: 'creative',
        name: 'Criativo',
        description: 'Design inovador com cores vibrantes',
        preview: '/templates/creative-preview.jpg',
        premium: true,
      },
      {
        id: 'executive',
        name: 'Executivo',
        description: 'Para posições de liderança',
        preview: '/templates/executive-preview.jpg',
        premium: true,
      },
    ]
  },
  ['templates'],
  {
    revalidate: 60 * 60, // 1 hora
    tags: ['templates'],
  }
)

// Cache para configurações da aplicação (1 hora)
export const getCachedAppConfig = unstable_cache(
  async () => {
    return {
      plans: {
        free: {
          name: 'Gratuito',
          pdfDownloads: 3,
          templates: 2,
          aiGenerations: 5,
        },
        premium: {
          name: 'Premium',
          pdfDownloads: -1, // Ilimitado
          templates: -1, // Todos
          aiGenerations: -1, // Ilimitado
        },
      },
      features: {
        pdfExport: true,
        aiGeneration: true,
        multipleTemplates: true,
        customization: true,
      },
    }
  },
  ['app-config'],
  {
    revalidate: 60 * 60, // 1 hora
    tags: ['config'],
  }
)
