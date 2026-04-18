import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { getUploadsDir } from "@/lib/uploadsDir";

export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
};

const ALLOWED_EXT = new Set(["jpg", "jpeg", "png", "gif", "webp"]);

/** Nome "id.ext" (ex.: cuid + extensão) — sem path traversal. */
function safeUploadBasename(raw: string): string | null {
  const decoded = decodeURIComponent(raw);
  const base = path.basename(decoded);
  if (base !== decoded) return null;
  if (base.includes("..")) return null;
  const dot = base.lastIndexOf(".");
  if (dot <= 0 || dot === base.length - 1) return null;
  const ext = base.slice(dot + 1).toLowerCase();
  if (!ALLOWED_EXT.has(ext)) return null;
  const stem = base.slice(0, dot);
  if (stem.length < 8 || stem.length > 64) return null;
  if (!/^[a-z0-9_-]+$/i.test(stem)) return null;
  return base;
}

export async function GET(_req: Request, ctx: { params: Promise<{ file: string }> }) {
  const { file: raw } = await ctx.params;
  const file = safeUploadBasename(raw);
  if (!file) {
    return new NextResponse(null, { status: 400 });
  }

  const ext = file.split(".").pop()?.toLowerCase() ?? "";
  const contentType = MIME[ext] ?? "application/octet-stream";
  const uploadsRoot = path.resolve(getUploadsDir());
  const diskPath = path.resolve(uploadsRoot, file);
  if (diskPath !== uploadsRoot && !diskPath.startsWith(uploadsRoot + path.sep)) {
    return new NextResponse(null, { status: 400 });
  }

  try {
    const buf = await readFile(diskPath);
    return new NextResponse(buf, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=120, stale-while-revalidate=60",
      },
    });
  } catch {
    return new NextResponse(null, { status: 404 });
  }
}
