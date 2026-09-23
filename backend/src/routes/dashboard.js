import { Router } from 'express';
import { prisma } from '../prisma.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

router.get('/', async (_req, res, next) => {
  try {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

    const [total, confirmed, pending, lastWeek, residents, byCreatureRaw, byLocationRaw, byStatusRaw, recent, sinceSix] =
      await Promise.all([
        prisma.sighting.count(),
        prisma.sighting.count({ where: { status: 'CONFIRMADO' } }),
        prisma.sighting.count({ where: { status: 'PENDENTE' } }),
        prisma.sighting.count({ where: { sightedAt: { gte: weekAgo } } }),
        prisma.user.count(),
        prisma.sighting.groupBy({ by: ['creature'], _count: { _all: true }, orderBy: { _count: { creature: 'desc' } } }),
        prisma.sighting.groupBy({ by: ['location'], _count: { _all: true }, orderBy: { _count: { location: 'desc' } }, take: 5 }),
        prisma.sighting.groupBy({ by: ['status'], _count: { _all: true } }),
        prisma.sighting.findMany({ orderBy: { sightedAt: 'desc' }, take: 5, include: { user: { select: { name: true } } } }),
        prisma.sighting.findMany({ where: { sightedAt: { gte: sixMonthsAgo } }, select: { sightedAt: true } }),
      ]);

    // Últimos 6 meses (inclui meses sem registros)
    const buckets = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, month: MONTHS[d.getMonth()], total: 0 });
    }
    for (const s of sinceSix) {
      const d = new Date(s.sightedAt);
      const b = buckets.find((x) => x.key === `${d.getFullYear()}-${d.getMonth()}`);
      if (b) b.total++;
    }

    res.json({
      totals: { total, confirmed, pending, lastWeek, residents },
      byCreature: byCreatureRaw.map((r) => ({ name: r.creature, total: r._count._all })),
      byLocation: byLocationRaw.map((r) => ({ name: r.location, total: r._count._all })),
      byStatus: byStatusRaw.map((r) => ({ name: r.status, total: r._count._all })),
      byMonth: buckets.map(({ month, total }) => ({ month, total })),
      recent,
    });
  } catch (err) {
    next(err);
  }
});

export default router;
