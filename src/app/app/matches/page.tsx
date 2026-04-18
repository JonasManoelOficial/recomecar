import Link from "next/link";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { resolvePhotoSrc } from "@/lib/userPhoto";

export const dynamic = "force-dynamic";

export default async function MatchesPage() {
  const session = await auth();
  if (!session?.user?.id) return null;

  const me = session.user.id;

  const matches = await prisma.match.findMany({
    where: { OR: [{ userAId: me }, { userBId: me }] },
    orderBy: { createdAt: "desc" },
    include: {
      userA: { select: { id: true, name: true, photoPath: true, city: true } },
      userB: { select: { id: true, name: true, photoPath: true, city: true } },
      messages: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { body: true },
      },
    },
  });

  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Matches</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Conversas liberadas após curtida mútua.</p>
      </div>

      {matches.length === 0 ? (
        <p className="text-sm text-zinc-600 dark:text-zinc-300">Nenhum match ainda. Vá em Descobrir.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {matches.map((m) => {
            const other = m.userAId === me ? m.userB : m.userA;
            const preview = m.messages[0]?.body;
            return (
              <li key={m.id}>
                <Link
                  href={`/app/chat/${m.id}`}
                  className="flex gap-3 rounded-2xl border border-zinc-200 bg-white p-3 hover:border-rose-300 dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-rose-700"
                >
                  <div className="relative h-14 w-14 overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-900">
                    {other.photoPath ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={resolvePhotoSrc(other.photoPath) ?? other.photoPath}
                        alt=""
                        width={56}
                        height={56}
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-zinc-900 dark:text-zinc-50">{other.name}</p>
                    {other.city ? (
                      <p className="truncate text-xs text-zinc-500 dark:text-zinc-400">{other.city}</p>
                    ) : null}
                    {preview ? (
                      <p className="mt-1 truncate text-sm text-zinc-600 dark:text-zinc-300">{preview}</p>
                    ) : (
                      <p className="mt-1 text-sm text-zinc-500">Diga oi 👋</p>
                    )}
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
