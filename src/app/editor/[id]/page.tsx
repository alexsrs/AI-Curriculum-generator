'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PdfExportButton } from '@/components/ui/pdf-export-button'
import { PersonalInfoForm } from '@/components/editor/personal-info-form'
import { ExperienceForm } from '@/components/editor/experience-form'
import { EducationForm } from '@/components/editor/education-form'
import { Preview } from '@/components/editor/preview'
import { Save, ArrowLeft, Eye } from 'lucide-react'
import Link from 'next/link'
import { SkillsForm } from '@/components/editor/skills-form'

export default function EditCurriculumPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const params = useParams()
  const { success, error, warning } = useToast()
  const curriculumId = params.id as string

  const [curriculumTitle, setCurriculumTitle] = useState('Carregando...')
  const [activeTab, setActiveTab] = useState('personal')
  const [isSaving, setIsSaving] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // Dados do currículo
  const [curriculumData, setCurriculumData] = useState({
    id: curriculumId,
    title: '',
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

  // Carregar dados do currículo
  useEffect(() => {
    const loadCurriculum = async () => {
      if (!curriculumId || !session) return

      try {
        const response = await fetch(`/api/curriculum?id=${curriculumId}`)
        
        if (!response.ok) {
          throw new Error('Erro ao carregar currículo')
        }

        const result = await response.json()
        const curriculum = result.curriculum

        if (curriculum) {
          setCurriculumData({
            id: curriculum.id,
            title: curriculum.title,
            template: curriculum.template,
            personalInfo: curriculum.personalInfo || {
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
            experiences: curriculum.experiences || [],
            educations: curriculum.educations || [],
            skills: curriculum.skills || [],
            languages: curriculum.languages || []
          })
          
          setCurriculumTitle(curriculum.title)
        }
      } catch (err) {
        console.error('Erro ao carregar currículo:', err)
        error('Erro ao carregar currículo', 'Não foi possível carregar os dados do currículo.')
        router.push('/dashboard')
      } finally {
        setIsLoading(false)
      }
    }

    loadCurriculum()
  }, [curriculumId, session, router])

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
      
      setLastSaved(new Date())
      success('Currículo atualizado!', 'Suas alterações foram salvas com sucesso.')
      
    } catch (err) {
      console.error('Erro ao salvar:', err)
      error('Erro ao salvar', 'Não foi possível salvar as alterações. Tente novamente.')
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

  if (!session || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div>Carregando...</div>
      </div>
    )
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
              
              <Button variant="outline" size="sm" asChild>
                <Link href={`/preview/${curriculumId}`}>
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Link>
              </Button>
              
              <PdfExportButton
                curriculumId={curriculumId}
                title={curriculumTitle}
                size="sm"
              />
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
                    />
                  </TabsContent>
                  
                  <TabsContent value="experience" className="mt-6">
                    <ExperienceForm
                      data={curriculumData.experiences}
                      onChange={(data) => updateCurriculumData('experiences', data)}
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
