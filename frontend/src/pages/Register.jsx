import { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import AuthShell from '../components/AuthShell.jsx';
import { useAuth } from '../auth.jsx';
import { errorMessage } from '../api.js';

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  if (user) return <Navigate to="/" replace />;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirm) return setError('As senhas não conferem.');
    setBusy(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell title="Criar conta" subtitle="Cadastre-se para registrar e acompanhar avistamentos.">
      <form onSubmit={handleSubmit} className="form">
        <label>
          Nome
          <input value={form.name} onChange={set('name')} required autoComplete="name" />
        </label>
        <label>
          E-mail
          <input type="email" value={form.email} onChange={set('email')} required autoComplete="email" />
        </label>
        <label>
          Senha
          <input type="password" value={form.password} onChange={set('password')} required minLength={6} autoComplete="new-password" />
        </label>
        <label>
          Confirmar senha
          <input type="password" value={form.confirm} onChange={set('confirm')} required autoComplete="new-password" />
        </label>
        {error && <p className="alert" role="alert">{error}</p>}
        <button className="btn btn-primary" disabled={busy}>{busy ? 'Criando…' : 'Criar conta'}</button>
      </form>
      <p className="muted">Já tem conta? <Link to="/login">Entrar</Link></p>
    </AuthShell>
  );
}
