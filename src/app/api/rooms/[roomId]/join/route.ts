import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = { params: Promise<{ roomId: string }> };

export async function POST(_req: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { roomId } = await context.params;

  const room = await prisma.chatRoom.findUnique({ where: { id: roomId } });
  if (!room) {
    return NextResponse.json({ error: "Sala não encontrada." }, { status: 404 });
  }

  await prisma.roomMember.upsert({
    where: {
      roomId_userId: { roomId, userId: session.user.id },
    },
    update: {},
    create: { roomId, userId: session.user.id },
  });

  return NextResponse.json({ ok: true });
}
