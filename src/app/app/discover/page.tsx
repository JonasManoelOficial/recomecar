import { SwipeDeck } from "./SwipeDeck";

export default function DiscoverPage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Descobrir</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Passe ou curta. Quando for mútuo, vocês conversam (com 25 mensagens grátis para testar).
        </p>
      </div>
      <SwipeDeck />
    </div>
  );
}
