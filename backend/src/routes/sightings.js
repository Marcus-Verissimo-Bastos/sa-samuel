import { Router } from 'express';
import { prisma } from '../prisma.js';
import { auth } from '../middleware/auth.js';

const router = Router();
router.use(auth);

export const CREATURES = ['Pé Grande', 'Lobisomem', 'Criatura aquática', 'Luzes misteriosas', 'Chupa-cabra', 'Outro'];
const STATUSES = ['PENDENTE', 'CONFIRMADO', 'DESCARTADO'];

const include = { user: { select: { id: true, name: true } } };

function parseBody(body) {
  const title = String(body.title || '').trim();
  const description = String(body.description || '').trim();
  const creature = String(body.creature || '').trim();
  const location = String(body.location || '').trim();
  const sightedAt = new Date(body.sightedAt);

  if (title.length < 3) return { error: 'Dê um título com pelo menos 3 caracteres.' };
  if (description.length < 10) return { error: 'Descreva o que viu com pelo menos 10 caracteres.' };
  if (!CREATURES.includes(creature)) return { error: 'Escolha um tipo de criatura válido.' };
  if (location.length < 2) return { error: 'Informe onde aconteceu.' };
  if (Number.isNaN(sightedAt.getTime())) return { error: 'Informe uma data válida.' };
  if (sightedAt.getTime() > Date.now() + 60 * 1000) return { error: 'A data do avistamento não pode estar no futuro.' };

  return { data: { title, description, creature, location, sightedAt } };
}

const canEdit = (user, sighting) => user.role === 'ADMIN' || sighting.userId === user.id;

// LIST
router.get('/', async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 9));
    const { search, creature, status, mine } = req.query;

    const where = {};
    if (search) {
      where.OR = [
        { title: { contains: String(search), mode: 'insensitive' } },
        { description: { contains: String(search), mode: 'insensitive' } },
        { location: { contains: String(search), mode: 'insensitive' } },
      ];
    }
    if (creature) where.creature = String(creature);
    if (STATUSES.includes(status)) where.status = status;
    if (mine === 'true') where.userId = req.user.id;

    const [total, items] = await Promise.all([
      prisma.sighting.count({ where }),
      prisma.sighting.findMany({
        where,
        include,
        orderBy: { sightedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
    ]);

    res.json({ items, total, page, pages: Math.max(1, Math.ceil(total / limit)) });
  } catch (err) {
    next(err);
  }
});

// READ
router.get('/:id', async (req, res, next) => {
  try {
    const sighting = await prisma.sighting.findUnique({ where: { id: Number(req.params.id) || 0 }, include });
    if (!sighting) return res.status(404).json({ error: 'Avistamento não encontrado.' });
    res.json(sighting);
  } catch (err) {
    next(err);
  }
});

// CREATE
router.post('/', async (req, res, next) => {
  try {
    const { data, error } = parseBody(req.body);
    if (error) return res.status(400).json({ error });

    const sighting = await prisma.sighting.create({ data: { ...data, userId: req.user.id }, include });
    res.status(201).json(sighting);
  } catch (err) {
    next(err);
  }
});

// UPDATE
router.put('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id) || 0;
    const current = await prisma.sighting.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: 'Avistamento não encontrado.' });
    if (!canEdit(req.user, current)) return res.status(403).json({ error: 'Você só pode editar seus próprios avistamentos.' });

    const { data, error } = parseBody(req.body);
    if (error) return res.status(400).json({ error });

    // Apenas administradores alteram o status de verificação.
    if (req.user.role === 'ADMIN' && STATUSES.includes(req.body.status)) data.status = req.body.status;

    const sighting = await prisma.sighting.update({ where: { id }, data, include });
    res.json(sighting);
  } catch (err) {
    next(err);
  }
});

// DELETE
router.delete('/:id', async (req, res, next) => {
  try {
    const id = Number(req.params.id) || 0;
    const current = await prisma.sighting.findUnique({ where: { id } });
    if (!current) return res.status(404).json({ error: 'Avistamento não encontrado.' });
    if (!canEdit(req.user, current)) return res.status(403).json({ error: 'Você só pode excluir seus próprios avistamentos.' });

    await prisma.sighting.delete({ where: { id } });
    res.status(204).end();
  } catch (err) {
    next(err);
  }
});

export default router;
