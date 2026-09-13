import Link from "next/link";
import { auth } from "@/auth";
import { LogoMark } from "@/components/brand/Logo";
import { SiteFooter } from "@/components/brand/SiteFooter";
import { SiteHeader } from "@/components/brand/SiteHeader";

const features = [
  {
    title: "Descobrir",
    text: "Um perfil por vez, com foto em destaque, idade, cidade e interesses. Curta, passe ou abra o perfil completo.",
  },
  {
    title: "Combinações",
    text: "Quando o interesse é dos dois lados, acontece o Match — e a conversa fica liberada.",
  },
  {
    title: "Conversas",
    text: "Chat simples e direto, com histórico, horário das mensagens e envio rápido.",
  },
  {
    title: "Você no controle",
    text: "Ajuste preferências, edite seu perfil e escolha quem você quer conhecer.",
  },
];

const steps = [
  { n: "1", title: "Crie seu perfil", text: "Conte quem você é, adicione uma foto e diga o que procura." },
  { n: "2", title: "Descubra pessoas", text: "Veja perfis compatíveis com as suas preferências, um de cada vez." },
  { n: "3", title: "Demonstre interesse", text: "Curta quem te chamou atenção ou passe para o próximo perfil." },
  { n: "4", title: "Converse", text: "Deu Match? Comece a conversa e veja no que dá." },
];

const safety = [
  { title: "Senhas protegidas", text: "Sua senha nunca é guardada em texto puro — usamos hash criptográfico." },
  { title: "Bloquear e denunciar", text: "Se algo te incomodar, você bloqueia e denuncia em poucos toques." },
  { title: "Moderação ativa", text: "Denúncias são analisadas por uma equipe responsável pela comunidade." },
  { title: "Áreas protegidas", text: "Só quem está logado acessa perfis, matches e conversas." },
];

