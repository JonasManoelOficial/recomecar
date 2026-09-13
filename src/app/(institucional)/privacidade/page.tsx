import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Política de privacidade — Recomeçar",
  description: "Como o Recomeçar trata os seus dados pessoais.",
};

const sections = [
  {
    title: "Quais dados coletamos",
    text: "Dados de cadastro (nome, e-mail, data de nascimento, cidade e estado), informações de perfil que você escolhe preencher, fotos enviadas e registros de uso como curtidas, matches e mensagens.",
  },
  {
    title: "Para que usamos",
    text: "Para criar e proteger sua conta, mostrar perfis compatíveis com suas preferências, permitir conversas após um match e investigar denúncias de mau uso.",
  },
  {
    title: "O que nunca fazemos",
    text: "Não vendemos seus dados, não exibimos seu e-mail para outras pessoas e não mostramos sua localização exata — apenas uma distância aproximada.",
  },
  {
    title: "Segurança",
    text: "Senhas são guardadas com hash criptográfico, nunca em texto puro. As áreas internas da plataforma exigem sessão autenticada.",
  },
  {
    title: "Seus direitos",
    text: "Você pode acessar, corrigir ou apagar suas informações pelo próprio perfil, e solicitar a exclusão completa da conta a qualquer momento.",
  },
  {
    title: "Cookies e sessão",
    text: "Usamos cookies apenas para manter você conectado com segurança e lembrar preferências básicas de uso.",
  },
];

export default function PrivacidadePage() {
  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl text-ink-900">Política de privacidade</h1>
        <p className="text-ink-600">Seus dados são seus. Aqui explicamos o que fazemos com eles.</p>
      </header>

      {sections.map((s) => (
        <section key={s.title} className="space-y-2">
          <h2 className="font-display text-xl text-ink-900">{s.title}</h2>
          <p className="leading-relaxed text-ink-600">{s.text}</p>
        </section>
      ))}
    </article>
  );
}
