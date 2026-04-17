import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs";

function subscriptionPeriodEnd(sub: Stripe.Subscription): Date | null {
  const ts = sub.items?.data?.[0]?.current_period_end;
  if (!ts) return null;
  return new Date(ts * 1000);
}

async function activateFromSubscription(sub: Stripe.Subscription, userId: string) {
  const end = subscriptionPeriodEnd(sub);

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionActive: sub.status === "active" || sub.status === "trialing",
      stripeCustomerId: typeof sub.customer === "string" ? sub.customer : sub.customer?.id,
      stripeSubscriptionId: sub.id,
      subscriptionCurrentPeriodEnd: end,
    },
  });
}

export async function POST(req: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripe || !secret) {
    return NextResponse.json({ error: "Webhook não configurado." }, { status: 503 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Assinatura ausente." }, { status: 400 });
  }

  const payload = await req.text();

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(payload, signature, secret);
  } catch {
    return NextResponse.json({ error: "Assinatura inválida." }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId ?? session.client_reference_id;
        if (session.mode === "subscription" && userId && session.subscription) {
          const sub = await stripe.subscriptions.retrieve(session.subscription as string, {
            expand: ["items.data"],
          });
          await activateFromSubscription(sub, userId);
        }
        break;
      }
      case "customer.subscription.updated":
      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const userId = sub.metadata?.userId;
        if (!userId) break;

        if (event.type === "customer.subscription.deleted" || sub.status === "canceled") {
          await prisma.user.update({
            where: { id: userId },
            data: {
              subscriptionActive: false,
              stripeSubscriptionId: sub.id,
              subscriptionCurrentPeriodEnd: subscriptionPeriodEnd(sub),
            },
          });
        } else {
          await activateFromSubscription(sub, userId);
        }
        break;
      }
      default:
        break;
    }
  } catch {
    return NextResponse.json({ error: "Erro ao processar evento." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
