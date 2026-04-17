"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type RoomInfo = { id: string; name: string; description: string | null };
type Msg = {
  id: string;
  body: string;
  createdAt: string;
  senderId: string;
  senderName: string;
};

export function RoomChat({ roomId }: { roomId: string }) {
  const [room, setRoom] = useState<RoomInfo | null>(null);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [isMember, setIsMember] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  const load = useCallback(async () => {
    const res = await fetch(`/api/rooms/${roomId}/messages`);
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Erro ao carregar a sala.");
      return;
    }
    setRoom(data.room);
    setMessages(data.messages ?? []);
    setIsMember(Boolean(data.isMember));
    setError(null);
  }, [roomId]);

  useEffect(() => {
    void load();
    const id = window.setInterval(() => void load(), 2800);
    return () => window.clearInterval(id);
  }, [load]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const join = async () => {
    setJoining(true);
    setError(null);
    const res = await fetch(`/api/rooms/${roomId}/join`, { method: "POST" });
    const data = await res.json();
    setJoining(false);
    if (!res.ok) {
      setError(data.error ?? "Não foi possível entrar.");
      return;
    }
    await load();
  };

  const send = async () => {
    const body = text.trim();
    if (!body) return;
    setError(null);
    const res = await fetch(`/api/rooms/${roomId}/messages`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ body }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error ?? "Não foi possível enviar.");
      return;
    }
    setText("");
    setMessages((prev) => [...prev, data.message]);
  };

  if (!room && !error) {
    return <p className="text-sm text-zinc-600 dark:text-zinc-300">Carregando sala…</p>;
  }

  if (error && !room) {
    return (
      <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100">
        {error}
      </p>
    );
  }

  if (!room) return null;

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-3">
      <div className="flex flex-wrap items-start justify-between gap-2 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div>
          <p className="text-xs uppercase tracking-wide text-rose-600">Sala pública</p>
          <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50">{room.name}</h1>
          {room.description ? (
            <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">{room.description}</p>
          ) : null}
        </div>
        <Link
          href="/app/rooms"
          className="rounded-full border border-zinc-300 px-3 py-1.5 text-sm text-zinc-700 hover:bg-zinc-50 dark:border-zinc-600 dark:text-zinc-200 dark:hover:bg-zinc-900"
        >
          ← Salas
        </Link>
      </div>

      {!isMember ? (
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
          <p className="text-sm text-amber-950 dark:text-amber-100">
            Você ainda não entrou nesta sala. Entre para ver o histórico e mandar mensagens.
          </p>
          <button
            type="button"
            disabled={joining}
            onClick={() => void join()}
            className="mt-3 rounded-xl bg-amber-700 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-800 disabled:opacity-50"
          >
            {joining ? "Entrando…" : "Entrar na sala"}
          </button>
        </div>
      ) : null}

      {error ? (
        <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-900 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-100">
          {error}
        </p>
      ) : null}

      <div className="min-h-[280px] flex-1 space-y-2 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-3 dark:border-zinc-800 dark:bg-zinc-950">
        {messages.length === 0 && isMember ? (
          <p className="text-sm text-zinc-500">Nenhuma mensagem ainda. Seja o primeiro a falar.</p>
        ) : null}
        {messages.map((m) => (
          <div key={m.id} className="rounded-xl bg-zinc-50 px-3 py-2 text-sm dark:bg-zinc-900">
            <p className="text-xs font-medium text-rose-700 dark:text-rose-300">{m.senderName}</p>
            <p className="text-zinc-900 dark:text-zinc-50">{m.body}</p>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={isMember ? "Mensagem para a sala…" : "Entre na sala para enviar"}
          disabled={!isMember}
          className="flex-1 rounded-2xl border border-zinc-300 bg-white px-4 py-3 text-sm text-zinc-900 outline-none ring-rose-500/30 focus:ring-4 disabled:opacity-60 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
        />
        <button
          type="button"
          onClick={() => void send()}
          disabled={!isMember || !text.trim()}
          className="rounded-2xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          Enviar
        </button>
      </div>
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Mensagens em sala pública não descontam suas 25 mensagens do chat privado (match).
      </p>
    </div>
  );
}
