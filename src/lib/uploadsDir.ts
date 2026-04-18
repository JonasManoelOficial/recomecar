import path from "node:path";

/**
 * Pasta onde gravamos `public/uploads` em runtime.
 * Se o PM2 arrancar com `cwd` errado, defina `UPLOADS_ABSOLUTE_PATH=/var/www/recomecar/public/uploads` no `.env`.
 */
export function getUploadsDir(): string {
  const override = process.env.UPLOADS_ABSOLUTE_PATH?.trim();
  if (override) return path.resolve(override);
  return path.resolve(process.cwd(), "public", "uploads");
}
