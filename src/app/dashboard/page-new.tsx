import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { CurriculumCard } from "@/components/dashboard/curriculum-card";
import { StatsOverview } from "@/components/dashboard/stats-overview";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Plus, LogOut, FileText } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/");
  }

  // Buscar dados do usuário e currículos
  const user = await prisma.user.findUnique({
    where: { email: session.user?.email! },
    include: {
      curriculums: {
        include: {
          personalInfo: true
        },
        orderBy: {
          updatedAt: 'desc'
        }
      }
    }
  });

  if (!user) {
    redirect("/");
  }

  // Calcular estatísticas
  const totalCurriculums = user.curriculums.length;
  const completedCurriculums = user.curriculums.length; // Por enquanto, considerar todos como completos
  const totalDownloads = user.pdfDownloads || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-gray-900">
                Dashboard
              </h1>
              <div className="text-sm text-gray-500">
                Bem-vindo, {user.name}
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                {user.image && (
                  <img 
                    src={user.image} 
                    alt={user.name || ''} 
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-sm text-gray-700">{user.name}</span>
              </div>
              
              <Button variant="outline" size="sm" asChild>
                <Link href="/api/auth/signout">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sair
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas */}
        <div className="mb-8">
          <StatsOverview
            totalCurriculums={totalCurriculums}
            completedCurriculums={completedCurriculums}
            totalDownloads={totalDownloads}
            userPlan={user.plan}
          />
        </div>

        {/* Ações Rápidas */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" asChild>
              <Link href="/editor">
                <Plus className="h-5 w-5 mr-2" />
                Criar Novo Currículo
              </Link>
            </Button>
            
            <Button variant="outline" size="lg" asChild>
              <Link href="/templates">
                Explorar Templates
              </Link>
            </Button>
            
            {user.plan === 'FREE' && (
              <Button variant="outline" size="lg" asChild>
                <Link href="/pricing">
                  ⭐ Upgrade para Premium
                </Link>
              </Button>
            )}
          </div>
        </div>

        {/* Lista de Currículos */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Meus Currículos ({totalCurriculums})
            </h2>
          </div>

          {totalCurriculums === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <div className="text-gray-400 mb-4">
                  <FileText className="h-16 w-16 mx-auto" />
                </div>
                <CardTitle className="text-xl text-gray-600 mb-2">
                  Nenhum currículo encontrado
                </CardTitle>
                <p className="text-gray-500 mb-6">
                  Comece criando seu primeiro currículo profissional
                </p>
                <Button size="lg" asChild>
                  <Link href="/editor">
                    <Plus className="h-5 w-5 mr-2" />
                    Criar Primeiro Currículo
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {user.curriculums.map((curriculum) => (
                <CurriculumCard
                  key={curriculum.id}
                  curriculum={curriculum}
                />
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>
            Gerador de Currículos com IA - Crie currículos profissionais em minutos
          </p>
        </div>
      </div>
    </div>
  );
}
