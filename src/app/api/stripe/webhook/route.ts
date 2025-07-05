import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = headers().get('stripe-signature')!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, endpointSecret);
    } catch (err) {
      console.error('⚠️  Webhook signature verification failed.', err);
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 });
    }

    console.log('🔔 Webhook received:', event.type);

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        console.log('💰 Checkout session completed:', session.id);

        if (session.mode === 'subscription' && session.subscription) {
          const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
          const userId = session.metadata?.userId;

          if (userId) {
            await prisma.user.update({
              where: { id: userId },
              data: {
                stripeCustomerId: session.customer as string,
                plan: subscription.items.data[0]?.price.recurring?.interval === 'year' ? 'YEARLY' : 'MONTHLY',
                pdfDownloads: 0, // Reset downloads on new subscription
              },
            });
            console.log('✅ User updated with subscription:', userId);
          }
        }
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('🔄 Subscription updated:', subscription.id);

        const customer = await stripe.customers.retrieve(subscription.customer as string);
        if (customer.deleted) break;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: subscription.customer as string },
        });

        if (user) {
          const planType = subscription.items.data[0]?.price.recurring?.interval === 'year' ? 'YEARLY' : 'MONTHLY';
          
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: subscription.status === 'active' ? planType : 'FREE',
              pdfDownloads: subscription.status === 'active' ? 0 : user.pdfDownloads, // Reset only if activating
            },
          });
          console.log('✅ User plan updated:', user.id, planType);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        console.log('❌ Subscription deleted:', subscription.id);

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: subscription.customer as string },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: 'FREE',
              pdfDownloads: 0,
            },
          });
          console.log('✅ User downgraded to FREE:', user.id);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('💳 Payment succeeded:', invoice.id);

        if (invoice.subscription) {
          const user = await prisma.user.findFirst({
            where: { stripeCustomerId: invoice.customer as string },
          });

          if (user) {
            // Reset downloads on successful payment (monthly/yearly reset)
            await prisma.user.update({
              where: { id: user.id },
              data: {
                pdfDownloads: 0,
              },
            });
            console.log('✅ Downloads reset for user:', user.id);
          }
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        console.log('💳 Payment failed:', invoice.id);
        // Optionally handle failed payments (notifications, etc.)
        break;
      }

      default:
        console.log(`🤷 Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}