import { Navigate, Route, Routes } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Sightings from './pages/Sightings.jsx';
import SightingForm from './pages/SightingForm.jsx';
import SightingDetail from './pages/SightingDetail.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/cadastro" element={<Register />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/avistamentos" element={<Sightings />} />
          <Route path="/avistamentos/novo" element={<SightingForm />} />
          <Route path="/avistamentos/:id" element={<SightingDetail />} />
          <Route path="/avistamentos/:id/editar" element={<SightingForm />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
