import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { PublicPortfolioPage } from './pages/public/PublicPortfolioPage'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage'
import { ProtectedRoute } from './components/admin/ProtectedRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Vista Pública Principal */}
        <Route path="/" element={<PublicPortfolioPage />} />

        {/* Panel de Administración (CMS) */}
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboardPage />
            </ProtectedRoute>
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Rutas no reconocidas */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
