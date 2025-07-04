import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Gerador de Currículos com IA',
  description: 'Crie currículos profissionais incríveis com a ajuda da inteligência artificial',
  keywords: ['currículo', 'CV', 'IA', 'inteligência artificial', 'emprego', 'carreira'],
  authors: [{ name: 'AI Curriculum Generator' }],
  openGraph: {
    title: 'Gerador de Currículos com IA',
    description: 'Crie currículos profissionais incríveis com a ajuda da inteligência artificial',
    type: 'website',
    locale: 'pt_BR',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}
