import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

const planMap = {
  week: process.env.STRIPE_PRICE_ID_WEEK,
  month: process.env.STRIPE_PRICE_ID_MONTH,
  year: process.env.STRIPE_PRICE_ID_YEAR,
} as const;

type PlanKey = keyof typeof planMap;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const plan = typeof body?.plan === "string" ? (body.plan as PlanKey) : null;
  if (!plan || !(plan in planMap)) {
    return NextResponse.json({ error: "Plano inválido." }, { status: 400 });
  }

  const stripe = getStripe();
  const priceId = planMap[plan];
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!stripe || !priceId || !baseUrl) {
    return NextResponse.json(
      {
        error:
          "Pagamentos não configurados. Defina STRIPE_SECRET_KEY, STRIPE_PRICE_ID_WEEK, STRIPE_PRICE_ID_MONTH, STRIPE_PRICE_ID_YEAR e NEXT_PUBLIC_APP_URL no .env.",
      },
      { status: 503 },
    );
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: { id: true, email: true },
  });

  const checkout = await stripe.checkout.sessions.create({
    mode: "subscription",
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${baseUrl}/app/plan?checkout=success`,
    cancel_url: `${baseUrl}/app/plan?checkout=cancel`,
    customer_email: user.email ?? undefined,
    client_reference_id: user.id,
    metadata: { userId: user.id, plan },
    subscription_data: {
      metadata: { userId: user.id, plan },
    },
  });

  if (!checkout.url) {
    return NextResponse.json({ error: "Não foi possível criar o checkout." }, { status: 500 });
  }

  return NextResponse.json({ url: checkout.url });
}
