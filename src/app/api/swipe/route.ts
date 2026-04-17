import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { orderedPair } from "@/lib/pair";

const schema = z.object({
  toUserId: z.string().min(1),
  kind: z.enum(["LIKE", "PASS"]),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = schema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const fromUserId = session.user.id;
  const { toUserId, kind } = parsed.data;

  if (fromUserId === toUserId) {
    return NextResponse.json({ error: "Inválido." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id: toUserId } });
  if (!target) {
    return NextResponse.json({ error: "Usuário não encontrado." }, { status: 404 });
  }

  const swipeKind = kind === "LIKE" ? "LIKE" : "PASS";

  await prisma.swipe.upsert({
    where: { fromUserId_toUserId: { fromUserId, toUserId } },
    update: { kind: swipeKind },
    create: { fromUserId, toUserId, kind: swipeKind },
  });

  let matched = false;
  let matchId: string | null = null;

  if (swipeKind === "LIKE") {
    const reciprocal = await prisma.swipe.findUnique({
      where: { fromUserId_toUserId: { fromUserId: toUserId, toUserId: fromUserId } },
    });

    if (reciprocal?.kind === "LIKE") {
      const [userAId, userBId] = orderedPair(fromUserId, toUserId);
      const match = await prisma.match.upsert({
        where: { userAId_userBId: { userAId, userBId } },
        update: {},
        create: { userAId, userBId },
      });
      matched = true;
      matchId = match.id;
    }
  }

  return NextResponse.json({ ok: true, matched, matchId });
}
