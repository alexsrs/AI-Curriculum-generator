'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { MapPin, Phone, Mail, Globe, Linkedin, Github } from 'lucide-react'

interface PreviewData {
  title: string
  personalInfo: {
    fullName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    linkedin: string
    github: string
    website: string
    summary: string
  }
  experiences: Array<{
    company: string
    position: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    description: string
  }>
  educations: Array<{
    institution: string
    degree: string
    field: string
    location: string
    startDate: string
    endDate: string
    current: boolean
    gpa?: string
    description?: string
  }>
  skills: Array<{
    name: string
    level: string
    category: string
  }>
  languages: Array<{
    name: string
    level: string
  }>
}

interface PreviewProps {
  data: PreviewData
}

export function Preview({ data }: PreviewProps) {
  const formatDate = (dateString: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', { 
      month: 'short', 
      year: 'numeric' 
    })
  }

  const formatLocation = () => {
    const parts = []
    if (data.personalInfo.city) parts.push(data.personalInfo.city)
    if (data.personalInfo.state) parts.push(data.personalInfo.state)
    return parts.join(', ')
  }

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden max-w-2xl mx-auto">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8">
        <h1 className="text-3xl font-bold mb-2">
          {data.personalInfo.fullName || 'Seu Nome'}
        </h1>
        
        <div className="flex flex-wrap gap-4 text-sm opacity-90">
          {data.personalInfo.email && (
            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4" />
              {data.personalInfo.email}
            </div>
          )}
          
          {data.personalInfo.phone && (
            <div className="flex items-center gap-1">
              <Phone className="h-4 w-4" />
              {data.personalInfo.phone}
            </div>
          )}
          
          {formatLocation() && (
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              {formatLocation()}
            </div>
          )}
        </div>
        
        <div className="flex flex-wrap gap-3 mt-3">
          {data.personalInfo.linkedin && (
            <a href={data.personalInfo.linkedin} className="flex items-center gap-1 text-sm hover:underline">
              <Linkedin className="h-4 w-4" />
              LinkedIn
            </a>
          )}
          
          {data.personalInfo.github && (
            <a href={data.personalInfo.github} className="flex items-center gap-1 text-sm hover:underline">
              <Github className="h-4 w-4" />
              GitHub
            </a>
          )}
          
          {data.personalInfo.website && (
            <a href={data.personalInfo.website} className="flex items-center gap-1 text-sm hover:underline">
              <Globe className="h-4 w-4" />
              Website
            </a>
          )}
        </div>
      </div>

      <div className="p-8 space-y-8">
        {/* Resumo */}
        {data.personalInfo.summary && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-3 border-b-2 border-blue-600 pb-1">
              Resumo Profissional
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {data.personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experiência */}
        {data.experiences.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
              Experiência Profissional
            </h2>
            <div className="space-y-6">
              {data.experiences.map((exp, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {exp.position}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {exp.company}
                      </p>
                      {exp.location && (
                        <p className="text-sm text-gray-600">
                          {exp.location}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>
                        {formatDate(exp.startDate)} - {exp.current ? 'Atual' : formatDate(exp.endDate)}
                      </p>
                    </div>
                  </div>
                  {exp.description && (
                    <div className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
                      {exp.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Educação */}
        {data.educations.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
              Formação Acadêmica
            </h2>
            <div className="space-y-4">
              {data.educations.map((edu, index) => (
                <div key={index}>
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {edu.degree} em {edu.field}
                      </h3>
                      <p className="text-blue-600 font-medium">
                        {edu.institution}
                      </p>
                      {edu.location && (
                        <p className="text-sm text-gray-600">
                          {edu.location}
                        </p>
                      )}
                      {edu.gpa && (
                        <p className="text-sm text-gray-600">
                          GPA: {edu.gpa}
                        </p>
                      )}
                    </div>
                    <div className="text-right text-sm text-gray-600">
                      <p>
                        {formatDate(edu.startDate)} - {edu.current ? 'Atual' : formatDate(edu.endDate)}
                      </p>
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-gray-700 text-sm leading-relaxed">
                      {edu.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Habilidades */}
        {data.skills.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
              Habilidades
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {['Técnica', 'Interpessoal', 'Certificação'].map(category => {
                const categorySkills = data.skills.filter(skill => skill.category === category)
                if (categorySkills.length === 0) return null
                
                return (
                  <div key={category}>
                    <h4 className="font-semibold text-gray-700 mb-2">{category}s</h4>
                    <div className="flex flex-wrap gap-2">
                      {categorySkills.map((skill, index) => (
                        <Badge 
                          key={index} 
                          variant="secondary"
                          className="text-xs"
                        >
                          {skill.name} ({skill.level})
                        </Badge>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Idiomas */}
        {data.languages.length > 0 && (
          <section>
            <h2 className="text-xl font-bold text-gray-800 mb-4 border-b-2 border-blue-600 pb-1">
              Idiomas
            </h2>
            <div className="flex flex-wrap gap-3">
              {data.languages.map((lang, index) => (
                <div key={index} className="flex items-center gap-2">
                  <span className="font-medium text-gray-800">{lang.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {lang.level}
                  </Badge>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
