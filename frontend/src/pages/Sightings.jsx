import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errorMessage } from '../api.js';
import { useAuth } from '../auth.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { CREATURES, STATUS_LABEL, fmtDate } from '../constants.js';

export default function Sightings() {
  const { user } = useAuth();
  const [filters, setFilters] = useState({ search: '', creature: '', status: '', mine: false });
  const [page, setPage] = useState(1);
  const [result, setResult] = useState({ items: [], total: 0, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const params = { page, limit: 9 };
      if (filters.search) params.search = filters.search;
      if (filters.creature) params.creature = filters.creature;
      if (filters.status) params.status = filters.status;
      if (filters.mine) params.mine = true;
      const { data } = await api.get('/sightings', { params });
      setResult(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  // Pequeno atraso para não consultar a API a cada tecla digitada
  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const setFilter = (k, v) => {
    setPage(1);
    setFilters((f) => ({ ...f, [k]: v }));
  };

  async function handleDelete(s) {
    if (!window.confirm(`Excluir o avistamento "${s.title}"? Esta ação não pode ser desfeita.`)) return;
    try {
      await api.delete(`/sightings/${s.id}`);
      if (result.items.length === 1 && page > 1) setPage(page - 1);
      else load();
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  const canEdit = (s) => user.role === 'ADMIN' || s.user.id === user.id;

  return (
    <>
      <div className="page-head">
        <div>
          <h1>Avistamentos</h1>
          <p className="muted">{result.total} {result.total === 1 ? 'registro' : 'registros'}</p>
        </div>
        <Link to="/avistamentos/novo" className="btn btn-primary">Registrar avistamento</Link>
      </div>

      <div className="filters">
        <input type="search" placeholder="Buscar por título, local ou descrição" value={filters.search} onChange={(e) => setFilter('search', e.target.value)} aria-label="Buscar" />
        <select value={filters.creature} onChange={(e) => setFilter('creature', e.target.value)} aria-label="Tipo de criatura">
          <option value="">Todas as criaturas</option>
          {CREATURES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={filters.status} onChange={(e) => setFilter('status', e.target.value)} aria-label="Situação">
          <option value="">Todas as situações</option>
          {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
        </select>
        <label className="check">
          <input type="checkbox" checked={filters.mine} onChange={(e) => setFilter('mine', e.target.checked)} />
          Só os meus
        </label>
      </div>

      {error && <p className="alert" role="alert">{error}</p>}

      {loading && result.items.length === 0 ? (
        <p className="center-note">Carregando…</p>
      ) : result.items.length === 0 ? (
        <div className="empty">
          <p>Nenhum avistamento encontrado com esses filtros.</p>
          <Link to="/avistamentos/novo" className="btn btn-primary">Registrar o primeiro</Link>
        </div>
      ) : (
        <div className="cards">
          {result.items.map((s) => (
            <article key={s.id} className="card sighting">
              <div className="sighting-top">
                <span className="tag">{s.creature}</span>
                <StatusBadge status={s.status} />
              </div>
              <h3><Link to={`/avistamentos/${s.id}`}>{s.title}</Link></h3>
              <p className="clamp">{s.description}</p>
              <p className="muted small">{s.location} · {fmtDate(s.sightedAt)}<br />por {s.user.name}</p>
              {canEdit(s) && (
                <div className="actions">
                  <Link to={`/avistamentos/${s.id}/editar`} className="btn btn-small">Editar</Link>
                  <button className="btn btn-small btn-danger" onClick={() => handleDelete(s)}>Excluir</button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {result.pages > 1 && (
        <nav className="pager" aria-label="Paginação">
          <button className="btn btn-small" disabled={page <= 1} onClick={() => setPage(page - 1)}>Anterior</button>
          <span>Página {page} de {result.pages}</span>
          <button className="btn btn-small" disabled={page >= result.pages} onClick={() => setPage(page + 1)}>Próxima</button>
        </nav>
      )}
    </>
  );
}
