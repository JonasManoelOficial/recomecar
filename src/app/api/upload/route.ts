import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { auth } from "@/auth";
import { jsonNoStore } from "@/lib/jsonNoStore";
import { prisma } from "@/lib/prisma";
import { getUploadsDir } from "@/lib/uploadsDir";

export const dynamic = "force-dynamic";

const presetPhotos = new Set([
  "/avatars/avatar-1.svg",
  "/avatars/avatar-2.svg",
  "/avatars/avatar-3.svg",
  "/avatars/avatar-4.svg",
  "/avatars/avatar-5.svg",
  "/avatars/avatar-6.svg",
]);

const maxBytes = 5_000_000;

function sniffImage(buffer: Buffer): { ext: "jpg" | "png" | "gif" | "webp" } | { heif: true } | null {
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return { ext: "jpg" };
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return { ext: "png" };
  }
  if (buffer.length >= 6) {
    const sig = buffer.subarray(0, 6).toString("ascii");
    if (sig === "GIF87a" || sig === "GIF89a") return { ext: "gif" };
  }
  if (buffer.length >= 12) {
    // RIFF....WEBP
    const riff = buffer.subarray(0, 4).toString("ascii");
    const webp = buffer.subarray(8, 12).toString("ascii");
    if (riff === "RIFF" && webp === "WEBP") return { ext: "webp" };
  }
  // HEIC/HEIF (comum em iPhone): não dá para garantir preview web sem conversão server-side
  if (buffer.length >= 12) {
    const brand = buffer.subarray(4, 8).toString("ascii");
    if (brand === "ftyp") {
      const minor = buffer.subarray(8, 12).toString("ascii");
      if (minor.startsWith("heic") || minor.startsWith("heix") || minor.startsWith("hevc") || minor.startsWith("mif1")) {
        return { heif: true };
      }
    }
  }
  return null;
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return jsonNoStore({ error: "Não autenticado." }, { status: 401 });
  }

  try {
    const form = await req.formData();
    const presetPath = form.get("presetPath");
    if (typeof presetPath === "string" && presetPhotos.has(presetPath)) {
      await prisma.user.update({
        where: { id: session.user.id },
        data: { photoPath: presetPath },
      });
      return jsonNoStore({ photoPath: presetPath });
    }

    const file = form.get("file");

    if (!(file instanceof File)) {
      return jsonNoStore({ error: "Arquivo ausente." }, { status: 400 });
    }

    if (file.size > maxBytes) {
      return jsonNoStore(
        { error: `Imagem demasiado grande (${Math.round(file.size / 1024)}KB). Máximo ${Math.round(maxBytes / 1_000_000)}MB.` },
        { status: 400 },
      );
    }

    const uploadDir = getUploadsDir();
    await mkdir(uploadDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const sniffed = sniffImage(buffer);
    if (sniffed && "heif" in sniffed) {
      return jsonNoStore(
        {
          error:
            "Detectei HEIC/HEIF (iPhone). Para funcionar bem no site, mude a câmara para “Mais compatível” (JPEG) ou exporte a foto como JPEG/PNG e tente novamente.",
        },
        { status: 415 },
      );
    }

    const extFromMime =
      file.type === "image/png"
        ? ("png" as const)
        : file.type === "image/webp"
          ? ("webp" as const)
          : file.type === "image/gif"
            ? ("gif" as const)
            : file.type === "image/heic" || file.type === "image/heif"
              ? null
              : file.type === "image/jpeg" || file.type === "image/jpg"
                ? ("jpg" as const)
                : null;

    if (file.type === "image/heic" || file.type === "image/heif") {
      return jsonNoStore(
        {
          error:
            "HEIC/HEIF não é suportado diretamente. Exporte como JPEG/PNG (ou mude a câmara do iPhone para JPEG).",
        },
        { status: 415 },
      );
    }

    const ext = sniffed?.ext ?? extFromMime ?? (file.type.startsWith("image/") ? ("jpg" as const) : null);

    if (!ext) {
      return jsonNoStore(
        {
          error:
            "Não consegui reconhecer a imagem. No telemóvel, exporte como JPEG/PNG (evite HEIC se o browser não enviar o tipo correto).",
        },
        { status: 400 },
      );
    }

    const filename = `${session.user.id}.${ext}`;
    await writeFile(path.join(uploadDir, filename), buffer);

    const photoPath = `/api/photo/${filename}`;
    await prisma.user.update({
      where: { id: session.user.id },
      data: { photoPath },
    });

    return jsonNoStore({ photoPath });
  } catch (e: unknown) {
    const err = e as { code?: string; message?: string };
    if (err?.code === "EACCES" || err?.code === "EPERM") {
      return jsonNoStore(
        { error: "Sem permissão para gravar a imagem no servidor (pasta public/uploads)." },
        { status: 500 },
      );
    }
    if (err?.code === "ENOSPC") {
      return jsonNoStore({ error: "Disco cheio no servidor." }, { status: 507 });
    }
    return jsonNoStore(
      { error: `Falha ao guardar imagem. Detalhe: ${err?.message ?? "erro desconhecido"}` },
      { status: 500 },
    );
  }
}
