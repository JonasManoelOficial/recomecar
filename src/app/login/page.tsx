"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/app/discover";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });
    setLoading(false);
    if (res?.error) {
      setError("E-mail ou senha incorretos.");
      return;
    }
    router.push(callbackUrl);
    router.refresh();
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-16">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">Entrar</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Novo por aqui? <Link className="font-medium text-rose-600 hover:underline" href="/register">Criar conta</Link>
        </p>
      </div>

      <form onSubmit={submit} className="grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100">
            {error}
          </p>
        ) : null}
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700 dark:text-zinc-200">E-mail</span>
          <input
            type="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700 dark:text-zinc-200">Senha</span>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-rose-600 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
      </form>
    </div>
  );
}
