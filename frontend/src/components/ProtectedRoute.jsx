import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth.jsx';

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <p className="center-note">Carregando…</p>;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;
  return <Outlet />;
}
