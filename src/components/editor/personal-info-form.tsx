'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Loader2 } from 'lucide-react'
import { useAIGeneration } from '@/hooks/use-ai-generation'

interface PersonalInfo {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zipCode: string
  linkedin: string
  github: string
  website: string
  summary: string
}

interface PersonalInfoFormProps {
  data: PersonalInfo
  onChange: (data: PersonalInfo) => void
  allData?: {
    experiences?: any[]
    education?: any[]
    skills?: string[]
  }
}

export function PersonalInfoForm({ data, onChange, allData }: PersonalInfoFormProps) {
  const [formData, setFormData] = useState<PersonalInfo>(data)
  const { generateSummary, isLoading } = useAIGeneration()

  useEffect(() => {
    setFormData(data)
  }, [data])

  const handleChange = (field: keyof PersonalInfo, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onChange(newData)
  }

  const handleGenerateSummary = async () => {
    if (!formData.fullName.trim()) {
      alert('Por favor, preencha seu nome completo antes de gerar o resumo com IA.')
      return
    }

    const generatedText = await generateSummary(
      formData,
      allData?.experiences || [],
      allData?.education || [],
      allData?.skills || []
    )

    if (generatedText) {
      handleChange('summary', generatedText)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Informações Pessoais</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Nome Completo *
            </label>
            <Input
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Email *
            </label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="seu@email.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Telefone
            </label>
            <Input
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="(11) 99999-9999"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Endereço
            </label>
            <Input
              value={formData.address}
              onChange={(e) => handleChange('address', e.target.value)}
              placeholder="Rua, número, bairro"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Cidade
            </label>
            <Input
              value={formData.city}
              onChange={(e) => handleChange('city', e.target.value)}
              placeholder="São Paulo"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              Estado
            </label>
            <Input
              value={formData.state}
              onChange={(e) => handleChange('state', e.target.value)}
              placeholder="SP"
            />
          </div>
        </div>
      </div>

      <div>
        <h4 className="text-md font-semibold mb-4">Links Profissionais</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              LinkedIn
            </label>
            <Input
              value={formData.linkedin}
              onChange={(e) => handleChange('linkedin', e.target.value)}
              placeholder="https://linkedin.com/in/seuperfil"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">
              GitHub
            </label>
            <Input
              value={formData.github}
              onChange={(e) => handleChange('github', e.target.value)}
              placeholder="https://github.com/seuusuario"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-2">
              Website/Portfolio
            </label>
            <Input
              value={formData.website}
              onChange={(e) => handleChange('website', e.target.value)}
              placeholder="https://seusite.com"
            />
          </div>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-md font-semibold">Resumo Profissional</h4>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleGenerateSummary}
            disabled={isLoading || !formData.fullName.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            {isLoading ? 'Gerando...' : 'Gerar com IA'}
          </Button>
        </div>
        
        <Textarea
          value={formData.summary}
          onChange={(e) => handleChange('summary', e.target.value)}
          placeholder="Escreva um breve resumo sobre você, suas principais qualificações e objetivos profissionais..."
          rows={4}
          disabled={isLoading}
        />
        <p className="text-sm text-gray-500 mt-2">
          Dica: Um bom resumo deve ter 2-3 frases destacando suas principais qualificações. 
          {!formData.fullName.trim() && (
            <span className="text-orange-600 font-medium"> Preencha seu nome para usar a IA.</span>
          )}
        </p>
      </div>
    </div>
  )
}
