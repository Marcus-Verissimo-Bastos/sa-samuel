import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api, { errorMessage } from '../api.js';
import StatusBadge from '../components/StatusBadge.jsx';
import { STATUS_LABEL, fmtDate } from '../constants.js';

const STATUS_COLOR = { CONFIRMADO: '#4f6f52', PENDENTE: '#e0a030', DESCARTADO: '#a9b0a5' };

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/dashboard').then((r) => setData(r.data)).catch((e) => setError(errorMessage(e)));
  }, []);

  if (error) return <p className="alert">{error}</p>;
  if (!data) return <p className="center-note">Carregando painel…</p>;

  const { totals, byCreature, byMonth, byStatus, byLocation, recent } = data;
  const statusData = byStatus.map((s) => ({ ...s, label: STATUS_LABEL[s.name] }));

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Painel da cidade</h1>
          <p className="muted">O que está acontecendo em Little Ville agora.</p>
        </div>
        <Link to="/avistamentos/novo" className="btn btn-primary">Registrar avistamento</Link>
      </div>

      <section className="stats" aria-label="Resumo">
        <Stat label="Avistamentos registrados" value={totals.total} />
        <Stat label="Nos últimos 7 dias" value={totals.lastWeek} accent />
        <Stat label="Confirmados" value={totals.confirmed} />
        <Stat label="Em análise" value={totals.pending} />
        <Stat label="Moradores cadastrados" value={totals.residents} />
      </section>

      <section className="grid-2">
        <div className="card">
          <h2>Avistamentos por mês</h2>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byMonth}>
                <CartesianGrid vertical={false} stroke="#e1e6dc" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={28} />
                <Tooltip cursor={{ fill: 'rgba(224,160,48,.12)' }} formatter={(v) => [v, 'Avistamentos']} />
                <Bar dataKey="total" fill="#e0a030" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2>Situação dos relatos</h2>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={statusData} dataKey="total" nameKey="label" innerRadius="55%" outerRadius="85%" paddingAngle={2}>
                  {statusData.map((s) => <Cell key={s.name} fill={STATUS_COLOR[s.name]} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="legend">
            {statusData.map((s) => (
              <li key={s.name}><i style={{ background: STATUS_COLOR[s.name] }} />{s.label} ({s.total})</li>
            ))}
          </ul>
        </div>

        <div className="card">
          <h2>Tipos de criatura</h2>
          <div className="chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byCreature} layout="vertical" margin={{ left: 8 }}>
                <XAxis type="number" allowDecimals={false} hide />
                <YAxis type="category" dataKey="name" width={120} tickLine={false} axisLine={false} />
                <Tooltip cursor={{ fill: 'rgba(79,111,82,.1)' }} formatter={(v) => [v, 'Avistamentos']} />
                <Bar dataKey="total" fill="#4f6f52" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <h2>Locais mais citados</h2>
          {byLocation.length === 0 ? (
            <p className="muted">Sem dados ainda.</p>
          ) : (
            <ol className="rank">
              {byLocation.map((l) => (
                <li key={l.name}><span>{l.name}</span><strong>{l.total}</strong></li>
              ))}
            </ol>
          )}
        </div>
      </section>

      <section className="card">
        <div className="card-head">
          <h2>Avistamentos recentes</h2>
          <Link to="/avistamentos">Ver todos</Link>
        </div>
        {recent.length === 0 ? (
          <p className="muted">Nenhum avistamento ainda. Seja o primeiro a registrar.</p>
        ) : (
          <ul className="recent">
            {recent.map((s) => (
              <li key={s.id}>
                <div>
                  <Link to={`/avistamentos/${s.id}`} className="recent-title">{s.title}</Link>
                  <p className="muted small">{s.creature} · {s.location} · {fmtDate(s.sightedAt)} · por {s.user.name}</p>
                </div>
                <StatusBadge status={s.status} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className={`stat ${accent ? 'stat-accent' : ''}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  );
}
