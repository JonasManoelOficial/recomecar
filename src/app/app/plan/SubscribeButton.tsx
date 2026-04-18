"use client";

import { useState } from "react";

const plans = [
  { id: "week", label: "Semanal", price: "R$ 6,90" },
  { id: "month", label: "Mensal", price: "R$ 19,90" },
  { id: "year", label: "Anual", price: "R$ 229,90" },
] as const;

type PlanId = (typeof plans)[number]["id"];

export function SubscribeButton() {
  const [loadingPlan, setLoadingPlan] = useState<PlanId | null>(null);
  const [error, setError] = useState<string | null>(null);

  const start = async (plan: PlanId) => {
    setLoadingPlan(plan);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Não foi possível iniciar o checkout.");
        return;
      }
      if (data.url) window.location.href = data.url as string;
    } catch {
      setError("Erro de rede.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="space-y-3">
      {error ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          {error}
        </p>
      ) : null}
      <div className="grid gap-2 sm:grid-cols-3">
        {plans.map((plan) => (
          <button
            key={plan.id}
            type="button"
            disabled={loadingPlan !== null}
            onClick={() => void start(plan.id)}
            className="rounded-2xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
          >
            {loadingPlan === plan.id ? "Abrindo checkout…" : `${plan.label} - ${plan.price}`}
          </button>
        ))}
      </div>
    </div>
  );
}
