import puppeteer from 'puppeteer'
import { 
  getCachedBrowser, 
  getCachedHTML, 
  setCachedHTML, 
  generateCacheKey,
  closeBrowserCache 
} from './pdf-cache'
import { generateDynamicHTML } from './template-generator'

export interface CurriculumData {
  id: string
  title: string
  template: string
  personalInfo?: {
    fullName: string
    email: string
    phone?: string
    address?: string
    city?: string
    state?: string
    linkedin?: string
    github?: string
    website?: string
    summary?: string
  }
  experiences: Array<{
    company: string
    position: string
    location?: string
    startDate: Date
    endDate?: Date
    current: boolean
    description?: string
  }>
  educations: Array<{
    institution: string
    degree: string
    field?: string
    location?: string
    startDate: Date
    endDate?: Date
    current: boolean
    description?: string
  }>
  skills: Array<{
    name: string
    category?: string
    level: string
  }>
  languages: Array<{
    name: string
    proficiency: string
  }>
}

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

// Gerar HTML para o currículo
const generateCurriculumHTML = (data: CurriculumData): string => {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${data.title || 'Currículo'}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #333;
          background: white;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          min-height: 100vh;
        }
        
        .header {
          background: linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%);
          color: white;
          padding: 40px;
          margin-bottom: 30px;
        }
        
        .name {
          font-size: 32px;
          font-weight: bold;
          margin-bottom: 12px;
        }
        
        .contact-info {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
          margin-bottom: 15px;
          font-size: 14px;
        }
        
        .contact-item {
          display: flex;
          align-items: center;
          gap: 6px;
        }
        
        .social-links {
          display: flex;
          gap: 20px;
          margin-top: 8px;
          font-size: 13px;
          opacity: 0.9;
        }
        
        .content {
          padding: 0 40px 40px;
        }
        
        .section {
          margin-bottom: 35px;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: bold;
          color: #1f2937;
          border-bottom: 2px solid #1e40af;
          padding-bottom: 8px;
          margin-bottom: 20px;
        }
        
        .summary-text {
          font-size: 14px;
          line-height: 1.7;
          color: #4b5563;
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
          color: #1f2937;
          margin-bottom: 4px;
        }
        
        .company-name, .institution {
          font-size: 14px;
          color: #1e40af;
          font-weight: 600;
          margin-bottom: 4px;
        }
        
        .location {
          font-size: 12px;
          color: #6b7280;
        }
        
        .date-range {
          font-size: 12px;
          color: #6b7280;
          text-align: right;
          white-space: nowrap;
        }
        
        .description {
          font-size: 13px;
          color: #4b5563;
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
          color: #4b5563;
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
          color: #4b5563;
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
          color: #1f2937;
        }
        
        .language-level {
          font-size: 12px;
          background: #f3f4f6;
          color: #6b7280;
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
        <div class="header">
          <div class="name">${data.personalInfo?.fullName || 'Seu Nome'}</div>
          
          <div class="contact-info">
            ${data.personalInfo?.email ? `
              <div class="contact-item">
                <span>✉</span>
                <span>${data.personalInfo.email}</span>
              </div>
            ` : ''}
            
            ${data.personalInfo?.phone ? `
              <div class="contact-item">
                <span>📞</span>
                <span>${data.personalInfo.phone}</span>
              </div>
            ` : ''}
            
            ${formatLocation(data.personalInfo) ? `
              <div class="contact-item">
                <span>📍</span>
                <span>${formatLocation(data.personalInfo)}</span>
              </div>
            ` : ''}
          </div>
          
          <div class="social-links">
            ${data.personalInfo?.linkedin ? `
              <span>LinkedIn: ${data.personalInfo.linkedin}</span>
            ` : ''}
            
            ${data.personalInfo?.github ? `
              <span>GitHub: ${data.personalInfo.github}</span>
            ` : ''}
            
            ${data.personalInfo?.website ? `
              <span>Website: ${data.personalInfo.website}</span>
            ` : ''}
          </div>
        </div>

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

// Função principal para gerar PDF
export async function generatePDF(curriculumData: CurriculumData, templateId?: string): Promise<Buffer> {
  let browser = null
  
  try {
    console.log('Iniciando geração de PDF...')
    
    // Usar templateId se fornecido, ou o template do curriculumData
    const finalTemplateId = templateId || curriculumData.template
    
    // Gerar chave de cache
    const cacheKey = generateCacheKey({ ...curriculumData, template: finalTemplateId })
    
    // Tentar obter HTML do cache
    let html = getCachedHTML(cacheKey)
    
    if (!html) {
      console.log('Gerando HTML (cache miss)')
      html = generateDynamicHTML({ ...curriculumData, template: finalTemplateId })
      setCachedHTML(cacheKey, html)
    } else {
      console.log('HTML obtido do cache (cache hit)')
    }
    
    // Obter browser instance (possivelmente do cache)
    browser = await getCachedBrowser()
    
    const page = await browser.newPage()
    
    // Configurar conteúdo HTML
    await page.setContent(html, { 
      waitUntil: 'networkidle0' 
    })
    
    // Gerar PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '0.5in',
        right: '0.5in',
        bottom: '0.5in',
        left: '0.5in'
      }
    })
    
    // Fechar apenas a página, não o browser (para reutilização)
    await page.close()
    
    console.log('PDF gerado com sucesso')
    return Buffer.from(pdfBuffer)
    
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    
    // Em caso de erro, fechar browser e tentar novamente na próxima vez
    if (browser && !browser.disconnected) {
      try {
        await browser.close()
      } catch (closeError) {
        console.error('Erro ao fechar browser:', closeError)
      }
    }
    
    throw new Error('Falha ao gerar PDF')
  }
}
