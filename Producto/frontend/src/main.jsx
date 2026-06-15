import './styles/index.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

import LandingPage        from './pages/LandingPage'
import LoginPage          from './pages/LoginPage'
import AuthCallbackPage   from './pages/AuthCallbackPage'
import Dashboard          from './pages/Dashboard'
import PublicProfilePage  from './pages/PublicProfilePage'
import JobsPage           from './pages/JobsPage'
import NetworkPage        from './pages/NetworkPage'
import CvPage             from './pages/CvPage'
import ReposPage          from './pages/ReposPage'
import ProtectedRoute     from './components/ProtectedRoute'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>

        {/* Públicas */}
        <Route path="/"              element={<LandingPage />} />
        <Route path="/login"         element={<LoginPage />} />
        <Route path="/auth/callback" element={<AuthCallbackPage />} />

        {/* Privadas — redirigen a /login si no hay token */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard"    element={<Dashboard />} />
          <Route path="/perfil"       element={<PublicProfilePage />} />
          <Route path="/empleos"      element={<JobsPage />} />
          <Route path="/red"          element={<NetworkPage />} />
          <Route path="/cv"           element={<CvPage />} />
          <Route path="/repositorios" element={<ReposPage />} />
        </Route>

      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)