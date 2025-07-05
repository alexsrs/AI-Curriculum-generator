import { CurriculumData } from './pdf-generator'
import { getTemplate, Template } from './templates'

// Função para formatar datas
const formatDate = (date: Date): string => {
  return date.toLocaleDateString('pt-BR', { 
    month: 'short', 
    year: 'numeric' 
  })
}

// Função para formatar localização
const formatLocation = (personalInfo: CurriculumData['personalInfo']): string => {
  if (!personalInfo) return ''
  const parts = []
  if (personalInfo.city) parts.push(personalInfo.city)
  if (personalInfo.state) parts.push(personalInfo.state)
  return parts.join(', ')
}

// Traduzir níveis de habilidade
const translateSkillLevel = (level: string): string => {
  const translations: Record<string, string> = {
    'BEGINNER': 'Iniciante',
    'INTERMEDIATE': 'Intermediário',
    'ADVANCED': 'Avançado',
    'EXPERT': 'Especialista'
  }
  return translations[level] || level
}

// Traduzir níveis de idioma
const translateLanguageLevel = (proficiency: string): string => {
  const translations: Record<string, string> = {
    'BASIC': 'Básico',
    'INTERMEDIATE': 'Intermediário',
    'ADVANCED': 'Avançado',
    'FLUENT': 'Fluente',
    'NATIVE': 'Nativo'
  }
  return translations[proficiency] || proficiency
}

// Gerar CSS dinâmico baseado no template
const generateTemplateCSS = (template: Template): string => {
  return `
    :root {
      --primary-color: ${template.colors.primary};
      --secondary-color: ${template.colors.secondary};
      --accent-color: ${template.colors.accent};
      --text-color: ${template.colors.text};
      --background-color: ${template.colors.background};
      --header-height: ${template.layout.headerHeight};
      --spacing: ${template.layout.spacing};
      --section-gap: ${template.layout.sectionGap};
      --heading-font: ${template.fonts.heading};
      --body-font: ${template.fonts.body};
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: var(--body-font);
      line-height: 1.6;
      color: var(--text-color);
      background: var(--background-color);
    }
    
    .container {
      max-width: 800px;
      margin: 0 auto;
      background: var(--background-color);
      min-height: 100vh;
    }
  `
}

// Gerar header específico por template
const generateTemplateHeader = (data: CurriculumData, template: Template): string => {
  switch (template.id) {
    case 'modern':
      return generateModernHeader(data, template)
    case 'classic':
      return generateClassicHeader(data, template)
    case 'creative':
      return generateCreativeHeader(data, template)
    case 'executive':
      return generateExecutiveHeader(data, template)
    case 'minimalist':
      return generateMinimalistHeader(data, template)
    case 'tech':
      return generateTechHeader(data, template)
    default:
      return generateModernHeader(data, template)
  }
}

// Header Moderno (gradiente)
const generateModernHeader = (data: CurriculumData, template: Template): string => {
  return `
    <div class="header" style="
      background: linear-gradient(135deg, var(--primary-color) 0%, var(--secondary-color) 100%);
      color: white;
      padding: 40px;
      margin-bottom: 30px;
    ">
      <div class="name" style="font-size: 32px; font-weight: bold; margin-bottom: 12px;">
        ${data.personalInfo?.fullName || 'Seu Nome'}
      </div>
      
      <div class="contact-info" style="display: flex; flex-wrap: wrap; gap: 20px; margin-bottom: 15px; font-size: 14px;">
        ${data.personalInfo?.email ? `
          <div class="contact-item" style="display: flex; align-items: center; gap: 6px;">
            <span>✉</span>
            <span>${data.personalInfo.email}</span>
          </div>
        ` : ''}
        
        ${data.personalInfo?.phone ? `
          <div class="contact-item" style="display: flex; align-items: center; gap: 6px;">
            <span>📞</span>
            <span>${data.personalInfo.phone}</span>
          </div>
        ` : ''}
        
        ${formatLocation(data.personalInfo) ? `
          <div class="contact-item" style="display: flex; align-items: center; gap: 6px;">
            <span>📍</span>
            <span>${formatLocation(data.personalInfo)}</span>
          </div>
        ` : ''}
      </div>
      
      <div class="social-links" style="display: flex; gap: 20px; margin-top: 8px; font-size: 13px; opacity: 0.9;">
        ${data.personalInfo?.linkedin ? `<span>LinkedIn: ${data.personalInfo.linkedin}</span>` : ''}
        ${data.personalInfo?.github ? `<span>GitHub: ${data.personalInfo.github}</span>` : ''}
        ${data.personalInfo?.website ? `<span>Website: ${data.personalInfo.website}</span>` : ''}
      </div>
    </div>
  `
}

