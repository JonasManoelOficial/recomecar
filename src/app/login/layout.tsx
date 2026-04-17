import { Suspense } from "react";

export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={<p className="px-4 py-16 text-center text-sm text-zinc-600 dark:text-zinc-300">Carregando…</p>}
    >
      {children}
    </Suspense>
  );
}
