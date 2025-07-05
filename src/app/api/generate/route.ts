import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { generatePDF } from '../../../lib/pdf-generator';
import { pricingPlans } from '../../../lib/stripe'; // Corrigido para importação nomeada


export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { resumeData, templateId } = await request.json();

    if (!resumeData || !templateId) {
      return NextResponse.json({ error: 'Resume data and template ID are required' }, { status: 400 });
    }

    // Verificar o plano do usuário e limites
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        plan: true,
        pdfDownloads: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Definir limites por plano usando pricingPlans
    const planLimits = {
      FREE: 3,
      PREMIUM: Infinity,
      YEARLY: Infinity,
    };

    const currentPlan = user.plan as keyof typeof planLimits;
    const limit = planLimits[currentPlan] || 3;

    if (user.pdfDownloads >= limit) {
      return NextResponse.json({ 
        error: 'Monthly download limit reached',
        message: `Você atingiu o limite de ${limit} downloads mensais. Faça upgrade para continuar gerando currículos.`,
        limit,
        current: user.pdfDownloads,
      }, { status: 429 });
    }

    // Gerar PDF
    const pdfBuffer = await generatePDF(resumeData);

    // Incrementar contador de downloads
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        pdfDownloads: user.pdfDownloads + 1,
      },
    });

    // Retornar PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="curriculo-${templateId}-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
