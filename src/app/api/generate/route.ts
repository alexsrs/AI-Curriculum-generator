import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../../../lib/auth';
import { prisma } from '../../../lib/prisma';
import { generatePDF } from '../../../lib/pdf-generator';
import { PLANS } from '../../../lib/stripe'; // Corrigido para import relativo

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

    const currentPlan = PLANS[user.plan as keyof typeof PLANS];
    
    if (user.pdfDownloads >= currentPlan.downloadsPerMonth) {
      return NextResponse.json({ 
        error: 'Monthly download limit reached',
        message: `Você atingiu o limite de ${currentPlan.downloadsPerMonth} downloads mensais do plano ${currentPlan.name}. Faça upgrade para continuar gerando currículos.`,
        planName: currentPlan.name,
        limit: currentPlan.downloadsPerMonth,
        current: user.pdfDownloads,
      }, { status: 429 });
    }

    // Gerar PDF - corrigido para passar templateId
    const pdfBuffer = await generatePDF(resumeData, templateId);

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
