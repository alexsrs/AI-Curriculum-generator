'use client'

import { useSession, signIn, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'

export default function AuthTestPage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">
          Teste de Autenticação
        </h1>
        
        {session ? (
          <div className="space-y-4">
            <div className="text-center">
              <img
                src={session.user?.image || ''}
                alt="Avatar"
                className="w-16 h-16 rounded-full mx-auto mb-4"
              />
              <h2 className="text-lg font-semibold">{session.user?.name}</h2>
              <p className="text-gray-600">{session.user?.email}</p>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-semibold mb-2">Dados da Sessão:</h3>
              <pre className="text-xs overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>
            
            <Button 
              onClick={() => signOut()} 
              variant="outline" 
              className="w-full"
            >
              Fazer Logout
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-gray-600 mb-4">
              Você não está logado
            </p>
            
            <Button 
              onClick={() => signIn('google')}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Entrar com Google
            </Button>
            
            <div className="mt-4">
              <h3 className="font-semibold mb-2">Status:</h3>
              <p className="text-sm text-gray-600">
                Status: {status}
              </p>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t">
          <a 
            href="/" 
            className="text-blue-600 hover:underline text-sm"
          >
            ← Voltar para a página inicial
          </a>
        </div>
      </div>
    </div>
  )
}
