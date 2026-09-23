import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import api, { errorMessage } from '../api.js';
import { useAuth } from '../auth.jsx';
import StatusBadge from '../components/StatusBadge.jsx';
import { fmtDateTime } from '../constants.js';

export default function SightingDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [s, setS] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/sightings/${id}`).then((r) => setS(r.data)).catch((e) => setError(errorMessage(e)));
  }, [id]);

  async function handleDelete() {
    if (!window.confirm('Excluir este avistamento? Esta ação não pode ser desfeita.')) return;
    try {
      await api.delete(`/sightings/${id}`);
      navigate('/avistamentos');
    } catch (err) {
      setError(errorMessage(err));
    }
  }

  if (error) return <p className="alert">{error} <Link to="/avistamentos">Voltar</Link></p>;
  if (!s) return <p className="center-note">Carregando…</p>;

  const canEdit = user.role === 'ADMIN' || s.user.id === user.id;

  return (
    <article className="card detail">
      <Link to="/avistamentos" className="back">Voltar para avistamentos</Link>
      <div className="sighting-top">
        <span className="tag">{s.creature}</span>
        <StatusBadge status={s.status} />
      </div>
      <h1>{s.title}</h1>
      <p className="muted">{s.location} · {fmtDateTime(s.sightedAt)} · relatado por {s.user.name}</p>
      <p className="detail-body">{s.description}</p>
      {canEdit && (
        <div className="actions">
          <Link to={`/avistamentos/${s.id}/editar`} className="btn">Editar</Link>
          <button className="btn btn-danger" onClick={handleDelete}>Excluir</button>
        </div>
      )}
    </article>
  );
}
