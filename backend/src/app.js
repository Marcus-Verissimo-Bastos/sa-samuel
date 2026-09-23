import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/auth.js';
import sightingRoutes, { CREATURES } from './routes/sightings.js';
import dashboardRoutes from './routes/dashboard.js';

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET não definido. Configure o arquivo .env.');
}

const app = express();

const origins = (process.env.CORS_ORIGIN || 'http://localhost:5173').split(',').map((o) => o.trim());
app.use(helmet());
app.use(cors({ origin: origins }));
app.use(express.json({ limit: '100kb' }));

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));
app.get('/api/creatures', (_req, res) => res.json(CREATURES));

app.use('/api/auth', authRoutes);
app.use('/api/sightings', sightingRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((_req, res) => res.status(404).json({ error: 'Rota não encontrada.' }));

// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Erro interno do servidor.' });
});

export default app;
