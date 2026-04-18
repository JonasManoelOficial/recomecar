import { SubscribeButton } from "./SubscribeButton";

export default async function PlanPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = searchParams ? await searchParams : {};
  const checkout = typeof sp.checkout === "string" ? sp.checkout : undefined;

  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Assinatura</h1>
        <p className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-300">
          O site inteiro é pago, mas cada conta começa com <strong>25 mensagens enviadas grátis</strong> para testar o chat.
          Depois disso, é preciso assinar.
        </p>
      </div>

      {checkout === "success" ? (
        <p className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-100">
          Pagamento iniciado com sucesso. Se o webhook estiver configurado, sua assinatura será ativada em instantes.
        </p>
      ) : null}

      {checkout === "cancel" ? (
        <p className="rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm text-zinc-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100">
          Checkout cancelado. Você pode tentar novamente quando quiser.
        </p>
      ) : null}

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-950">
        <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-50">Planos de assinatura</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-700 dark:text-zinc-200">
          <li>Semanal: R$ 6,90</li>
          <li>Mensal: R$ 19,90</li>
          <li>Anual: R$ 229,90</li>
          <li>Cobrança recorrente via Stripe (cartão).</li>
          <li>Webhook atualiza o status automaticamente após o pagamento.</li>
          <li>Escolha o plano e finalize no checkout seguro.</li>
        </ul>
        <div className="mt-5">
          <SubscribeButton />
        </div>
      </section>
    </div>
  );
}
