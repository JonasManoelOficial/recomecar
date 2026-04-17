"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function CreateRoomForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/rooms", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description: description || null }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error ?? "Não foi possível criar a sala.");
      return;
    }
    setName("");
    setDescription("");
    router.push(`/app/rooms/${data.room.id}`);
    router.refresh();
  };

  return (
    <form
      onSubmit={(e) => void submit(e)}
      className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950"
    >
      <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Criar nova sala</h2>
      {error ? (
        <p className="mt-2 rounded-lg border border-rose-200 bg-rose-50 px-2 py-1 text-xs text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100">
          {error}
        </p>
      ) : null}
      <label className="mt-3 grid gap-1 text-sm">
        <span className="text-zinc-600 dark:text-zinc-300">Nome da sala</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          minLength={2}
          maxLength={80}
          placeholder="Ex.: Filmes, música, São Paulo…"
          className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>
      <label className="mt-2 grid gap-1 text-sm">
        <span className="text-zinc-600 dark:text-zinc-300">Descrição (opcional)</span>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={2}
          className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
        />
      </label>
      <button
        type="submit"
        disabled={loading}
        className="mt-3 w-full rounded-xl bg-rose-600 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 sm:w-auto sm:px-6"
      >
        {loading ? "Criando…" : "Criar sala"}
      </button>
    </form>
  );
}
