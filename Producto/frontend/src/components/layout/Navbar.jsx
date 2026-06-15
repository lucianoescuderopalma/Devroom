// src/components/layout/Navbar.jsx

import { Link, useNavigate } from 'react-router-dom'
import { useAuthStore } from '../../store/authStore'

export default function Navbar({
  showMarketingLinks = true,
  showLandingLink = false,
  showDashboardLink = true,
}) {
  const { token, user, logout } = useAuthStore()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <header className="navbar" data-testid="navbar">
      <Link to="/" className="navbar-logo" data-testid="navbar-logo">
        <span className="navbar-logo-icon">{'</>'}</span>
        <span>DevRoom</span>
      </Link>

      <nav>
        <ul className="navbar-links" data-testid="navbar-links">
          {showMarketingLinks && (
            <>
              <li><Link to="/">Funciones</Link></li>
              <li><Link to="/">Cómo funciona</Link></li>
              <li><Link to="/empleos">Empleos</Link></li>
            </>
          )}
          {showLandingLink && (
            <li><Link to="/">Inicio</Link></li>
          )}
        </ul>
      </nav>

      <div className="navbar-actions" data-testid="navbar-actions">
        {token ? (
          <>
            {showDashboardLink && (
              <Link to="/dashboard" className="btn-ghost" data-testid="btn-dashboard">
                Dashboard
              </Link>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              {user?.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.username}
                  data-testid="navbar-avatar-img"
                  style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid var(--amber-dim2)' }}
                />
              ) : (
                <div
                  data-testid="navbar-avatar-initials"
                  style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: 'var(--amber-dim)', border: '2px solid var(--amber-dim2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber)'
                  }}
                >
                  {user?.username?.slice(0, 2).toUpperCase() ?? 'DR'}
                </div>
              )}
              <span
                data-testid="navbar-username"
                style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}
              >
                @{user?.username}
              </span>
              <button className="btn-ghost" onClick={handleLogout} data-testid="btn-logout">
                Salir
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn-ghost" data-testid="btn-login">
              Iniciar sesión
            </Link>
            <Link to="/login" className="btn-primary" data-testid="btn-github-login">
              Entrar con GitHub
            </Link>
          </>
        )}
      </div>
    </header>
  )
}
