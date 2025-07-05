'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { SubscriptionManager } from '@/components/ui/subscription-manager-simple';
import { TEMPLATES, getTemplate } from '@/lib/templates';

interface UserPlan {
  plan: string;
  downloadsThisMonth: number;
  maxDownloads: number;
  hasActiveSubscription: boolean;
}

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    city: string;
    summary: string;
  };
  experiences: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
}

export default function DashboardContent() {
  const { data: session } = useSession();
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState('professional-classic');
  const [isGenerating, setIsGenerating] = useState(false);
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: session?.user?.email || '',
      phone: '',
      city: '',
      summary: '',
    },
    experiences: [
      {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
      }
    ],
    education: [
      {
        institution: '',
        degree: '',
        startDate: '',
        endDate: '',
      }
    ],
    skills: [],
  });

  useEffect(() => {
    fetchUserPlan();
  }, []);

  const fetchUserPlan = async () => {
    try {
      const response = await fetch('/api/user/plan');
      if (response.ok) {
        const data = await response.json();
        setUserPlan(data);
      }
    } catch (error) {
      console.error('Error fetching user plan:', error);
    }
  };

  const handleGeneratePDF = async () => {
    if (!userPlan) return;

    if (userPlan.downloadsThisMonth >= userPlan.maxDownloads) {
      alert(`Você atingiu o limite de ${userPlan.maxDownloads} downloads mensais. Faça upgrade para continuar.`);
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          templateId: selectedTemplate,
        }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `curriculo-${selectedTemplate}-${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        
        // Atualizar dados do plano
        fetchUserPlan();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Erro ao gerar PDF');
      }
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Erro ao gerar PDF');
    } finally {
      setIsGenerating(false);
    }
  };

  const addExperience = () => {
    setResumeData(prev => ({
      ...prev,
      experiences: [...prev.experiences, {
        company: '',
        position: '',
        startDate: '',
        endDate: '',
        description: '',
      }]
    }));
  };

  const addEducation = () => {
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, {
        institution: '',
        degree: '',
        startDate: '',
        endDate: '',
      }]
    }));
  };

  const availableTemplates = TEMPLATES.filter(template => 
    !template.isPremium || userPlan?.hasActiveSubscription
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Informações do Plano */}
      <div className="lg:col-span-3">
        <Card>
          <CardHeader>
            <CardTitle>Seu Plano</CardTitle>
            <CardDescription>
              Gerencie sua assinatura e acompanhe o uso
            </CardDescription>
          </CardHeader>
          <CardContent>
            {userPlan && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Plano atual:</span>
                  <Badge variant={userPlan.plan === 'FREE' ? 'secondary' : 'default'}>
                    {userPlan.plan}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Downloads este mês</span>
                    <span>{userPlan.downloadsThisMonth} / {userPlan.maxDownloads}</span>
                  </div>
                  <Progress 
                    value={(userPlan.downloadsThisMonth / userPlan.maxDownloads) * 100} 
                    className="w-full"
                  />
                </div>

                <SubscriptionManager />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Informações Pessoais */}
      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle>Informações Pessoais</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Nome Completo"
                value={resumeData.personalInfo.fullName}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                }))}
              />
              <Input
                placeholder="Email"
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, email: e.target.value }
                }))}
              />
              <Input
                placeholder="Telefone"
                value={resumeData.personalInfo.phone}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, phone: e.target.value }
                }))}
              />
              <Input
                placeholder="Cidade"
                value={resumeData.personalInfo.city}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, city: e.target.value }
                }))}
              />
            </div>
            <Textarea
              placeholder="Resumo profissional"
              value={resumeData.personalInfo.summary}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, summary: e.target.value }
              }))}
              rows={4}
            />
          </CardContent>
        </Card>

        {/* Experiências */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Experiências Profissionais</CardTitle>
            <Button onClick={addExperience} variant="outline" size="sm">
              Adicionar Experiência
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {resumeData.experiences.map((experience, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg">
                <Input
                  placeholder="Empresa"
                  value={experience.company}
                  onChange={(e) => {
                    const newExperiences = [...resumeData.experiences];
                    newExperiences[index].company = e.target.value;
                    setResumeData(prev => ({ ...prev, experiences: newExperiences }));
                  }}
                />
                <Input
                  placeholder="Cargo"
                  value={experience.position}
                  onChange={(e) => {
                    const newExperiences = [...resumeData.experiences];
                    newExperiences[index].position = e.target.value;
                    setResumeData(prev => ({ ...prev, experiences: newExperiences }));
                  }}
                />
                <Input
                  placeholder="Data de Início"
                  type="month"
                  value={experience.startDate}
                  onChange={(e) => {
                    const newExperiences = [...resumeData.experiences];
                    newExperiences[index].startDate = e.target.value;
                    setResumeData(prev => ({ ...prev, experiences: newExperiences }));
                  }}
                />
                <Input
                  placeholder="Data de Fim"
                  type="month"
                  value={experience.endDate}
                  onChange={(e) => {
                    const newExperiences = [...resumeData.experiences];
                    newExperiences[index].endDate = e.target.value;
                    setResumeData(prev => ({ ...prev, experiences: newExperiences }));
                  }}
                />
                <div className="md:col-span-2">
                  <Textarea
                    placeholder="Descrição das atividades"
                    value={experience.description}
                    onChange={(e) => {
                      const newExperiences = [...resumeData.experiences];
                      newExperiences[index].description = e.target.value;
                      setResumeData(prev => ({ ...prev, experiences: newExperiences }));
                    }}
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Seleção de Template e Geração */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Templates</CardTitle>
            <CardDescription>
              Escolha o template do seu currículo
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {availableTemplates.map(template => (
              <div
                key={template.id}
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">{template.name}</h4>
                  {template.isPremium && (
                    <Badge variant="outline">Premium</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  {template.description}
                </p>
              </div>
            ))}
            
            <Button
              onClick={handleGeneratePDF}
              disabled={isGenerating || !userPlan}
              className="w-full"
            >
              {isGenerating ? 'Gerando...' : 'Gerar Currículo PDF'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}