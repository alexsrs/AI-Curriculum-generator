'use client'

import { Button } from '@/components/ui/button'
import { useSession, signIn } from 'next-auth/react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Gerador de Currículos com{' '}
            <span className="text-blue-600">IA</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Crie currículos profissionais incríveis com a ajuda da inteligência artificial.
            Templates modernos, resumos otimizados e exportação em PDF.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {session ? (
              <div className="space-y-4">
                <p className="text-lg text-gray-700">
                  Bem-vindo de volta, {session.user?.name}!
                </p>
                <div className="flex gap-4">
                  <Link href="/dashboard">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      Ir para Dashboard
                    </Button>
                  </Link>
                  <Link href="/editor">
                    <Button size="lg" variant="outline">
                      Criar Novo Currículo
                    </Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Button 
                  size="lg" 
                  onClick={() => signIn('google')}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Começar Gratuitamente
                </Button>
                <p className="text-sm text-gray-500">
                  Faça login com sua conta Google
                </p>
              </div>
            )}
          </div>

          <div className="mt-16 grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🤖</div>
              <h3 className="text-xl font-semibold mb-2">IA Integrada</h3>
              <p className="text-gray-600">
                Gere resumos profissionais otimizados com GPT-4
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Templates Modernos</h3>
              <p className="text-gray-600">
                Escolha entre templates profissionais e responsivos
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-3xl mb-4">📄</div>
              <h3 className="text-xl font-semibold mb-2">Export PDF</h3>
              <p className="text-gray-600">
                Baixe seu currículo em PDF de alta qualidade
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
