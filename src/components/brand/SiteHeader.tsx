import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-brand-100/70 bg-background/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" aria-label="Página inicial do Recomeçar">
          <Logo size={34} />
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink-600 md:flex">
          <a className="hover:text-brand-700" href="#funcionalidades">
            Funcionalidades
          </a>
          <a className="hover:text-brand-700" href="#como-funciona">
            Como funciona
          </a>
          <a className="hover:text-brand-700" href="#seguranca">
            Segurança
          </a>
          <a className="hover:text-brand-700" href="#privacidade">
            Privacidade
          </a>
        </nav>

        <div className="flex items-center gap-2">
          {signedIn ? (
            <Link
              href="/app/discover"
              className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              Entrar no app
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-brand-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-brand-700"
              >
                Criar minha conta
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
