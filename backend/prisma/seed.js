import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) throw new Error('Defina ADMIN_EMAIL e ADMIN_PASSWORD no .env');

  const passwordHash = await bcrypt.hash(password, 10);
  const admin = await prisma.user.upsert({
    where: { email },
    update: { role: 'ADMIN' },
    create: { name: process.env.ADMIN_NAME || 'Administrador', email, passwordHash, role: 'ADMIN' },
  });

  const count = await prisma.sighting.count();
  if (count === 0) {
    const day = 24 * 60 * 60 * 1000;
    const now = Date.now();
    await prisma.sighting.createMany({
      data: [
        { title: 'Pegadas enormes perto do lago', description: 'Encontrei pegadas de quase 40 cm na margem do lago Pinheiral, na manhã seguinte à chuva.', creature: 'Pé Grande', location: 'Lago Pinheiral', sightedAt: new Date(now - 2 * day), status: 'CONFIRMADO', userId: admin.id },
        { title: 'Vulto alto entre as árvores', description: 'Vi uma silhueta com mais de dois metros caminhando na trilha atrás da escola.', creature: 'Pé Grande', location: 'Trilha da Escola', sightedAt: new Date(now - 5 * day), status: 'PENDENTE', userId: admin.id },
        { title: 'Luzes verdes sobre a floresta', description: 'Três luzes verdes pairaram por cerca de dez minutos sobre a Floresta Velha.', creature: 'Luzes misteriosas', location: 'Floresta Velha', sightedAt: new Date(now - 9 * day), status: 'PENDENTE', userId: admin.id },
        { title: 'Uivos perto da fazenda', description: 'Uivos muito graves durante a madrugada, os cães do vizinho ficaram muito agitados.', creature: 'Lobisomem', location: 'Fazenda Alvorada', sightedAt: new Date(now - 20 * day), status: 'DESCARTADO', userId: admin.id },
        { title: 'Criatura na represa', description: 'Algo grande e escuro deslizou na superfície da represa ao entardecer.', creature: 'Criatura aquática', location: 'Represa Norte', sightedAt: new Date(now - 35 * day), status: 'CONFIRMADO', userId: admin.id },
      ],
    });
  }
  console.log('Seed concluído. Admin:', email);
}

main().finally(() => prisma.$disconnect());
