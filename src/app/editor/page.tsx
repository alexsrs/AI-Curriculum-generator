'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PersonalInfoForm } from '@/components/editor/personal-info-form'

import { ExperienceForm } from '@/components/editor/experience-form'
import { EducationForm } from '@/components/editor/education-form'

import { Preview } from '@/components/editor/preview'
import { Save, ArrowLeft, Eye, Download } from 'lucide-react'
import Link from 'next/link'
import { SkillsForm } from '@/components/editor/skills-form'

export default function EditorPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { success, error } = useToast()
  const [curriculumTitle, setCurriculumTitle] = useState('Meu Currículo')
  const [activeTab, setActiveTab] = useState('personal')
  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Dados do currículo
  const [curriculumData, setCurriculumData] = useState({
    id: null,
    title: curriculumTitle,
    template: 'modern',
    personalInfo: {
      fullName: '',
      email: session?.user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      linkedin: '',
      github: '',
      website: '',
      summary: ''
    },
    experiences: [],
    educations: [],
    skills: [],
    languages: []
  })

  // Atualizar o título no estado quando for alterado
  useEffect(() => {
    setCurriculumData(prev => ({
      ...prev,
      title: curriculumTitle
    }))
  }, [curriculumTitle])

  useEffect(() => {
    if (!session) {
      router.push('/')
    }
  }, [session, router])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Atualizar o título no estado antes de salvar
      const dataToSave = {
        ...curriculumData,
        title: curriculumTitle
      }

      const response = await fetch('/api/curriculum', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Erro ao salvar currículo')
      }

      // Atualizar o ID do currículo se for um novo currículo
      if (result.curriculum?.id && !curriculumData.id) {
        setCurriculumData(prev => ({
          ...prev,
          id: result.curriculum.id
        }))
      }
      
      setLastSaved(new Date())
      
      // Toast de sucesso
      success('Currículo salvo!', 'Suas alterações foram salvas com sucesso.')
      
    } catch (err) {
      console.error('Erro ao salvar:', err)
      // Toast de erro
      error('Erro ao salvar', 'Não foi possível salvar o currículo. Tente novamente.')
    } finally {
      setIsSaving(false)
    }
  }

  const updateCurriculumData = (section: string, data: any) => {
    setCurriculumData(prev => ({
      ...prev,
      [section]: data
    }))
  }

  if (!session) {
    return <div>Carregando...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar
                </Link>
              </Button>
              
              <div className="flex items-center gap-2">
                <Input
                  value={curriculumTitle}
                  onChange={(e) => setCurriculumTitle(e.target.value)}
                  className="text-lg font-semibold border-none bg-transparent p-0 h-auto focus-visible:ring-0"
                  placeholder="Nome do currículo"
                />
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {lastSaved && (
                <span className="text-sm text-gray-500">
                  Salvo às {lastSaved.toLocaleTimeString()}
                </span>
              )}
              
              <Button 
                variant="outline" 
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="h-4 w-4 mr-2" />
                {isSaving ? 'Salvando...' : 'Salvar'}
              </Button>
              
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              
              <Button size="sm">
                <Download className="h-4 w-4 mr-2" />
                Baixar PDF
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Editor */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Editar Currículo</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="personal">Pessoal</TabsTrigger>
                    <TabsTrigger value="experience">Experiência</TabsTrigger>
                    <TabsTrigger value="education">Educação</TabsTrigger>
                    <TabsTrigger value="skills">Habilidades</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="personal" className="mt-6">
                    <PersonalInfoForm
                      data={curriculumData.personalInfo}
                      onChange={(data) => updateCurriculumData('personalInfo', data)}
                      allData={{
                        experiences: curriculumData.experiences,
                        education: curriculumData.educations,
                        skills: curriculumData.skills.map((s: any) => s.name || s)
                      }}
                    />
                  </TabsContent>
                  
                  <TabsContent value="experience" className="mt-6">
                    <ExperienceForm
                      data={curriculumData.experiences}
                      onChange={(data) => updateCurriculumData('experiences', data)}
                      personalInfo={curriculumData.personalInfo}
                    />
                  </TabsContent>
                  
                  <TabsContent value="education" className="mt-6">
                    <EducationForm
                      data={curriculumData.educations}
                      onChange={(data: any) => updateCurriculumData('educations', data)}
                    />
                  </TabsContent>
                  
                  <TabsContent value="skills" className="mt-6">
                    <SkillsForm
                      data={{ skills: curriculumData.skills, languages: curriculumData.languages }}
                      onChange={(data: any) => {
                        updateCurriculumData('skills', data.skills)
                        updateCurriculumData('languages', data.languages)
                      }}
                      personalInfo={curriculumData.personalInfo}
                    />
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Preview */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <Preview data={curriculumData} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
