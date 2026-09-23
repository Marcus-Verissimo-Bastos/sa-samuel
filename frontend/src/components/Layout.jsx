import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <NavLink to="/" className="brand">
            <span className="brand-mark" aria-hidden="true" />
            Little Ville
          </NavLink>
          <nav className="nav" aria-label="Principal">
            <NavLink to="/" end>Painel</NavLink>
            <NavLink to="/avistamentos">Avistamentos</NavLink>
          </nav>
          <div className="who">
            <span className="who-name">
              {user.name}
              {user.role === 'ADMIN' && <span className="badge badge-admin">Admin</span>}
            </span>
            <button className="btn btn-ghost-light" onClick={handleLogout}>Sair</button>
          </div>
        </div>
      </header>
      <main className="page">
        <Outlet />
      </main>
    </div>
  );
}
