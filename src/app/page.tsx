import Link from "next/link";
import { auth } from "@/auth";

export default async function Home() {
  const session = await auth();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-10 px-4 py-16">
      <header className="space-y-4">
        <p className="text-sm font-semibold uppercase tracking-wide text-rose-600">Brasil · Web · Assinatura</p>
        <h1 className="text-4xl font-semibold leading-tight text-zinc-900 dark:text-zinc-50 sm:text-5xl">
          Conheça pessoas de verdade — direto no navegador.
        </h1>
        <p className="max-w-2xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-300">
          Um MVP completo: cadastro, perfil com foto, descobrir, curtidas, matches, chat e{" "}
          <strong>25 mensagens grátis</strong> para testar antes da mensalidade.
        </p>
        <div className="flex flex-wrap gap-3">
          {session ? (
            <Link
              href="/app/discover"
              className="rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700"
            >
              Ir para o app
            </Link>
          ) : (
            <>
              <Link
                href="/register"
                className="rounded-full bg-rose-600 px-6 py-3 text-sm font-semibold text-white hover:bg-rose-700"
              >
                Criar conta
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-semibold text-zinc-900 hover:bg-zinc-50 dark:border-zinc-700 dark:text-zinc-50 dark:hover:bg-zinc-900"
              >
                Entrar
              </Link>
            </>
          )}
        </div>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          { t: "Descobrir", d: "Passe ou curta com foco mobile-first." },
          { t: "Matches + chat", d: "Conversa após curtida mútua, com cota grátis." },
          { t: "Stripe", d: "Assinatura mensal com webhook (ativar no .env)." },
        ].map((c) => (
          <div key={c.t} className="rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-950">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">{c.t}</h2>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">{c.d}</p>
          </div>
        ))}
      </section>
    </div>
  );
}
