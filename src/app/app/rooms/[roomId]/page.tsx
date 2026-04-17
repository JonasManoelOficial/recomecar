import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { RoomChat } from "./RoomChat";

export default async function RoomPage({ params }: { params: Promise<{ roomId: string }> }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const { roomId } = await params;

  const exists = await prisma.chatRoom.findUnique({
    where: { id: roomId },
    select: { id: true },
  });

  if (!exists) redirect("/app/rooms");

  return <RoomChat roomId={roomId} />;
}
