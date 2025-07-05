'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2, Sparkles, Loader2 } from 'lucide-react'
import { useAIGeneration } from '@/hooks/use-ai-generation'

interface Experience {
  id: string
  company: string
  position: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  description: string
}

interface ExperienceFormProps {
  data: Experience[]
  onChange: (data: Experience[]) => void
  personalInfo?: any
}

export function ExperienceForm({ data, onChange, personalInfo }: ExperienceFormProps) {
  const [experiences, setExperiences] = useState<Experience[]>(data.length > 0 ? data : [createEmptyExperience()])
  const [loadingDescriptions, setLoadingDescriptions] = useState<Set<number>>(new Set())
  const { generateExperienceDescription } = useAIGeneration()



  const generateDescription = async (index: number) => {
    const experience = experiences[index]
    
    if (!experience.position.trim() || !experience.company.trim()) {
      alert('Por favor, preencha o cargo e a empresa antes de gerar a descrição com IA.')
      return
    }

    setLoadingDescriptions(prev => new Set(prev).add(index))
    
    try {
      const generatedText = await generateExperienceDescription(experience, personalInfo)
      
      if (generatedText) {
        updateExperience(index, 'description', generatedText)
      }
    } finally {
      setLoadingDescriptions(prev => {
        const newSet = new Set(prev)
        newSet.delete(index)
        return newSet
      })
    }
  }

  function createEmptyExperience(): Experience {
    return {
      id: Math.random().toString(36).substr(2, 9),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    }
  }

  const updateExperience = (index: number, field: keyof Experience, value: any) => {
    const newExperiences = [...experiences]
    newExperiences[index] = { ...newExperiences[index], [field]: value }
    setExperiences(newExperiences)
    onChange(newExperiences)
  }

  const addExperience = () => {
    const newExperiences = [...experiences, createEmptyExperience()]
    setExperiences(newExperiences)
    onChange(newExperiences)
  }

  const removeExperience = (index: number) => {
    if (experiences.length > 1) {
      const newExperiences = experiences.filter((_, i) => i !== index)
      setExperiences(newExperiences)
      onChange(newExperiences)
    }
  }

  // const generateDescription = (index: number) => {
  //   // TODO: Integrar com IA para gerar descrição
  //   const experience = experiences[index]
  //   const sampleDescription = `• Responsável por liderar projetos estratégicos em ${experience.company}\n• Desenvolveu soluções inovadoras que resultaram em melhoria de 25% na eficiência\n• Colaborou com equipes multifuncionais para atingir objetivos organizacionais\n• Gerenciou projetos do início ao fim, garantindo entrega no prazo e dentro do orçamento`
  //   updateExperience(index, 'description', sampleDescription)
  // }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Experiência Profissional</h3>
        <Button onClick={addExperience} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Experiência
        </Button>
      </div>

      {experiences.map((experience, index) => (
        <Card key={experience.id}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-md">
                Experiência {index + 1}
              </CardTitle>
              {experiences.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeExperience(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">
                  Empresa *
                </label>
                <Input
                  value={experience.company}
                  onChange={(e) => updateExperience(index, 'company', e.target.value)}
                  placeholder="Nome da empresa"
                  required
                />
              </div>
              
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">
                  Cargo *
                </label>
                <Input
                  value={experience.position}
                  onChange={(e) => updateExperience(index, 'position', e.target.value)}
                  placeholder="Seu cargo na empresa"
                  required
                />
              </div>
              
              <div className="md:col-span-1 lg:col-span-1">
                <label className="block text-sm font-medium mb-2">
                  Localização
                </label>
                <Input
                  value={experience.location}
                  onChange={(e) => updateExperience(index, 'location', e.target.value)}
                  placeholder="São Paulo, SP"
                />
              </div>
              
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">
                  Data de Início
                </label>
                <Input
                  type="month"
                  value={experience.startDate}
                  onChange={(e) => updateExperience(index, 'startDate', e.target.value)}
                />
              </div>
              
              <div className="md:col-span-1">
                <label className="block text-sm font-medium mb-2">
                  Data de Fim
                </label>
                <Input
                  type="month"
                  value={experience.endDate}
                  onChange={(e) => updateExperience(index, 'endDate', e.target.value)}
                  disabled={experience.current}
                  placeholder={experience.current ? "Atual" : ""}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`current-${index}`}
                checked={experience.current}
                onChange={(e) => {
                  updateExperience(index, 'current', e.target.checked)
                  if (e.target.checked) {
                    updateExperience(index, 'endDate', '')
                  }
                }}
                className="rounded"
              />
              <label htmlFor={`current-${index}`} className="text-sm">
                Trabalho aqui atualmente
              </label>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium">
                  Descrição das Responsabilidades
                </label>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => generateDescription(index)}
                  disabled={loadingDescriptions.has(index) || !experience.position.trim() || !experience.company.trim()}
                >
                  {loadingDescriptions.has(index) ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Sparkles className="h-4 w-4 mr-2" />
                  )}
                  {loadingDescriptions.has(index) ? 'Gerando...' : 'Gerar com IA'}
                </Button>
              </div>
              <Textarea
                value={experience.description}
                onChange={(e) => updateExperience(index, 'description', e.target.value)}
                placeholder="Descreva suas principais responsabilidades e conquistas nesta posição..."
                rows={4}
                disabled={loadingDescriptions.has(index)}
              />
              <p className="text-sm text-gray-500 mt-1">
                Dica: Use bullet points (•) para listar suas responsabilidades e conquistas.
                {(!experience.position.trim() || !experience.company.trim()) && (
                  <span className="text-orange-600 font-medium"> Preencha cargo e empresa para usar a IA.</span>
                )}
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
