import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { useAuthStore } from '../store/authStore'


export default function AuthCallbackPage() {
  const navigate  = useNavigate()
  const setToken  = useAuthStore((s) => s.setToken)
  const setUser   = useAuthStore((s) => s.setUser)
  const called    = useRef(false)

  const code = new URLSearchParams(window.location.search).get('code')

  useEffect(() => {
  if (called.current) return
  called.current = true

  const params   = new URLSearchParams(window.location.search)
  const code     = params.get('code')
  const state    = params.get('state')
  const savedState = sessionStorage.getItem('oauth_state')

  // Validación de seguridad OAuth
  if (!code || !state || state !== savedState) {
    navigate('/?error=auth', { replace: true })
    return
  }

  sessionStorage.removeItem('oauth_state')

  api.post('/api/auth/github/callback', { code })
    .then((res) => {
      const { token, userId, username, avatarUrl, name } = res.data
      setToken(token)
      setUser({ id: userId, username, avatarUrl, name })
      navigate('/dashboard', { replace: true })
    })
    .catch(() => {
      navigate('/?error=auth', { replace: true })
    })
}, [])

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.25rem',
      background: 'var(--bg)',
      color: 'var(--text)'
    }}>
      <div style={{
        width: 40, height: 40,
        border: '3px solid var(--amber-dim2)',
        borderTop: '3px solid var(--amber)',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
        Verificando tu cuenta de GitHub...
      </p>
    </div>
  )

  
}