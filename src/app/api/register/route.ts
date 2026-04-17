import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1).max(80).optional(),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
    }

    const { email, password, name } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) {
      return NextResponse.json({ error: "E-mail já cadastrado." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name ?? email.split("@")[0],
        freeMessagesLeft: 25,
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Erro ao criar conta." }, { status: 500 });
  }
}
