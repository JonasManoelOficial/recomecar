import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const stripe = getStripe();
  const priceId = process.env.STRIPE_PRICE_ID;
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL;

  if (!stripe || !priceId || !baseUrl) {
    return NextResponse.json(
      {
        error:
          "Pagamentos não configurados. Defina STRIPE_SECRET_KEY, STRIPE_PRICE_ID e NEXT_PUBLIC_APP_URL no .env.",
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
    metadata: { userId: user.id },
    subscription_data: {
      metadata: { userId: user.id },
    },
  });

  if (!checkout.url) {
    return NextResponse.json({ error: "Não foi possível criar o checkout." }, { status: 500 });
  }

  return NextResponse.json({ url: checkout.url });
}
