import { z } from "zod";
import { auth } from "@/auth";
import { jsonNoStore } from "@/lib/jsonNoStore";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const getSchema = z.object({
  matchId: z.string().min(1),
});

const postSchema = z.object({
  matchId: z.string().min(1),
  body: z.string().min(1).max(2000),
});

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonNoStore({ error: "Não autenticado." }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const parsed = getSchema.safeParse({ matchId: searchParams.get("matchId") });
  if (!parsed.success) {
    return jsonNoStore({ error: "matchId obrigatório." }, { status: 400 });
  }

  const { matchId } = parsed.data;
  const me = session.user.id;

  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ userAId: me }, { userBId: me }],
    },
    include: {
      userA: { select: { id: true, name: true, photoPath: true } },
      userB: { select: { id: true, name: true, photoPath: true } },
    },
  });

  if (!match) {
    return jsonNoStore({ error: "Match não encontrado." }, { status: 404 });
  }

  const messages = await prisma.message.findMany({
    where: { matchId },
    orderBy: { createdAt: "asc" },
    select: { id: true, body: true, senderId: true, createdAt: true },
  });

  const other = match.userAId === me ? match.userB : match.userA;

  const user = await prisma.user.findUniqueOrThrow({
    where: { id: me },
    select: {
      subscriptionActive: true,
      freeMessagesLeft: true,
    },
  });

  return jsonNoStore({
    messages,
    other,
    billing: {
      subscriptionActive: user.subscriptionActive,
      freeMessagesLeft: user.freeMessagesLeft,
    },
  });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonNoStore({ error: "Não autenticado." }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return jsonNoStore({ error: "Mensagem inválida." }, { status: 400 });
  }

  const me = session.user.id;
  const { matchId, body } = parsed.data;

  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ userAId: me }, { userBId: me }],
    },
  });

  if (!match) {
    return jsonNoStore({ error: "Match não encontrado." }, { status: 404 });
  }

  const user = await prisma.user.findUniqueOrThrow({ where: { id: me } });

  if (!user.subscriptionActive) {
    if (user.freeMessagesLeft <= 0) {
      return jsonNoStore(
        {
          error: "Suas 25 mensagens grátis acabaram. Assine para continuar.",
          code: "QUOTA_EXCEEDED",
        },
        { status: 402 },
      );
    }

    await prisma.user.update({
      where: { id: me },
      data: { freeMessagesLeft: { decrement: 1 } },
    });
  }

  const message = await prisma.message.create({
    data: { matchId, senderId: me, body },
    select: { id: true, body: true, senderId: true, createdAt: true },
  });

  const updated = await prisma.user.findUniqueOrThrow({
    where: { id: me },
    select: { subscriptionActive: true, freeMessagesLeft: true },
  });

  return jsonNoStore({
    message,
    billing: {
      subscriptionActive: updated.subscriptionActive,
      freeMessagesLeft: updated.freeMessagesLeft,
    },
  });
}
