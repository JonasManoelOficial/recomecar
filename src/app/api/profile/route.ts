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
    .max(new Date().getFullYear())
    .optional()
    .nullable(),
  birthMonth: z.number().int().min(1).max(12).optional().nullable(),
  birthDay: z.number().int().min(1).max(31).optional().nullable(),
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
      birthMonth: true,
      birthDay: true,
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

  const clearingBirth =
    data.birthYear === null && data.birthMonth === null && data.birthDay === null;

  if (
    !clearingBirth &&
    (data.birthYear !== undefined || data.birthMonth !== undefined || data.birthDay !== undefined)
  ) {
    const y = data.birthYear;
    const m = data.birthMonth;
    const d = data.birthDay;
    if (y == null || m == null || d == null) {
      return NextResponse.json({ error: "Data de nascimento incompleta." }, { status: 400 });
    }

    const birth = new Date(y, m - 1, d);
    if (birth.getFullYear() !== y || birth.getMonth() !== m - 1 || birth.getDate() !== d) {
      return NextResponse.json({ error: "Data de nascimento inválida." }, { status: 400 });
    }

    const today = new Date();
    const minAgeDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
    if (birth > minAgeDate) {
      return NextResponse.json({ error: "É necessário ter pelo menos 18 anos." }, { status: 400 });
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: {
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.bio !== undefined ? { bio: data.bio } : {}),
      ...(data.city !== undefined ? { city: data.city } : {}),
      ...(clearingBirth
        ? { birthYear: null, birthMonth: null, birthDay: null }
        : data.birthYear !== undefined && data.birthMonth !== undefined && data.birthDay !== undefined
          ? {
              birthYear: data.birthYear,
              birthMonth: data.birthMonth,
              birthDay: data.birthDay,
            }
          : {}),
    },
  });

  return NextResponse.json({ ok: true });
}
