import { CurriculumData } from './pdf-generator'

export interface Template {
  id: string
  name: string
  description: string
  preview: string
  premium: boolean
  colors: {
    primary: string
    secondary: string
    accent: string
    text: string
    background: string
  }
  fonts: {
    heading: string
    body: string
  }
  layout: {
    headerHeight: string
    spacing: string
    sectionGap: string
  }
}

export const templates: Template[] = [
  {
    id: 'modern',
    name: 'Moderno',
    description: 'Design limpo e profissional com gradiente azul',
    preview: '/templates/modern-preview.jpg',
    premium: false,
    colors: {
      primary: '#1e40af',
      secondary: '#1e3a8a',
      accent: '#3b82f6',
      text: '#1f2937',
      background: '#ffffff',
    },
    fonts: {
      heading: 'system-ui, -apple-system, sans-serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
    layout: {
      headerHeight: '140px',
      spacing: '20px',
      sectionGap: '35px',
    },
  },
  {
    id: 'classic',
    name: 'Clássico',
    description: 'Layout tradicional e elegante em tons de cinza',
    preview: '/templates/classic-preview.jpg',
    premium: false,
    colors: {
      primary: '#374151',
      secondary: '#4b5563',
      accent: '#6b7280',
      text: '#1f2937',
      background: '#ffffff',
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
    layout: {
      headerHeight: '120px',
      spacing: '18px',
      sectionGap: '30px',
    },
  },
  {
    id: 'creative',
    name: 'Criativo',
    description: 'Design inovador com cores vibrantes e elementos modernos',
    preview: '/templates/creative-preview.jpg',
    premium: true,
    colors: {
      primary: '#7c3aed',
      secondary: '#8b5cf6',
      accent: '#a78bfa',
      text: '#1f2937',
      background: '#ffffff',
    },
    fonts: {
      heading: 'system-ui, -apple-system, sans-serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
    layout: {
      headerHeight: '160px',
      spacing: '22px',
      sectionGap: '40px',
    },
  },
  {
    id: 'executive',
    name: 'Executivo',
    description: 'Para posições de liderança com design sofisticado',
    preview: '/templates/executive-preview.jpg',
    premium: true,
    colors: {
      primary: '#0f172a',
      secondary: '#1e293b',
      accent: '#334155',
      text: '#0f172a',
      background: '#ffffff',
    },
    fonts: {
      heading: 'Georgia, serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
    layout: {
      headerHeight: '150px',
      spacing: '24px',
      sectionGap: '45px',
    },
  },
  {
    id: 'minimalist',
    name: 'Minimalista',
    description: 'Design clean com foco no conteúdo',
    preview: '/templates/minimalist-preview.jpg',
    premium: true,
    colors: {
      primary: '#000000',
      secondary: '#404040',
      accent: '#666666',
      text: '#000000',
      background: '#ffffff',
    },
    fonts: {
      heading: 'system-ui, -apple-system, sans-serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
    layout: {
      headerHeight: '100px',
      spacing: '16px',
      sectionGap: '32px',
    },
  },
  {
    id: 'tech',
    name: 'Tech',
    description: 'Para profissionais de tecnologia com elementos modernos',
    preview: '/templates/tech-preview.jpg',
    premium: true,
    colors: {
      primary: '#059669',
      secondary: '#047857',
      accent: '#10b981',
      text: '#1f2937',
      background: '#ffffff',
    },
    fonts: {
      heading: 'system-ui, -apple-system, sans-serif',
      body: 'system-ui, -apple-system, sans-serif',
    },
    layout: {
      headerHeight: '130px',
      spacing: '20px',
      sectionGap: '36px',
    },
  },
]

export const getTemplate = (templateId: string): Template | undefined => {
  return templates.find((t) => t.id === templateId)
}

export const getFreeTemplates = (): Template[] => {
  return templates.filter((t) => !t.premium)
}

export const getPremiumTemplates = (): Template[] => {
  return templates.filter((t) => t.premium)
}

export const getAvailableTemplates = (userPlan: string): Template[] => {
  if (userPlan === 'PREMIUM') {
    return templates
  }
  return getFreeTemplates()
}
