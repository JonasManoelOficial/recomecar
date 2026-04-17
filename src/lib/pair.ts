/** Ordena dois ids para chave única de match (userA < userB). */
export function orderedPair(a: string, b: string): readonly [string, string] {
  return a < b ? ([a, b] as const) : ([b, a] as const);
}
