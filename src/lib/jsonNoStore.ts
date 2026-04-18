import { NextResponse } from "next/server";

/** Respostas JSON que não devem ser cacheadas (browser / CDN / Data Cache). */
export function jsonNoStore(body: unknown, init?: ResponseInit) {
  const res = NextResponse.json(body, init);
  res.headers.set("Cache-Control", "private, no-store, must-revalidate");
  return res;
}
