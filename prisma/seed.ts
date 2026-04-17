import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash("senha123", 10);

  const demos = [
    { email: "ana@demo.br", name: "Ana", city: "São Paulo", bio: "Perfil de demonstração." },
    { email: "bruno@demo.br", name: "Bruno", city: "Curitiba", bio: "Perfil de demonstração." },
    { email: "carla@demo.br", name: "Carla", city: "Belo Horizonte", bio: "Perfil de demonstração." },
    { email: "diego@demo.br", name: "Diego", city: "Porto Alegre", bio: "Perfil de demonstração." },
    { email: "elisa@demo.br", name: "Elisa", city: "Brasília", bio: "Perfil de demonstração." },
  ];

  for (const d of demos) {
    await prisma.user.upsert({
      where: { email: d.email },
      update: {
        name: d.name,
        city: d.city,
        bio: d.bio,
        birthYear: 1994,
        passwordHash,
      },
      create: {
        email: d.email,
        name: d.name,
        city: d.city,
        bio: d.bio,
        birthYear: 1994,
        passwordHash,
        freeMessagesLeft: 25,
      },
    });
  }

  const ana = await prisma.user.findUniqueOrThrow({ where: { email: "ana@demo.br" } });
  const bruno = await prisma.user.findUniqueOrThrow({ where: { email: "bruno@demo.br" } });

  await prisma.swipe.upsert({
    where: {
      fromUserId_toUserId: { fromUserId: bruno.id, toUserId: ana.id },
    },
    update: { kind: "LIKE" },
    create: {
      fromUserId: bruno.id,
      toUserId: ana.id,
      kind: "LIKE",
    },
  });

  console.log("Seed ok. Contas demo: senha `senha123` para todos os e-mails @demo.br");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