// Header Clássico (simples e elegante)
const generateClassicHeader = (data: CurriculumData, template: Template): string => {
  return `
    <div class="header" style="
      border-bottom: 3px solid var(--primary-color);
      padding: 30px 40px;
      margin-bottom: 30px;
      text-align: center;
    ">
      <div class="name" style="
        font-family: var(--heading-font); 
        font-size: 28px; 
        font-weight: bold; 
        margin-bottom: 10px; 
        color: var(--primary-color);
      ">
        ${data.personalInfo?.fullName || 'Seu Nome'}
      </div>
      
      <div class="contact-info" style="
        display: flex; 
        justify-content: center; 
        flex-wrap: wrap; 
        gap: 20px; 
        margin-bottom: 10px; 
        font-size: 14px;
        color: var(--secondary-color);
      ">
        ${data.personalInfo?.email ? `<span>${data.personalInfo.email}</span>` : ''}
        ${data.personalInfo?.phone ? `<span>${data.personalInfo.phone}</span>` : ''}
        ${formatLocation(data.personalInfo) ? `<span>${formatLocation(data.personalInfo)}</span>` : ''}
      </div>
      
      <div class="social-links" style="
        display: flex; 
        justify-content: center; 
        gap: 15px; 
        font-size: 12px; 
        color: var(--accent-color);
      ">
        ${data.personalInfo?.linkedin ? `<span>${data.personalInfo.linkedin}</span>` : ''}
        ${data.personalInfo?.github ? `<span>${data.personalInfo.github}</span>` : ''}
        ${data.personalInfo?.website ? `<span>${data.personalInfo.website}</span>` : ''}
      </div>
    </div>
  `
}

// Headers para outros templates (implementação básica)
const generateCreativeHeader = (data: CurriculumData, template: Template): string => {
  return generateModernHeader(data, template).replace('linear-gradient(135deg', 'linear-gradient(45deg')
}

const generateExecutiveHeader = (data: CurriculumData, template: Template): string => {
  return generateClassicHeader(data, template)
}

const generateMinimalistHeader = (data: CurriculumData, template: Template): string => {
  return `
    <div class="header" style="
      padding: 20px 40px;
      margin-bottom: 40px;
      border-bottom: 1px solid #e5e5e5;
    ">
      <div class="name" style="
        font-size: 24px; 
        font-weight: 600; 
        margin-bottom: 8px; 
        color: var(--primary-color);
      ">
        ${data.personalInfo?.fullName || 'Seu Nome'}
      </div>
      
      <div class="contact-info" style="
        font-size: 12px;
        color: var(--secondary-color);
        line-height: 1.4;
      ">
        ${data.personalInfo?.email ? `<div>${data.personalInfo.email}</div>` : ''}
        ${data.personalInfo?.phone ? `<div>${data.personalInfo.phone}</div>` : ''}
        ${formatLocation(data.personalInfo) ? `<div>${formatLocation(data.personalInfo)}</div>` : ''}
      </div>
    </div>
  `
}

const generateTechHeader = (data: CurriculumData, template: Template): string => {
  return generateModernHeader(data, template)
}

