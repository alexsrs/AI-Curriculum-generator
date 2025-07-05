import { LRUCache } from 'lru-cache'

// Cache para HTML renderizado (100 templates em memória por 10 minutos)
const htmlCache = new LRUCache<string, string>({
  max: 100,
  ttl: 10 * 60 * 1000, // 10 minutos
})

// Cache para configurações do Puppeteer
let browserInstanceCache: any = null
let browserCacheTimeout: NodeJS.Timeout | null = null

// Função para obter instância do browser com cache
export const getCachedBrowser = async () => {
  const puppeteer = require('puppeteer')
  
  if (browserInstanceCache && !browserInstanceCache.disconnected) {
    return browserInstanceCache
  }

  browserInstanceCache = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-extensions',
      '--no-zygote',
      '--single-process',
    ],
  })

  // Auto-close browser após 5 minutos de inatividade
  if (browserCacheTimeout) {
    clearTimeout(browserCacheTimeout)
  }
  
  browserCacheTimeout = setTimeout(async () => {
    if (browserInstanceCache && !browserInstanceCache.disconnected) {
      await browserInstanceCache.close()
      browserInstanceCache = null
    }
  }, 5 * 60 * 1000) // 5 minutos

  return browserInstanceCache
}

// Função para gerar chave de cache baseada nos dados do currículo
export const generateCacheKey = (curriculumData: any): string => {
  const key = JSON.stringify({
    template: curriculumData.template,
    personalInfo: curriculumData.personalInfo,
    experiences: curriculumData.experiences?.length || 0,
    educations: curriculumData.educations?.length || 0,
    skills: curriculumData.skills?.length || 0,
    languages: curriculumData.languages?.length || 0,
    updatedAt: curriculumData.updatedAt,
  })
  
  return Buffer.from(key).toString('base64').slice(0, 50)
}

// Cache para HTML gerado
export const getCachedHTML = (cacheKey: string): string | undefined => {
  return htmlCache.get(cacheKey)
}

export const setCachedHTML = (cacheKey: string, html: string): void => {
  htmlCache.set(cacheKey, html)
}

// Limpar cache manualmente
export const clearHTMLCache = (): void => {
  htmlCache.clear()
}

// Fechar browser cache manualmente
export const closeBrowserCache = async (): Promise<void> => {
  if (browserCacheTimeout) {
    clearTimeout(browserCacheTimeout)
    browserCacheTimeout = null
  }
  
  if (browserInstanceCache && !browserInstanceCache.disconnected) {
    await browserInstanceCache.close()
    browserInstanceCache = null
  }
}

// Stats do cache para monitoramento
export const getCacheStats = () => {
  return {
    htmlCache: {
      size: htmlCache.size,
      max: htmlCache.max,
      // Note: hits/misses não estão disponíveis na versão atual do LRU-cache
    },
    browserCache: {
      active: browserInstanceCache && !browserInstanceCache.disconnected,
      timeout: !!browserCacheTimeout,
    },
  }
}
