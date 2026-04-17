"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setLoading(false);
      setError(data.error ?? "Não foi possível criar a conta.");
      return;
    }

    const sign = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/app/discover",
    });
    setLoading(false);
    if (sign?.error) {
      setError("Conta criada, mas o login automático falhou. Tente entrar manualmente.");
      return;
    }
    router.push("/app/discover");
    router.refresh();
  };

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-6 px-4 py-16">
      <div>
        <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">Criar conta</h1>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Já tem conta? <Link className="font-medium text-rose-600 hover:underline" href="/login">Entrar</Link>
        </p>
      </div>

      <form onSubmit={submit} className="grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-950">
        {error ? (
          <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100">
            {error}
          </p>
        ) : null}
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700 dark:text-zinc-200">Nome</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>
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
          <span className="text-zinc-700 dark:text-zinc-200">Senha (mín. 6)</span>
          <input
            type="password"
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>
        <button
          type="submit"
          disabled={loading}
          className="rounded-2xl bg-rose-600 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          {loading ? "Criando…" : "Criar conta"}
        </button>
      </form>
    </div>
  );
}
