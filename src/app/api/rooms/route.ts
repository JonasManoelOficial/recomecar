import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const createSchema = z.object({
  name: z.string().min(2).max(80),
  description: z.string().max(500).optional().nullable(),
});

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const rooms = await prisma.chatRoom.findMany({
    orderBy: { createdAt: "desc" },
    take: 80,
    include: {
      _count: { select: { members: true, messages: true } },
      creator: { select: { id: true, name: true } },
      members: {
        where: { userId: session.user.id },
        select: { id: true },
      },
    },
  });

  const payload = rooms.map((r) => ({
    id: r.id,
    name: r.name,
    description: r.description,
    createdAt: r.createdAt,
    memberCount: r._count.members,
    messageCount: r._count.messages,
    creatorName: r.creator.name,
    isMember: r.members.length > 0,
  }));

  return NextResponse.json({ rooms: payload });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const json = await req.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Nome ou descrição inválidos." }, { status: 400 });
  }

  const { name, description } = parsed.data;

  const room = await prisma.chatRoom.create({
    data: {
      name: name.trim(),
      description: description?.trim() || null,
      createdById: session.user.id,
      members: {
        create: { userId: session.user.id },
      },
    },
    select: { id: true, name: true },
  });

  return NextResponse.json({ room });
}
