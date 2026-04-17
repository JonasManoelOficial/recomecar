"use client";

import { useState } from "react";

export function SubscribeButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const start = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível iniciar o checkout.");
        return;
      }
      if (data.url) window.location.href = data.url as string;
    } catch {
      setError("Erro de rede.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          {error}
        </p>
      ) : null}
      <button
        type="button"
        disabled={loading}
        onClick={() => void start()}
        className="w-full rounded-2xl bg-rose-600 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50 sm:w-auto sm:px-8"
      >
        {loading ? "Abrindo checkout…" : "Assinar agora (Stripe)"}
      </button>
    </div>
  );
}
