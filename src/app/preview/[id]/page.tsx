import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Preview } from "@/components/editor/preview";
import { PreviewActions, PreviewBottomActions } from "@/components/preview/preview-actions";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

interface PageProps {
  params: {
    id: string;
  };
}

export default async function PreviewPage({ params }: PageProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // Buscar o currículo específico
  const curriculum = await prisma.curriculum.findUnique({
    where: {
      id: params.id,
    },
    include: {
      personalInfo: true,
      experiences: true,
      educations: true,
      skills: true,
      languages: true,
      user: true,
    },
  });

  if (!curriculum) {
    redirect("/dashboard");
  }

  // Verificar se o usuário tem permissão para ver este currículo
  if (curriculum.user.email !== session.user?.email) {
    redirect("/dashboard");
  }

  // Transformar dados para o formato esperado pelo Preview
  const previewData = {
    title: curriculum.title || '',
    personalInfo: curriculum.personalInfo ? {
      fullName: curriculum.personalInfo.fullName,
      email: curriculum.personalInfo.email,
      phone: curriculum.personalInfo.phone || '',
      address: curriculum.personalInfo.address || '',
      city: curriculum.personalInfo.city || '',
      state: curriculum.personalInfo.state || '',
      zipCode: curriculum.personalInfo.zipCode || '',
      linkedin: curriculum.personalInfo.linkedin || '',
      github: curriculum.personalInfo.github || '',
      website: curriculum.personalInfo.website || '',
      summary: curriculum.personalInfo.summary || '',
    } : {
      fullName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      linkedin: '',
      github: '',
      website: '',
      summary: '',
    },
    experiences: curriculum.experiences.map(exp => ({
      company: exp.company,
      position: exp.position,
      location: exp.location || '',
      startDate: exp.startDate instanceof Date ? exp.startDate.toISOString().split('T')[0] : String(exp.startDate),
      endDate: exp.endDate
        ? (exp.endDate instanceof Date ? exp.endDate.toISOString().split('T')[0] : String(exp.endDate))
        : '',
      current: exp.current,
      description: exp.description || '',
    })),
    educations: curriculum.educations.map(edu => ({
      institution: edu.institution,
      degree: edu.degree,
      field: edu.field ?? '',
      location: edu.location ?? '',
      startDate: edu.startDate instanceof Date ? edu.startDate.toISOString().split('T')[0] : String(edu.startDate),
      endDate: edu.endDate
        ? (edu.endDate instanceof Date ? edu.endDate.toISOString().split('T')[0] : String(edu.endDate))
        : '',
      current: edu.current,
      description: edu.description || '',
    })),
    skills: curriculum.skills.map(skill => ({
      id: skill.id,
      name: skill.name,
      level: skill.level as any,
      category: skill.category as any,
    })),
    languages: curriculum.languages.map(lang => ({
      id: lang.id,
      name: lang.name,
      level: lang.proficiency as any,
    })),
  };

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
                  Voltar ao Dashboard
                </Link>
              </Button>
              
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {curriculum.title}
                </h1>
                <p className="text-sm text-gray-500">
                  Visualização do currículo
                </p>
              </div>
            </div>
            
            <PreviewActions 
              curriculumId={curriculum.id}
              curriculumTitle={curriculum.title}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Prévia do Currículo</CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="bg-white shadow-lg">
              <Preview data={previewData} />
            </div>
          </CardContent>
        </Card>
        
        <PreviewBottomActions 
          curriculumId={curriculum.id}
          curriculumTitle={curriculum.title}
        />
      </div>
    </div>
  );
}
