import Link from "next/link";
import { auth } from "@/auth";
import { SignOutButton } from "@/components/SignOutButton";

const links = [
  { href: "/app/discover", label: "Descobrir" },
  { href: "/app/matches", label: "Matches" },
  { href: "/app/rooms", label: "Salas" },
  { href: "/app/profile", label: "Perfil" },
  { href: "/app/plan", label: "Assinatura" },
];

export default async function AppSectionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-6">
      <header className="flex flex-col gap-4 rounded-2xl border border-zinc-200 bg-white/80 p-4 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/70 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-rose-600">Recomeçar</p>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Olá, <span className="font-medium text-zinc-900 dark:text-zinc-50">{session?.user?.name}</span>
          </p>
        </div>
        <nav className="flex flex-wrap items-center gap-2">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full bg-zinc-100 px-3 py-1.5 text-sm text-zinc-800 hover:bg-zinc-200 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
            >
              {l.label}
            </Link>
          ))}
          <SignOutButton />
        </nav>
      </header>
      <main className="flex min-h-0 flex-1 flex-col">{children}</main>
    </div>
  );
}
