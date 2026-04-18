"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type User = {
  email: string;
  name: string | null;
  bio: string | null;
  city: string | null;
  birthYear: number | null;
  birthMonth: number | null;
  birthDay: number | null;
  photoPath: string | null;
  freeMessagesLeft: number;
  subscriptionActive: boolean;
};

export function ProfileForm() {
  const presetPhotos = [
    "/avatars/avatar-1.svg",
    "/avatars/avatar-2.svg",
    "/avatars/avatar-3.svg",
    "/avatars/avatar-4.svg",
    "/avatars/avatar-5.svg",
    "/avatars/avatar-6.svg",
  ];

  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [city, setCity] = useState("");
  const [birthDate, setBirthDate] = useState<string>("");
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    void (async () => {
      const res = await fetch("/api/profile");
      const data = await res.json();
      if (!res.ok) return;
      const u = data.user as User;
      setUser(u);
      setName(u.name ?? "");
      setBio(u.bio ?? "");
      setCity(u.city ?? "");
      if (u.birthYear && u.birthMonth && u.birthDay) {
        const dd = String(u.birthDay).padStart(2, "0");
        const mm = String(u.birthMonth).padStart(2, "0");
        setBirthDate(`${dd}/${mm}/${u.birthYear}`);
      } else if (u.birthYear) {
        setBirthDate(`01/01/${u.birthYear}`);
      } else {
        setBirthDate("");
      }
    })();
  }, []);

  const applyBirthDateMask = (value: string) => {
    const digits = value.replace(/\D/g, "").slice(0, 8);
    if (digits.length <= 2) return digits;
    if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
    return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
  };

  const save = async () => {
    setSaving(true);
    setMsg(null);
    const payload: Record<string, unknown> = { name, bio, city };
    const digits = birthDate.replace(/\D/g, "");
    if (digits.length === 8) {
      const day = Number(digits.slice(0, 2));
      const month = Number(digits.slice(2, 4));
      const year = Number(digits.slice(4, 8));
      const minYear = 1900;
      const maxYear = new Date().getFullYear();

      if (day < 1 || day > 31 || month < 1 || month > 12 || year < minYear || year > maxYear) {
        setSaving(false);
        setMsg("Informe uma data válida no formato dd/mm/aaaa.");
        return;
      }

      payload.birthYear = year;
      payload.birthMonth = month;
      payload.birthDay = day;
    } else if (digits.length === 0) {
      payload.birthYear = null;
      payload.birthMonth = null;
      payload.birthDay = null;
    } else {
      setSaving(false);
      setMsg("Complete a data de nascimento no formato dd/mm/aaaa.");
      return;
    }

    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const err = await res.json().catch(() => null);
      setMsg(typeof err?.error === "string" ? err.error : "Não foi possível salvar.");
      return;
    }
    setMsg("Salvo.");
    const refreshed = await fetch("/api/profile");
    const data = await refreshed.json();
    if (refreshed.ok) {
      const u = data.user as User;
      setUser(u);
      if (u.birthYear && u.birthMonth && u.birthDay) {
        const dd = String(u.birthDay).padStart(2, "0");
        const mm = String(u.birthMonth).padStart(2, "0");
        setBirthDate(`${dd}/${mm}/${u.birthYear}`);
      } else if (u.birthYear) {
        setBirthDate(`01/01/${u.birthYear}`);
      } else {
        setBirthDate("");
      }
    }
  };

  const upload = async (file: File) => {
    setMsg(null);
    if (file.size > 2_000_000) {
      setMsg(
        `Imagem demasiado grande (${Math.round(file.size / 1024)}KB). Reduza para no máximo 2MB (comprime ou redimensiona).`,
      );
      return;
    }
    if (!file.type.startsWith("image/")) {
      setMsg(
        "Este ficheiro não parece ser uma imagem. Guarde como JPEG/PNG (no telemóvel, use “Guardar imagem”, não um print da página).",
      );
      return;
    }
    const fd = new FormData();
    fd.set("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = (await res.json().catch(() => ({}))) as { error?: string; photoPath?: string };
    if (!res.ok) {
      setMsg(data.error ?? "Falha no upload.");
      return;
    }
    if (!data.photoPath) {
      setMsg("Falha no upload.");
      return;
    }
    const photoPath = data.photoPath;
    setUser((u) => (u ? { ...u, photoPath } : u));
    setMsg("Foto atualizada.");
  };

  const choosePresetPhoto = async (presetPath: string) => {
    setMsg(null);
    const fd = new FormData();
    fd.set("presetPath", presetPath);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) {
      setMsg(data.error ?? "Não foi possível usar essa foto.");
      return;
    }
    if (!data.photoPath) {
      setMsg("Não foi possível usar essa foto.");
      return;
    }
    const photoPath = data.photoPath;
    setUser((u) => (u ? { ...u, photoPath } : u));
    setMsg("Foto atualizada.");
  };

  if (!user) return <p className="text-sm text-zinc-600 dark:text-zinc-300">Carregando…</p>;

  return (
    <div className="mx-auto flex w-full max-w-xl flex-col gap-6">
      <div className="flex items-center gap-4">
        <div className="relative h-24 w-24 overflow-hidden rounded-full border border-zinc-200 bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900">
          {user.photoPath ? (
            <Image src={user.photoPath} alt="" fill className="object-cover" sizes="96px" />
          ) : (
            <div className="flex h-full items-center justify-center text-xs text-zinc-500">Sem foto</div>
          )}
        </div>
        <div>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">{user.email}</p>
          <label className="mt-2 inline-flex cursor-pointer rounded-full bg-zinc-900 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white">
            Trocar foto
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void upload(f);
                e.target.value = "";
              }}
            />
          </label>
          <div className="mt-3 flex flex-wrap gap-2">
            {presetPhotos.map((photo) => (
              <button
                key={photo}
                type="button"
                onClick={() => void choosePresetPhoto(photo)}
                className="relative h-10 w-10 overflow-hidden rounded-full border border-zinc-300 transition hover:scale-105 dark:border-zinc-700"
                aria-label="Escolher modelo de foto"
              >
                <Image src={photo} alt="" fill className="object-cover" sizes="40px" />
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Plano:{" "}
          <strong className="text-zinc-900 dark:text-zinc-50">
            {user.subscriptionActive ? "Assinante" : "Grátis (cota de mensagens)"}
          </strong>
        </p>
        {!user.subscriptionActive ? (
          <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-300">
            Mensagens grátis restantes: <strong>{user.freeMessagesLeft}</strong> / 25
          </p>
        ) : null}
      </div>

      <div className="grid gap-3">
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700 dark:text-zinc-200">Nome</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700 dark:text-zinc-200">Cidade</span>
          <input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700 dark:text-zinc-200">Data de nascimento</span>
          <input
            value={birthDate}
            onChange={(e) => setBirthDate(applyBirthDateMask(e.target.value))}
            inputMode="numeric"
            placeholder="dd/mm/aaaa"
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>
        <label className="grid gap-1 text-sm">
          <span className="text-zinc-700 dark:text-zinc-200">Bio</span>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={4}
            className="rounded-xl border border-zinc-300 bg-white px-3 py-2 text-sm dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-50"
          />
        </label>
      </div>

      <div aria-live="polite" className="min-h-[1.25rem] text-sm text-zinc-700 dark:text-zinc-200">
        {msg ?? (saving ? "Salvando…" : "\u00a0")}
      </div>

      <button
        type="button"
        disabled={saving}
        onClick={() => void save()}
        className="rounded-2xl bg-rose-600 py-3 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-50"
      >
        {saving ? "Salvando…" : "Salvar perfil"}
      </button>
    </div>
  );
}
