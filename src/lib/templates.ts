export interface Template {
  layout: any;
  fonts: any;
  colors: any;
  id: string;
  name: string;
  description: string;
  category: 'professional' | 'creative' | 'modern' | 'minimal';
  preview: string;
  isPremium: boolean;
}

export const TEMPLATES: Template[] = [
  {
    id: 'professional-classic',
    name: 'Profissional Clássico',
    description: 'Template elegante e tradicional, ideal para setores corporativos',
    category: 'professional',
    preview: '/templates/professional-classic-preview.jpg',
    isPremium: false,
    layout: {},
    fonts: {},
    colors: {},
  },
  {
    id: 'modern-minimal',
    name: 'Moderno Minimalista',
    description: 'Design limpo e moderno, perfeito para profissionais de tecnologia',
    category: 'modern',
    preview: '/templates/modern-minimal-preview.jpg',
    isPremium: true,
    layout: {},
    fonts: {},
    colors: {},
  },
  {
    id: 'creative-designer',
    name: 'Criativo Designer',
    description: 'Template criativo com elementos visuais, ideal para designers e artistas',
    category: 'creative',
    preview: '/templates/creative-designer-preview.jpg',
    isPremium: true,
    layout: {},
    fonts: {},
    colors: {},
  },
  {
    id: 'executive-premium',
    name: 'Executivo Premium',
    description: 'Template sofisticado para cargos executivos e alta gerência',
    category: 'professional',
    preview: '/templates/executive-premium-preview.jpg',
    isPremium: true,
    layout: {},
    fonts: {},
    colors: {},
  },
  {
    id: 'tech-developer',
    name: 'Tech Developer',
    description: 'Template técnico moderno, ideal para desenvolvedores e engenheiros',
    category: 'modern',
    preview: '/templates/tech-developer-preview.jpg',
    isPremium: true,
    layout: {},
    fonts: {},
    colors: {},
  },
  {
    id: 'minimal-clean',
    name: 'Minimal Clean',
    description: 'Extremamente limpo e direto ao ponto',
    category: 'minimal',
    preview: '/templates/minimal-clean-preview.jpg',
    isPremium: false,
    layout: {},
    fonts: {},
    colors: {},
  },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find(template => template.id === id);
}

export function getTemplatesByCategory(category: Template['category']): Template[] {
  return TEMPLATES.filter(template => template.category === category);
}

export function getFreeTemplates(): Template[] {
  return TEMPLATES.filter(template => !template.isPremium);
}

export function getPremiumTemplates(): Template[] {
  return TEMPLATES.filter(template => template.isPremium);
}