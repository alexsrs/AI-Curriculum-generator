import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { DashboardContentSkeleton } from "@/components/ui/dashboard-skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { Suspense } from "react";

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
        <Suspense fallback={<DashboardContentSkeleton />}>
          <DashboardContent initialUser={user} />
        </Suspense>

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
