import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...')

  // Criar usuário de exemplo (apenas para desenvolvimento)
  const testUser = await prisma.user.upsert({
    where: { email: 'test@curriculum.com' },
    update: {},
    create: {
      email: 'test@curriculum.com',
      name: 'Usuário Teste',
      plan: 'FREE',
      pdfDownloads: 0
    }
  })

  console.log('✅ Usuário de teste criado:', testUser.email)

  // Criar currículo de exemplo
  const exampleCurriculum = await prisma.curriculum.upsert({
    where: { id: 'example-curriculum' },
    update: {},
    create: {
      id: 'example-curriculum',
      title: 'Meu Primeiro Currículo',
      template: 'modern',
      userId: testUser.id,
      personalInfo: {
        create: {
          fullName: 'João Silva',
          email: 'joao.silva@email.com',
          phone: '(11) 99999-9999',
          city: 'São Paulo',
          state: 'SP',
          linkedin: 'linkedin.com/in/joaosilva',
          summary: 'Profissional dedicado com experiência em desenvolvimento web e paixão por tecnologia.'
        }
      },
      experiences: {
        create: [
          {
            company: 'Tech Company',
            position: 'Desenvolvedor Full Stack',
            location: 'São Paulo, SP',
            startDate: new Date('2022-01-01'),
            endDate: new Date('2024-12-01'),
            current: false,
            description: 'Desenvolvimento de aplicações web usando React, Node.js e PostgreSQL.',
            order: 0
          },
          {
            company: 'Startup Inovadora',
            position: 'Desenvolvedor Frontend',
            location: 'Remote',
            startDate: new Date('2021-01-01'),
            endDate: new Date('2021-12-01'),
            current: false,
            description: 'Criação de interfaces modernas e responsivas usando React e TypeScript.',
            order: 1
          }
        ]
      },
      educations: {
        create: [
          {
            institution: 'Universidade de São Paulo',
            degree: 'Bacharelado',
            field: 'Ciência da Computação',
            location: 'São Paulo, SP',
            startDate: new Date('2018-01-01'),
            endDate: new Date('2021-12-01'),
            current: false,
            order: 0
          }
        ]
      },
      skills: {
        create: [
          { name: 'JavaScript', category: 'Programação', level: 'ADVANCED', order: 0 },
          { name: 'TypeScript', category: 'Programação', level: 'ADVANCED', order: 1 },
          { name: 'React', category: 'Frontend', level: 'EXPERT', order: 2 },
          { name: 'Node.js', category: 'Backend', level: 'INTERMEDIATE', order: 3 },
          { name: 'PostgreSQL', category: 'Banco de Dados', level: 'INTERMEDIATE', order: 4 }
        ]
      },
      languages: {
        create: [
          { name: 'Português', proficiency: 'NATIVE', order: 0 },
          { name: 'Inglês', proficiency: 'ADVANCED', order: 1 },
          { name: 'Espanhol', proficiency: 'INTERMEDIATE', order: 2 }
        ]
      }
    }
  })

  console.log('✅ Currículo de exemplo criado:', exampleCurriculum.title)
  console.log('🎉 Seed concluído com sucesso!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Erro durante o seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })
