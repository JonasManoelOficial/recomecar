import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const postSchema = z.object({
  body: z.string().min(1).max(2000),
});

type RouteContext = { params: Promise<{ roomId: string }> };

export async function GET(_req: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { roomId } = await context.params;

  const room = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    select: {
      id: true,
      name: true,
      description: true,
      members: { where: { userId: session.user.id }, select: { id: true } },
    },
  });

  if (!room) {
    return NextResponse.json({ error: "Sala não encontrada." }, { status: 404 });
  }

  const isMember = room.members.length > 0;

  if (!isMember) {
    return NextResponse.json({
      room: { id: room.id, name: room.name, description: room.description },
      messages: [],
      isMember: false,
    });
  }

  const messages = await prisma.roomMessage.findMany({
    where: { roomId },
    orderBy: { createdAt: "asc" },
    take: 300,
    select: {
      id: true,
      body: true,
      createdAt: true,
      sender: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({
    room: { id: room.id, name: room.name, description: room.description },
    messages: messages.map((m) => ({
      id: m.id,
      body: m.body,
      createdAt: m.createdAt,
      senderId: m.sender.id,
      senderName: m.sender.name ?? "Alguém",
    })),
    isMember: true,
  });
}

export async function POST(req: Request, context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const { roomId } = await context.params;

  const json = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Mensagem inválida." }, { status: 400 });
  }

  const member = await prisma.roomMember.findUnique({
    where: {
      roomId_userId: { roomId, userId: session.user.id },
    },
  });

  if (!member) {
    return NextResponse.json({ error: "Entre na sala antes de enviar mensagens.", code: "NOT_MEMBER" }, { status: 403 });
  }

  const msg = await prisma.roomMessage.create({
    data: {
      roomId,
      senderId: session.user.id,
      body: parsed.data.body.trim(),
    },
    select: {
      id: true,
      body: true,
      createdAt: true,
      sender: { select: { id: true, name: true } },
    },
  });

  return NextResponse.json({
    message: {
      id: msg.id,
      body: msg.body,
      createdAt: msg.createdAt,
      senderId: msg.sender.id,
      senderName: msg.sender.name ?? "Alguém",
    },
  });
}
