import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const me = session.user.id;

  const swiped = await prisma.swipe.findMany({
    where: { fromUserId: me },
    select: { toUserId: true },
  });
  const excludeIds = new Set(swiped.map((s) => s.toUserId));
  excludeIds.add(me);

  const candidates = await prisma.user.findMany({
    where: { id: { notIn: [...excludeIds] } },
    take: 40,
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      birthYear: true,
      city: true,
      bio: true,
      photoPath: true,
    },
  });

  if (!candidates.length) {
    return NextResponse.json({ profile: null });
  }

  const profile = candidates[Math.floor(Math.random() * candidates.length)];
  return NextResponse.json({ profile });
}
