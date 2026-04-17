import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { ChatClient } from "./ChatClient";

export default async function ChatPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const me = session.user.id;

  const match = await prisma.match.findFirst({
    where: {
      id: matchId,
      OR: [{ userAId: me }, { userBId: me }],
    },
  });

  if (!match) redirect("/app/matches");

  return <ChatClient matchId={matchId} />;
}
