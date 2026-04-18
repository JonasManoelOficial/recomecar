import { NextResponse } from "next/server";
import { writeFile, mkdir } from "node:fs/promises";
import path from "node:path";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const presetPhotos = new Set([
  "/avatars/avatar-1.svg",
  "/avatars/avatar-2.svg",
  "/avatars/avatar-3.svg",
  "/avatars/avatar-4.svg",
  "/avatars/avatar-5.svg",
  "/avatars/avatar-6.svg",
]);

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const form = await req.formData();
  const presetPath = form.get("presetPath");
  if (typeof presetPath === "string" && presetPhotos.has(presetPath)) {
    await prisma.user.update({
      where: { id: session.user.id },
      data: { photoPath: presetPath },
    });
    return NextResponse.json({ photoPath: presetPath });
  }

  const file = form.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Arquivo ausente." }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Envie uma imagem." }, { status: 400 });
  }

  if (file.size > 2_000_000) {
    return NextResponse.json({ error: "Imagem até 2MB." }, { status: 400 });
  }

  const ext = file.type === "image/png" ? "png" : "jpg";
  const filename = `${session.user.id}.${ext}`;
  const uploadDir = path.join(process.cwd(), "public", "uploads");
  await mkdir(uploadDir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(uploadDir, filename), buffer);

  const photoPath = `/uploads/${filename}`;
  await prisma.user.update({
    where: { id: session.user.id },
    data: { photoPath },
  });

  return NextResponse.json({ photoPath });
}
