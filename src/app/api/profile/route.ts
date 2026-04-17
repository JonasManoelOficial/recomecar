import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const patchSchema = z.object({
  name: z.string().min(1).max(80).optional(),
  bio: z.string().max(500).optional().nullable(),
  city: z.string().max(80).optional().nullable(),
  birthYear: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear() - 18)
    .optional()
    .nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: session.user.id },
    select: {
      email: true,
      name: true,
      bio: true,
      city: true,
      birthYear: true,
      photoPath: true,
      freeMessagesLeft: true,
      subscriptionActive: true,
    },
  });

  return NextResponse.json({ user });
}

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const data = parsed.data;

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
      ...(data.city !== undefined ? { city: data.city } : {}),
      ...(data.birthYear !== undefined ? { birthYear: data.birthYear } : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