// Gerar HTML completo para o template
export const generateDynamicHTML = (data: CurriculumData): string => {
  const template = getTemplate(data.template) || getTemplate('modern')!
  
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.title || 'Currículo'}</title>
      <style>
        ${generateTemplateCSS(template)}
        
        .content {
          padding: 0 40px 40px;
        }
        
        .section {
          margin-bottom: var(--section-gap);
        }
        
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: var(--primary-color);
          border-bottom: 2px solid var(--primary-color);
          padding-bottom: 8px;
          margin-bottom: var(--spacing);
          font-family: var(--heading-font);
        }
        
        .summary-text {
          font-size: 14px;
          line-height: 1.7;
          color: var(--secondary-color);
        }
        
        .experience-item, .education-item {
          margin-bottom: 25px;
        }
        
        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;
        }
        
        .item-left {
          flex: 1;
        }
        
        .job-title, .degree {
          font-size: 16px;
          font-weight: bold;
          color: var(--text-color);
          margin-bottom: 4px;
          font-family: var(--heading-font);
        }
        
        .company-name, .institution {
          font-size: 14px;
          color: var(--primary-color);
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .location {
          font-size: 12px;
          color: var(--accent-color);
        }
        
        .date-range {
          font-size: 12px;
          color: var(--accent-color);
          text-align: right;
          white-space: nowrap;
        }
        
        .description {
          font-size: 13px;
          color: var(--secondary-color);
          line-height: 1.6;
          margin-top: 8px;
          white-space: pre-line;
        }
        
        .skills-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 25px;
        }
        
        .skill-category {
          margin-bottom: 15px;
        }
        
        .skill-category-title {
          font-size: 14px;
          font-weight: bold;
          color: var(--secondary-color);
          margin-bottom: 10px;
        }
        
        .skills-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }
        
        .skill-badge {
          font-size: 11px;
          background: #f3f4f6;
          color: var(--secondary-color);
          padding: 4px 10px;
          border-radius: 12px;
          border: 1px solid #e5e7eb;
        }
        
        .languages-container {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .language-item {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        
        .language-name {
          font-size: 14px;
          font-weight: 600;
          color: var(--text-color);
        }
        
        .language-level {
          font-size: 12px;
          background: #f3f4f6;
          color: var(--accent-color);
          padding: 2px 8px;
          border-radius: 8px;
          border: 1px solid #e5e7eb;
        }
        
        @media print {
          body { -webkit-print-color-adjust: exact; }
          .container { max-width: none; }
          .header { margin-bottom: 20px; padding: 30px; }
          .content { padding: 0 30px 30px; }
          .section { margin-bottom: 25px; }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <!-- Header -->
        ${generateTemplateHeader(data, template)}

        <div class="content">
          <!-- Resumo -->
          ${data.personalInfo?.summary ? `
            <div class="section">
              <div class="section-title">Resumo Profissional</div>
              <div class="summary-text">${data.personalInfo.summary}</div>
            </div>
          ` : ''}

          <!-- Experiência -->
          ${data.experiences.length > 0 ? `
            <div class="section">
              <div class="section-title">Experiência Profissional</div>
              ${data.experiences.map(exp => `
                <div class="experience-item">
                  <div class="item-header">
                    <div class="item-left">
                      <div class="job-title">${exp.position}</div>
                      <div class="company-name">${exp.company}</div>
                      ${exp.location ? `<div class="location">${exp.location}</div>` : ''}
                    </div>
                    <div class="date-range">
                      ${formatDate(exp.startDate)} - ${exp.current ? 'Atual' : formatDate(exp.endDate!)}
                    </div>
                  </div>
                  ${exp.description ? `<div class="description">${exp.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Educação -->
          ${data.educations.length > 0 ? `
            <div class="section">
              <div class="section-title">Formação Acadêmica</div>
              ${data.educations.map(edu => `
                <div class="education-item">
                  <div class="item-header">
                    <div class="item-left">
                      <div class="degree">${edu.degree}${edu.field ? ` em ${edu.field}` : ''}</div>
                      <div class="institution">${edu.institution}</div>
                      ${edu.location ? `<div class="location">${edu.location}</div>` : ''}
                    </div>
                    <div class="date-range">
                      ${formatDate(edu.startDate)} - ${edu.current ? 'Atual' : formatDate(edu.endDate!)}
                    </div>
                  </div>
                  ${edu.description ? `<div class="description">${edu.description}</div>` : ''}
                </div>
              `).join('')}
            </div>
          ` : ''}

          <!-- Habilidades -->
          ${data.skills.length > 0 ? `
            <div class="section">
              <div class="section-title">Habilidades</div>
              <div class="skills-grid">
                ${['Técnica', 'Interpessoal', 'Certificação'].map(category => {
                  const categorySkills = data.skills.filter(skill => skill.category === category)
                  if (categorySkills.length === 0) return ''
                  
                  return `
                    <div class="skill-category">
                      <div class="skill-category-title">${category}s</div>
                      <div class="skills-list">
                        ${categorySkills.map(skill => `
                          <span class="skill-badge">${skill.name} (${translateSkillLevel(skill.level)})</span>
                        `).join('')}
                      </div>
                    </div>
                  `
                }).join('')}
              </div>
            </div>
          ` : ''}

          <!-- Idiomas -->
          ${data.languages.length > 0 ? `
            <div class="section">
              <div class="section-title">Idiomas</div>
              <div class="languages-container">
                ${data.languages.map(lang => `
                  <div class="language-item">
                    <span class="language-name">${lang.name}</span>
                    <span class="language-level">${translateLanguageLevel(lang.proficiency)}</span>
                  </div>
                `).join('')}
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    </body>
    </html>
  `
}
