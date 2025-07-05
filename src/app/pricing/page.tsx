import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import PricingContent from '@/components/pricing/pricing-content';
export default async function PricingPage() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Escolha Seu Plano
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Desbloqueie todo o potencial do gerador de currículos com IA. 
            Crie currículos profissionais ilimitados com nossos templates premium.
          </p>
        </div>
        
        <PricingContent session={session} />
      </div>
    </div>
  );
}