export default async function Home() {
  const session = await auth();

  return (
    <>
      <SiteHeader signedIn={Boolean(session)} />

      <main className="flex flex-1 flex-col">
        {/* Hero: primeira coisa que a pessoa vê ao abrir o site. */}
        <section className="relative overflow-hidden">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-x-0 -top-40 h-96 bg-gradient-to-b from-sunrise-200/60 to-transparent blur-2xl"
          />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 px-4 py-16 lg:grid-cols-2 lg:py-24">
            <div className="rc-rise space-y-6">
              <p className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-brand-700">
                Recomeçar
              </p>
              <h1 className="font-display text-4xl leading-tight text-ink-900 sm:text-5xl lg:text-6xl">
                Uma nova história pode começar hoje.
              </h1>
              <p className="max-w-xl text-lg leading-relaxed text-ink-600">
                Conheça pessoas, crie conexões e descubra novas possibilidades. O Recomeçar existe porque
                todo mundo merece uma nova chance de encontrar alguém especial.
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                {session ? (
                  <Link
                    href="/app/discover"
                    className="rounded-full bg-brand-600 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
                  >
                    Ir para o app
                  </Link>
                ) : (
                  <>
                    <Link
                      href="/register"
                      className="rounded-full bg-brand-600 px-7 py-3.5 text-center text-sm font-semibold text-white transition hover:bg-brand-700"
                    >
                      Criar minha conta
                    </Link>
                    <Link
                      href="/login"
                      className="rounded-full border border-brand-200 px-7 py-3.5 text-center text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                    >
                      Entrar
                    </Link>
                  </>
                )}
              </div>
              <p className="text-sm text-ink-400">Grátis para começar · Feito para o celular e para o computador</p>
            </div>

            {/* Cartão ilustrativo: mostra o formato de perfil da área Descobrir. */}
            <div className="rc-rise relative mx-auto w-full max-w-sm">
              <div className="absolute -right-4 -top-4 hidden h-full w-full rotate-6 rounded-[2rem] border border-brand-100 bg-brand-50/70 sm:block" />
              <div className="relative overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-xl shadow-brand-900/10">
                <div className="flex h-56 items-center justify-center bg-gradient-to-br from-brand-700 via-brand-500 to-sunrise-400">
                  <LogoMark size={84} />
                </div>
                <div className="space-y-3 p-6">
                  <div>
                    <p className="font-display text-2xl text-ink-900">Alguém novo, 32</p>
                    <p className="text-sm text-ink-400">São Paulo · a 6 km de você</p>
                  </div>
                  <p className="text-sm leading-relaxed text-ink-600">
                    “Gosto de caminhar no fim da tarde, cozinhar sem receita e conversar sobre qualquer coisa.”
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Música", "Viagens", "Culinária"].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-4 pt-2">
                    <span className="grid h-12 w-12 place-items-center rounded-full border border-ink-200 text-lg text-ink-400">
                      ✕
                    </span>
                    <span className="grid h-12 w-12 place-items-center rounded-full bg-sunrise-400 text-lg text-white">
                      ★
                    </span>
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-brand-600 text-xl text-white">
                      ♥
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="funcionalidades" className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">O que você encontra aqui</h2>
          <p className="mt-3 max-w-2xl text-ink-600">
            O essencial de um aplicativo de relacionamento moderno, sem complicação.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <article
                key={f.title}
                className="rounded-2xl border border-brand-100 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-brand-900/5"
              >
                <h3 className="font-display text-xl text-ink-900">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{f.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="como-funciona" className="bg-brand-50/60 py-16">
          <div className="mx-auto w-full max-w-6xl px-4">
            <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">Como funciona</h2>
            <p className="mt-3 max-w-2xl text-ink-600">Quatro passos simples, do cadastro à primeira conversa.</p>
            <ol className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {steps.map((s) => (
                <li key={s.n} className="rounded-2xl border border-brand-100 bg-white p-6">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-brand-600 font-display text-lg text-white">
                    {s.n}
                  </span>
                  <h3 className="mt-4 font-display text-xl text-ink-900">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section id="seguranca" className="mx-auto w-full max-w-6xl px-4 py-16">
          <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">Segurança em primeiro lugar</h2>
          <p className="mt-3 max-w-2xl text-ink-600">
            Conhecer gente nova só é bom quando existe confiança. Por isso a segurança vem antes de qualquer
            funcionalidade nova.
          </p>
          <div className="mt-8 grid gap-5 sm:grid-cols-2">
            {safety.map((s) => (
              <article key={s.title} className="rounded-2xl border border-brand-100 bg-white p-6">
                <h3 className="font-display text-xl text-ink-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink-600">{s.text}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="privacidade" className="bg-brand-800 py-16 text-brand-50">
          <div className="mx-auto grid w-full max-w-6xl gap-8 px-4 lg:grid-cols-2">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl">Sua privacidade é sua</h2>
              <p className="mt-3 text-brand-100/85">
                Você decide o que aparece no seu perfil. Nada de endereço exato, nada de e-mail exposto e nada
                de vender seus dados.
              </p>
            </div>
            <ul className="space-y-3 text-sm text-brand-50/90">
              <li className="rounded-2xl bg-brand-700/60 p-4">Mostramos apenas a distância aproximada, nunca sua localização exata.</li>
              <li className="rounded-2xl bg-brand-700/60 p-4">Seu e-mail e sua senha nunca aparecem para outras pessoas.</li>
              <li className="rounded-2xl bg-brand-700/60 p-4">Você pode editar ou apagar suas informações quando quiser.</li>
            </ul>
          </div>
        </section>

        <section className="mx-auto w-full max-w-4xl px-4 py-20 text-center">
          <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">Pronto para recomeçar?</h2>
          <p className="mx-auto mt-3 max-w-xl text-ink-600">
            Leva menos de um minuto para criar sua conta e começar a conhecer pessoas.
          </p>
          <Link
            href={session ? "/app/discover" : "/register"}
            className="mt-8 inline-block rounded-full bg-brand-600 px-8 py-4 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            {session ? "Ir para o app" : "Criar minha conta"}
          </Link>
        </section>
      </main>

      <SiteFooter />
    </>
  );
}
