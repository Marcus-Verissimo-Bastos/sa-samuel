import { PrismaClient } from '@prisma/client';

// Reaproveita a instância em ambiente serverless/hot reload.
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.__prisma = prisma;
