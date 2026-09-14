import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

export function SiteHeader({ signedIn }: { signedIn: boolean }) {
  return (
    <header className="sticky top-0 z-30 border-b border-brand-100/70 bg-[var(--surface-light)]/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-3 py-3 sm:gap-4 sm:px-4">
        <Link href="/" aria-label="Página inicial do Recomeçar" className="shrink-0">
          <Logo size={32} />
        </Link>

        <nav className="hidden items-center gap-6 text-sm text-ink-600 md:flex">
          <Link className="hover:text-brand-700" href="/#funcionalidades">
            Funcionalidades
          </Link>
          <Link className="hover:text-brand-700" href="/#como-funciona">
            Como funciona
          </Link>
          <Link className="hover:text-brand-700" href="/#seguranca">
            Segurança
          </Link>
          <Link className="hover:text-brand-700" href="/#privacidade">
            Privacidade
          </Link>
        </nav>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {signedIn ? (
            <Link
              href="/app/discover"
              className="whitespace-nowrap rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 sm:px-5"
            >
              Entrar no app
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="whitespace-nowrap rounded-full px-3 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50 sm:px-4"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="whitespace-nowrap rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-700 sm:px-5"
              >
                <span className="sm:hidden">Criar conta</span>
                <span className="hidden sm:inline">Criar minha conta</span>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
