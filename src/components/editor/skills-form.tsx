'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, X, Lightbulb, Sparkles, Loader2 } from 'lucide-react'
import { useAIGeneration } from '@/hooks/use-ai-generation'

interface Skill {
  id: string
  name: string
  level: 'Básico' | 'Intermediário' | 'Avançado' | 'Especialista'
  category: 'Técnica' | 'Interpessoal' | 'Idioma' | 'Certificação'
}

interface Language {
  id: string
  name: string
  level: 'Básico' | 'Intermediário' | 'Avançado' | 'Fluente' | 'Nativo'
}

interface SkillsFormProps {
  data: {
    skills: Skill[]
    languages: Language[]
  }
  onChange: (data: { skills: Skill[], languages: Language[] }) => void
  personalInfo?: any
}

export function SkillsForm({ data, onChange, personalInfo }: SkillsFormProps) {
  const [skills, setSkills] = useState<Skill[]>(data.skills || [])
  const [languages, setLanguages] = useState<Language[]>(data.languages || [])
  const [newSkill, setNewSkill] = useState('')
  const [newLanguage, setNewLanguage] = useState('')
  const { generateSkillsSuggestions, isLoading } = useAIGeneration()

  const updateData = (newSkills: Skill[], newLanguages: Language[]) => {
    setSkills(newSkills)
    setLanguages(newLanguages)
    onChange({ skills: newSkills, languages: newLanguages })
  }

  const addSkill = () => {
    if (newSkill.trim()) {
      const skill: Skill = {
        id: Math.random().toString(36).substr(2, 9),
        name: newSkill.trim(),
        level: 'Intermediário',
        category: 'Técnica'
      }
      const newSkills = [...skills, skill]
      updateData(newSkills, languages)
      setNewSkill('')
    }
  }

  const removeSkill = (id: string) => {
    const newSkills = skills.filter(skill => skill.id !== id)
    updateData(newSkills, languages)
  }

  const updateSkill = (id: string, field: keyof Skill, value: any) => {
    const newSkills = skills.map(skill => 
      skill.id === id ? { ...skill, [field]: value } : skill
    )
    updateData(newSkills, languages)
  }

  const addLanguage = () => {
    if (newLanguage.trim()) {
      const language: Language = {
        id: Math.random().toString(36).substr(2, 9),
        name: newLanguage.trim(),
        level: 'Intermediário'
      }
      const newLanguages = [...languages, language]
      updateData(skills, newLanguages)
      setNewLanguage('')
    }
  }

  const removeLanguage = (id: string) => {
    const newLanguages = languages.filter(lang => lang.id !== id)
    updateData(skills, newLanguages)
  }

  const updateLanguage = (id: string, field: keyof Language, value: any) => {
    const newLanguages = languages.map(lang => 
      lang.id === id ? { ...lang, [field]: value } : lang
    )
    updateData(skills, newLanguages)
  }

  const suggestSkills = async () => {
    const currentSkillNames = skills.map(s => s.name)
    
    const generatedText = await generateSkillsSuggestions(currentSkillNames, personalInfo)
    
    if (generatedText) {
      // Processar o texto gerado e adicionar as habilidades
      const suggestedSkills = generatedText
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill && !skills.find(s => s.name.toLowerCase() === skill.toLowerCase()))
      
      const newSkills = suggestedSkills.map(skillName => ({
        id: Math.random().toString(36).substr(2, 9),
        name: skillName,
        level: 'Intermediário' as const,
        category: categorizeSkill(skillName)
      }))
      
      updateData([...skills, ...newSkills], languages)
    }
  }

  const categorizeSkill = (skillName: string): 'Técnica' | 'Interpessoal' | 'Idioma' | 'Certificação' => {
    const technicalKeywords = ['javascript', 'python', 'react', 'node', 'sql', 'excel', 'photoshop', 'figma']
    const interpersonalKeywords = ['comunicação', 'liderança', 'equipe', 'resolução', 'criatividade']
    
    const lowerSkill = skillName.toLowerCase()
    
    if (technicalKeywords.some(keyword => lowerSkill.includes(keyword))) {
      return 'Técnica'
    }
    if (interpersonalKeywords.some(keyword => lowerSkill.includes(keyword))) {
      return 'Interpessoal'
    }
    
    return 'Técnica' // Default
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'Básico': return 'bg-gray-100 text-gray-800'
      case 'Intermediário': return 'bg-blue-100 text-blue-800'
      case 'Avançado': return 'bg-green-100 text-green-800'
      case 'Especialista': case 'Fluente': return 'bg-purple-100 text-purple-800'
      case 'Nativo': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Habilidades */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Habilidades Técnicas e Interpessoais</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={suggestSkills}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4 mr-2" />
                )}
                {isLoading ? 'Gerando...' : 'Sugerir com IA'}
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Digite uma habilidade"
              onKeyPress={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {skills.length > 0 && (
            <div className="space-y-3">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <Input
                      value={skill.name}
                      onChange={(e) => updateSkill(skill.id, 'name', e.target.value)}
                      className="border-none p-0 h-auto font-medium"
                    />
                  </div>
                  
                  <select
                    value={skill.category}
                    onChange={(e) => updateSkill(skill.id, 'category', e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="Técnica">Técnica</option>
                    <option value="Interpessoal">Interpessoal</option>
                    <option value="Idioma">Idioma</option>
                    <option value="Certificação">Certificação</option>
                  </select>
                  
                  <select
                    value={skill.level}
                    onChange={(e) => updateSkill(skill.id, 'level', e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Especialista">Especialista</option>
                  </select>
                  
                  <Badge className={getLevelColor(skill.level)}>
                    {skill.level}
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSkill(skill.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Idiomas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Idiomas</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newLanguage}
              onChange={(e) => setNewLanguage(e.target.value)}
              placeholder="Digite um idioma"
              onKeyPress={(e) => e.key === 'Enter' && addLanguage()}
            />
            <Button onClick={addLanguage}>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          {languages.length > 0 && (
            <div className="space-y-3">
              {languages.map((language) => (
                <div key={language.id} className="flex items-center gap-3 p-3 border rounded-lg">
                  <div className="flex-1">
                    <Input
                      value={language.name}
                      onChange={(e) => updateLanguage(language.id, 'name', e.target.value)}
                      className="border-none p-0 h-auto font-medium"
                    />
                  </div>
                  
                  <select
                    value={language.level}
                    onChange={(e) => updateLanguage(language.id, 'level', e.target.value)}
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="Básico">Básico</option>
                    <option value="Intermediário">Intermediário</option>
                    <option value="Avançado">Avançado</option>
                    <option value="Fluente">Fluente</option>
                    <option value="Nativo">Nativo</option>
                  </select>
                  
                  <Badge className={getLevelColor(language.level)}>
                    {language.level}
                  </Badge>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeLanguage(language.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
