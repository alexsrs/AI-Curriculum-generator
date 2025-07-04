// User types
export interface User {
  id: string
  name?: string
  email: string
  image?: string
  isPremium: boolean
  subscriptionId?: string
  customerId?: string
  subscriptionEnds?: Date
  pdfDownloadsCount: number
  lastPdfReset: Date
  createdAt: Date
  updatedAt: Date
}

// Resume types
export interface Resume {
  id: string
  title: string
  templateId: string
  userId: string
  isPublic: boolean
  
  // Personal Information
  fullName: string
  email: string
  phone?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  
  // Professional Summary
  summary?: string
  
  // Related data
  experiences: Experience[]
  education: Education[]
  skills: Skill[]
  languages: Language[]
  
  createdAt: Date
  updatedAt: Date
}

export interface Experience {
  id: string
  resumeId: string
  company: string
  position: string
  startDate: Date
  endDate?: Date
  isCurrent: boolean
  description?: string
  location?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Education {
  id: string
  resumeId: string
  institution: string
  degree: string
  field?: string
  startDate: Date
  endDate?: Date
  isCurrent: boolean
  gpa?: string
  description?: string
  order: number
  createdAt: Date
  updatedAt: Date
}

export interface Skill {
  id: string
  resumeId: string
  name: string
  level: SkillLevel
  category?: string
  order: number
}

export interface Language {
  id: string
  resumeId: string
  name: string
  level: LanguageLevel
  order: number
}

// Enums
export enum SkillLevel {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  EXPERT = 'EXPERT'
}

export enum LanguageLevel {
  BASIC = 'BASIC',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  FLUENT = 'FLUENT',
  NATIVE = 'NATIVE'
}

// Template types
export interface Template {
  id: string
  name: string
  description: string
  category: 'modern' | 'executive' | 'creative'
  isPremium: boolean
  preview: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
}

// Form types
export interface ResumeFormData {
  title: string
  templateId: string
  
  // Personal Information
  fullName: string
  email: string
  phone?: string
  location?: string
  website?: string
  linkedin?: string
  github?: string
  
  // Professional Summary
  summary?: string
  
  // Dynamic sections
  experiences: Omit<Experience, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>[]
  education: Omit<Education, 'id' | 'resumeId' | 'createdAt' | 'updatedAt'>[]
  skills: Omit<Skill, 'id' | 'resumeId'>[]
  languages: Omit<Language, 'id' | 'resumeId'>[]
}

// AI types
export interface AIPromptData {
  profession: string
  experience: string
  objective: string
  skills?: string[]
  industry?: string
}

export interface AIResponse {
  summary: string
  suggestions?: {
    experiences?: string[]
    skills?: string[]
  }
}

// Subscription types
export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  features: string[]
  price: {
    monthly?: number
    lifetime?: number
  }
  stripePriceIds: {
    monthly?: string
    lifetime?: string
  }
  popular?: boolean
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

// Export types
export interface ExportOptions {
  format: 'pdf' | 'docx' | 'html'
  quality: 'low' | 'medium' | 'high'
  includePhoto: boolean
}

// Analytics types
export interface Analytics {
  resumeViews: number
  pdfDownloads: number
  templateUsage: Record<string, number>
  monthlyStats: {
    month: string
    resumes: number
    downloads: number
  }[]
}
