import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const me = session.user.id;

  const matches = await prisma.match.findMany({
    where: { OR: [{ userAId: me }, { userBId: me }] },
    orderBy: { createdAt: "desc" },
    include: {
      userA: {
        select: { id: true, name: true, photoPath: true, city: true },
      },
      userB: {
        select: { id: true, name: true, photoPath: true, city: true },
      },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true, createdAt: true, senderId: true },
      },
    },
  });

  const payload = matches.map((m) => {
    const other = m.userAId === me ? m.userB : m.userA;
    const last = m.messages[0];
    return {
      id: m.id,
      other,
      lastMessage: last
        ? { body: last.body, createdAt: last.createdAt, senderId: last.senderId }
        : null,
    };
  });

  return NextResponse.json({ matches: payload });
}
