import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contato — Recomeçar",
  description: "Fale com a equipe do Recomeçar.",
};

const channels = [
  { title: "Suporte", text: "Dúvidas sobre conta, perfil ou pagamentos.", value: "suporte@recomecar.site" },
  { title: "Denúncias", text: "Comportamento inadequado ou perfil falso.", value: "denuncias@recomecar.site" },
  { title: "Privacidade", text: "Pedidos de acesso ou exclusão de dados.", value: "privacidade@recomecar.site" },
];

export default function ContatoPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl text-ink-900">Fale com a gente</h1>
        <p className="text-ink-600">
          Respondemos em até 2 dias úteis. Se for uma denúncia urgente, use também o botão de denúncia dentro
          do perfil da pessoa.
        </p>
      </header>

      <div className="grid gap-4 sm:grid-cols-3">
        {channels.map((c) => (
          <section key={c.title} className="rounded-2xl border border-brand-100 bg-white p-5">
            <h2 className="font-display text-xl text-ink-900">{c.title}</h2>
            <p className="mt-1 text-sm text-ink-600">{c.text}</p>
            <a className="mt-3 block break-all text-sm font-medium text-brand-700 hover:underline" href={`mailto:${c.value}`}>
              {c.value}
            </a>
          </section>
        ))}
      </div>
    </article>
  );
}
