/** Fotos enviadas (disco em `public/uploads`) — não passar pelo otimizador do `next/image`. */
export function isUserUpload(photoPath: string | null | undefined): boolean {
  if (!photoPath) return false;
  return photoPath.startsWith("/uploads/") || photoPath.startsWith("/api/photo/");
}

/**
 * Em produção o Nginx costuma expor `location /uploads` como pasta estática (vazia) → 404.
 * Servimos o binário via `/api/photo/:file` (cai no mesmo `proxy_pass` que o resto da app).
 */
export function resolvePhotoSrc(photoPath: string | null | undefined): string | null {
  if (!photoPath) return null;
  if (photoPath.startsWith("/uploads/")) {
    const name = photoPath.slice("/uploads/".length);
    if (!name || name.includes("/") || name.includes("..")) return null;
    return `/api/photo/${encodeURIComponent(name)}`;
  }
  return photoPath;
}

