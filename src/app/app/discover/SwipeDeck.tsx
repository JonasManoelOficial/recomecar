"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Profile = {
  id: string;
  name: string | null;
  birthYear: number | null;
  city: string | null;
  bio: string | null;
  photoPath: string | null;
};

export function SwipeDeck() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setNote(null);
    try {
      const res = await fetch("/api/discover");
      const data = await res.json();
      setProfile(data.profile ?? null);
    } catch {
      setNote("Não foi possível carregar perfis.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const swipe = async (kind: "LIKE" | "PASS") => {
    if (!profile || busy) return;
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/swipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toUserId: profile.id, kind }),
      });
      const data = await res.json();
      if (!res.ok) {
        setNote(data.error ?? "Erro ao registrar swipe.");
        return;
      }
      if (data.matched && data.matchId) {
        router.push(`/app/chat/${data.matchId}`);
        return;
      }
      await load();
    } catch {
      setNote("Erro de rede. Tente de novo.");
    } finally {
      setBusy(false);
    }
  };

  if (loading) {
    return <p className="text-center text-zinc-600 dark:text-zinc-300">Carregando pessoas…</p>;
  }

  if (!profile) {
    return (
      <div className="mx-auto max-w-md rounded-2xl border border-zinc-200 bg-white p-6 text-center dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Por hoje é só</p>
        <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
          Não há mais perfis novos agora. Volte depois ou peça para amigos criarem conta.
        </p>
        <button
          type="button"
          onClick={() => void load()}
          className="mt-4 rounded-full bg-rose-600 px-5 py-2 text-sm font-medium text-white hover:bg-rose-700"
        >
          Tentar de novo
        </button>
      </div>
    );
  }

  const age = profile.birthYear ? new Date().getFullYear() - profile.birthYear : null;

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-4">
      {note ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
          {note}
        </p>
      ) : null}

      <article className="overflow-hidden rounded-3xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950">
        <div className="relative aspect-[3/4] w-full bg-zinc-100 dark:bg-zinc-900">
          {profile.photoPath ? (
            <Image
              src={profile.photoPath}
              alt={profile.name ?? "Foto de perfil"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 420px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-zinc-500">
              Sem foto ainda
            </div>
          )}
        </div>
        <div className="space-y-2 p-5">
          <h2 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">
            {profile.name}
            {age ? <span className="text-lg font-normal text-zinc-500">, {age}</span> : null}
          </h2>
          {profile.city ? <p className="text-sm text-zinc-600 dark:text-zinc-300">{profile.city}</p> : null}
          {profile.bio ? <p className="text-sm leading-relaxed text-zinc-700 dark:text-zinc-200">{profile.bio}</p> : null}
        </div>
      </article>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => void swipe("PASS")}
          className="rounded-2xl border border-zinc-300 py-3 text-sm font-semibold text-zinc-800 hover:bg-zinc-50 disabled:opacity-50 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-900"
        >
          Passar
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => void swipe("LIKE")}
          className="rounded-2xl bg-rose-600 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
        >
          Curtir
        </button>
      </div>
    </div>
  );
}
