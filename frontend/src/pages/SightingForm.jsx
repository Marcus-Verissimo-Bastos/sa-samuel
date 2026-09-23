import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api.js';
import { useAuth } from '../auth.jsx';
import { CREATURES, STATUS_LABEL, toInputValue } from '../constants.js';

export default function SightingForm() {
  const { id } = useParams();
  const editing = !!id;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', creature: CREATURES[0], location: '', sightedAt: toInputValue(), status: 'PENDENTE' });
  const [loading, setLoading] = useState(editing);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!editing) return;
    api
      .get(`/sightings/${id}`)
      .then(({ data }) => {
        if (user.role !== 'ADMIN' && data.userId !== user.id && data.user.id !== user.id) {
          return navigate('/avistamentos', { replace: true });
        }
        setForm({ title: data.title, description: data.description, creature: data.creature, location: data.location, sightedAt: toInputValue(data.sightedAt), status: data.status });
      })
      .catch((e) => setError(errorMessage(e)))
      .finally(() => setLoading(false));
  }, [id, editing, user, navigate]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setBusy(true);
    const payload = { ...form, sightedAt: new Date(form.sightedAt).toISOString() };
    try {
      const { data } = editing ? await api.put(`/sightings/${id}`, payload) : await api.post('/sightings', payload);
      navigate(`/avistamentos/${data.id}`);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  if (loading) return <p className="center-note">Carregando…</p>;

  return (
    <>
      <div className="page-head">
        <h1>{editing ? 'Editar avistamento' : 'Registrar avistamento'}</h1>
      </div>
      <form onSubmit={handleSubmit} className="form card form-wide">
        <label>
          Título
          <input value={form.title} onChange={set('title')} required minLength={3} maxLength={120} placeholder="Ex.: Pegadas perto do lago" />
        </label>
        <div className="row">
          <label>
            Tipo de criatura
            <select value={form.creature} onChange={set('creature')}>
              {CREATURES.map((c) => <option key={c}>{c}</option>)}
            </select>
          </label>
          <label>
            Data e hora
            <input type="datetime-local" value={form.sightedAt} max={toInputValue()} onChange={set('sightedAt')} required />
          </label>
        </div>
        <label>
          Local
          <input value={form.location} onChange={set('location')} required maxLength={120} placeholder="Ex.: Trilha atrás da escola" />
        </label>
        <label>
          O que você viu?
          <textarea rows={6} value={form.description} onChange={set('description')} required minLength={10} placeholder="Descreva tamanho, cor, sons, quanto tempo durou…" />
        </label>
        {editing && user.role === 'ADMIN' && (
          <label>
            Situação
            <select value={form.status} onChange={set('status')}>
              {Object.entries(STATUS_LABEL).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </label>
        )}
        {error && <p className="alert" role="alert">{error}</p>}
        <div className="actions">
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Salvando…' : editing ? 'Salvar alterações' : 'Registrar avistamento'}</button>
          <Link to={editing ? `/avistamentos/${id}` : '/avistamentos'} className="btn">Cancelar</Link>
        </div>
      </form>
    </>
  );
}
