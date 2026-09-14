import Link from "next/link";
import { Logo } from "@/components/brand/Logo";

const socialLinks = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "Facebook", href: "https://facebook.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-brand-100 bg-brand-800 text-brand-50">
      <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-3">
          <Logo size={34} className="[&_span]:text-brand-50" />
          <p className="text-sm text-brand-100/80">
            Todo mundo merece uma nova chance de encontrar alguém especial.
          </p>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold uppercase tracking-wide text-brand-200">Plataforma</p>
          <Link className="block text-brand-50/90 hover:underline" href="/register">
            Criar minha conta
          </Link>
          <Link className="block text-brand-50/90 hover:underline" href="/login">
            Entrar
          </Link>
          <Link className="block text-brand-50/90 hover:underline" href="/app/plan">
            Planos
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold uppercase tracking-wide text-brand-200">Legal</p>
          <Link className="block text-brand-50/90 hover:underline" href="/termos">
            Termos de uso
          </Link>
          <Link className="block text-brand-50/90 hover:underline" href="/privacidade">
            Política de privacidade
          </Link>
          <Link className="block text-brand-50/90 hover:underline" href="/contato">
            Contato
          </Link>
        </div>

        <div className="space-y-2 text-sm">
          <p className="font-semibold uppercase tracking-wide text-brand-200">Redes sociais</p>
          {socialLinks.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noreferrer"
              className="block text-brand-50/90 hover:underline"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>

      <div className="border-t border-brand-700/70 px-4 py-5 text-center text-xs text-brand-100/70">
        © {new Date().getFullYear()} Recomeçar. Feito no Brasil, para quem acredita em recomeços.
      </div>
    </footer>
  );
}
