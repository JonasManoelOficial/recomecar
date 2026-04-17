import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CreateRoomForm } from "./CreateRoomForm";

export default async function RoomsPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const rooms = await prisma.chatRoom.findMany({
    orderBy: { createdAt: "desc" },
    take: 80,
    include: {
      _count: { select: { members: true } },
      creator: { select: { name: true } },
      members: {
        where: { userId: session.user.id },
        select: { id: true },
      },
    },
  });

  return (
    <div className="flex flex-1 flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Salas / bate-papo</h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
          Canais abertos: qualquer pessoa logada pode criar uma sala e outras entram para conversar em grupo.
        </p>
      </div>

      <CreateRoomForm />

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
          Salas ativas
        </h2>
        {rooms.length === 0 ? (
          <p className="text-sm text-zinc-600 dark:text-zinc-300">Nenhuma sala ainda. Crie a primeira acima.</p>
        ) : (
          <ul className="grid gap-2 sm:grid-cols-2">
            {rooms.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/app/rooms/${r.id}`}
                  className="block rounded-2xl border border-zinc-200 bg-white p-4 hover:border-rose-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-rose-700"
                >
                  <p className="font-medium text-zinc-900 dark:text-zinc-50">{r.name}</p>
                  {r.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-600 dark:text-zinc-300">{r.description}</p>
                  ) : null}
                  <p className="mt-2 text-xs text-zinc-500">
                    Por {r.creator.name ?? "alguém"} · {r._count.members} na sala
                    {r.members.length > 0 ? " · você entrou" : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
