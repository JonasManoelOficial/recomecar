import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Termos de uso — Recomeçar",
  description: "Regras de uso da plataforma Recomeçar.",
};

const sections = [
  {
    title: "1. Quem pode usar",
    text: "O Recomeçar é uma plataforma para maiores de 18 anos. Ao criar uma conta você declara ter a idade mínima exigida e que as informações do seu perfil são verdadeiras.",
  },
  {
    title: "2. Sua conta",
    text: "Você é responsável por manter sua senha em segurança e por tudo o que acontecer na sua conta. Uma conta pertence a uma única pessoa e não pode ser vendida ou emprestada.",
  },
  {
    title: "3. Convivência",
    text: "Não são permitidos perfis falsos, assédio, discurso de ódio, spam, conteúdo sexual explícito, divulgação de dados de terceiros ou qualquer atividade ilegal. Denúncias são analisadas pela moderação.",
  },
  {
    title: "4. Conteúdo que você publica",
    text: "As fotos e textos continuam sendo seus. Ao publicá-los, você autoriza o Recomeçar a exibi-los a outras pessoas dentro da plataforma, conforme suas preferências de privacidade.",
  },
  {
    title: "5. Suspensão e encerramento",
    text: "Contas que descumprirem estas regras podem ser suspensas ou removidas. Você também pode encerrar sua conta quando quiser, pela área de perfil.",
  },
  {
    title: "6. Planos e pagamentos",
    text: "Recursos pagos, quando contratados, são cobrados de forma recorrente e podem ser cancelados a qualquer momento; o acesso permanece ativo até o fim do período já pago.",
  },
  {
    title: "7. Mudanças nestes termos",
    text: "Podemos atualizar estes termos para refletir melhorias da plataforma. Mudanças relevantes serão comunicadas dentro do aplicativo.",
  },
];

export default function TermosPage() {
  return (
    <article className="space-y-8">
      <header className="space-y-2">
        <h1 className="font-display text-4xl text-ink-900">Termos de uso</h1>
        <p className="text-ink-600">
          Escrito em linguagem simples, porque regra que ninguém entende não protege ninguém.
        </p>
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
