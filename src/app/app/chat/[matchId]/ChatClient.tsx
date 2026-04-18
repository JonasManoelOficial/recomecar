"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

type Msg = { id: string; body: string; senderId: string; createdAt: string };
type Other = { id: string; name: string | null; photoPath: string | null };

export function ChatClient({ matchId }: { matchId: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [other, setOther] = useState<Other | null>(null);
  const [billing, setBilling] = useState<{ subscriptionActive: boolean; freeMessagesLeft: number } | null>(
    null,
  );
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/messages?matchId=${encodeURIComponent(matchId)}`, { cache: "no-store" });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Não foi possível abrir o chat.");
      return;
    }
    setMessages(data.messages ?? []);
    setOther(data.other ?? null);
    setBilling(data.billing ?? null);
    setError(null);
  }, [matchId]);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 2500);
    return () => window.clearInterval(id);
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const canSend = useMemo(() => {
    if (!billing) return false;
    return billing.subscriptionActive || billing.freeMessagesLeft > 0;
  }, [billing]);

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setError(null);
    const res = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ matchId, body }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Não foi possível enviar.");
      return;
    }
    setText("");
    setMessages((prev) => [...prev, data.message]);
    if (data.billing) setBilling(data.billing);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-xs uppercase tracking-wide text-rose-600">Chat</p>
        <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{other?.name ?? "Match"}</h1>
        {billing ? (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            {billing.subscriptionActive ? (
              <span>Assinatura ativa — envio ilimitado.</span>
            ) : (
              <span>
                Mensagens grátis restantes: <strong>{billing.freeMessagesLeft}</strong> / 25
              </span>
            )}
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100">
          {error}
        </p>
      ) : null}

      <div className="min-h-[320px] flex-1 space-y-2 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
        {messages.map((m) => (
          <div key={m.id} className="rounded-xl bg-zinc-50 px-3 py-2 text-sm text-zinc-900 dark:bg-zinc-900 dark:text-zinc-50">
            {m.body}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={canSend ? "Escreva uma mensagem…" : "Assine para continuar enviando"}
          disabled={!canSend}
          className="flex-1 rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-rose-500/30 focus:ring-4 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={!canSend || !text.trim()}
          className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
