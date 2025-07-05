'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Plus, Trash2 } from 'lucide-react'

interface Education {
  id: string
  institution: string
  degree: string
  field: string
  location: string
  startDate: string
  endDate: string
  current: boolean
  gpa?: string
  description?: string
}

interface EducationFormProps {
  data: Education[]
  onChange: (data: Education[]) => void
}

export function EducationForm({ data, onChange }: EducationFormProps) {
  const [educations, setEducations] = useState<Education[]>(data.length > 0 ? data : [createEmptyEducation()])

  function createEmptyEducation(): Education {
    return {
      id: Math.random().toString(36).substr(2, 9),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      gpa: '',
      description: ''
    }
  }

  const updateEducation = (index: number, field: keyof Education, value: any) => {
    const newEducations = [...educations]
    newEducations[index] = { ...newEducations[index], [field]: value }
    setEducations(newEducations)
    onChange(newEducations)
  }

  const addEducation = () => {
    const newEducations = [...educations, createEmptyEducation()]
    setEducations(newEducations)
    onChange(newEducations)
  }

  const removeEducation = (index: number) => {
    if (educations.length > 1) {
      const newEducations = educations.filter((_, i) => i !== index)
      setEducations(newEducations)
      onChange(newEducations)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Formação Acadêmica</h3>
        <Button onClick={addEducation} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Adicionar Formação
        </Button>
      </div>

      {educations.map((education, index) => (
        <Card key={education.id}>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-md">
                Formação {index + 1}
              </CardTitle>
              {educations.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeEducation(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Instituição *
                </label>
                <Input
                  value={education.institution}
                  onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                  placeholder="Nome da universidade/escola"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Grau *
                </label>
                <Input
                  value={education.degree}
                  onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                  placeholder="Bacharelado, Mestrado, etc."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Área de Estudo *
                </label>
                <Input
                  value={education.field}
                  onChange={(e) => updateEducation(index, 'field', e.target.value)}
                  placeholder="Engenharia de Software, Administração, etc."
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Localização
                </label>
                <Input
                  value={education.location}
                  onChange={(e) => updateEducation(index, 'location', e.target.value)}
                  placeholder="São Paulo, SP"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Data de Início
                </label>
                <Input
                  type="month"
                  value={education.startDate}
                  onChange={(e) => updateEducation(index, 'startDate', e.target.value)}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">
                  Data de Conclusão
                </label>
                <Input
                  type="month"
                  value={education.endDate}
                  onChange={(e) => updateEducation(index, 'endDate', e.target.value)}
                  disabled={education.current}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id={`current-education-${index}`}
                checked={education.current}
                onChange={(e) => {
                  updateEducation(index, 'current', e.target.checked)
                  if (e.target.checked) {
                    updateEducation(index, 'endDate', '')
                  }
                }}
                className="rounded"
              />
              <label htmlFor={`current-education-${index}`} className="text-sm">
                Cursando atualmente
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                GPA/Nota (opcional)
              </label>
              <Input
                value={education.gpa || ''}
                onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                placeholder="3.8/4.0 ou 8.5/10"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                Descrição Adicional (opcional)
              </label>
              <Textarea
                value={education.description || ''}
                onChange={(e) => updateEducation(index, 'description', e.target.value)}
                placeholder="Projetos relevantes, honras acadêmicas, atividades extracurriculares..."
                rows={3}
              />
              <p className="text-sm text-gray-500 mt-1">
                Dica: Mencione projetos importantes, bolsas de estudo ou atividades relevantes.
              </p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
