import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

// ─── ICONOS ─────────────────────────────────────────────────────────────────
const IcGrid = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="14" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="14" width="7" height="7" rx="1" />
    <rect x="14" y="14" width="7" height="7" rx="1" />
  </svg>
)
const IcGithub = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)
const IcDoc = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
)
const IcBag = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
  </svg>
)
const IcUsers = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
)
const IcUser = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
)
const IcBell = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
  </svg>
)
const IcSync = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
)
const IcChevR = () => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M9 18l6-6-6-6" />
  </svg>
)
const IcMenu = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
)
const IcLink = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07L11.8 5" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07L12.2 19" />
  </svg>
)
const IcActivity = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)
const IcUserPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
)

// ─── HELPERS ────────────────────────────────────────────────────────────────
function relativeTime(isoDate) {
  if (!isoDate) return ''
  const diff = Date.now() - new Date(isoDate).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'ahora'
  if (mins < 60) return `hace ${mins} min`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `hace ${hrs} h`
  return `hace ${Math.floor(hrs / 24)} d`
}

function getInitials(name, username) {
  if (name?.trim()) {
    return name.trim().split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase()
  }
  return (username || '??').slice(0, 2).toUpperCase()
}

function feedTypeLabel(type) {
  const map = {
    REPO_SYNC: 'sincronizó repositorios',
    FOLLOW: 'empezó a seguir a alguien',
    JOB_APPLY: 'postuló a un empleo',
    CV_GENERATED: 'generó su CV con IA',
  }
  return map[type] || type
}

// ─── COMPONENTE PRINCIPAL ───────────────────────────────────────────────────
export default function NetworkPage() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [tab, setTab] = useState('following') // 'following' | 'followers' | 'feed'

  const [me, setMe] = useState(null)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [feed, setFeed] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)

        const meRes = await api.get('/api/auth/me')
        const profile = meRes.data
        setMe(profile)

        const [followersRes, followingRes, feedRes] = await Promise.all([
          api.get(`/api/users/${profile.username}/followers`),
          api.get(`/api/users/${profile.username}/following`),
          api.get('/api/feed?page=0&size=20'),
        ])

        setFollowers(followersRes.data || [])
        setFollowing(followingRes.data || [])
        setFeed(feedRes.data || [])
      } catch (err) {
        setError('No se pudo cargar la red. Revisa tu conexión.')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const handleToggleFollow = useCallback(async (user) => {
    if (!me) return
    try {
      if (user.isFollowing) {
        await api.delete(`/api/users/${user.username}/follow`)
      } else {
        await api.post(`/api/users/${user.username}/follow`)
      }
      // Actualizar estado local sin refetch
      const update = (list) =>
        list.map(u =>
          u.username === user.username
            ? { ...u, isFollowing: !u.isFollowing }
            : u
        )
      setFollowers(f => update(f))
      setFollowing(f => update(f))
    } catch (err) {
      console.error('Error al cambiar follow', err)
    }
  }, [me])

  const myInitials = getInitials(me?.name, me?.username)

  const NAV = [
    { icon: <IcGrid />, label: 'Dashboard', to: '/dashboard', active: false },
    { icon: <IcGithub />, label: 'Repositorios', to: '/repositorios', active: false },
    { icon: <IcDoc />, label: 'Mi CV', to: '/cv', active: false },
    { icon: <IcBag />, label: 'Empleos', to: '/empleos', active: false },
    { icon: <IcUsers />, label: 'Red', to: '/red', active: true },
    { icon: <IcUser />, label: 'Perfil público', to: '/perfil', active: false },
  ]

  const listToShow = tab === 'followers' ? followers : following

  return (
    <div className="db-wrap">
      {mobileOpen && <div className="db-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`db-side ${mobileOpen ? 'db-side--open' : ''}`}>
        <div className="db-side-logo">
          <div className="db-side-logo-icon">{'</>'}</div>
          <div className="db-side-logo-txt">DevRoom</div>
        </div>
        <nav className="db-nav">
          {NAV.map((item) => (
            <button
              key={item.label}
              className={`db-nav-item ${item.active ? 'db-nav-item--on' : ''}`}
              onClick={() => item.to && navigate(item.to)}
            >
              <span className="db-nav-ico">{item.icon}</span>
              <span className="db-nav-lbl">{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="db-side-profile">
          <div className="db-side-av">{myInitials}</div>
          <div className="db-side-profile-txt">
            <div className="db-side-name">{me?.name?.split(' ')[0] ?? 'Cargando…'}</div>
            <div className="db-side-handle">@{me?.username ?? '…'}</div>
          </div>
        </div>
      </aside>

      <main className="db-main">
        <header className="db-topbar">
          <div className="db-topbar-l">
            <button className="db-topbar-menu" onClick={() => setMobileOpen(true)}>
              <IcMenu />
            </button>
            <div className="db-breadcrumb">
              <span className="db-bc-root">DevRoom</span>
              <IcChevR />
              <span className="db-bc-cur">Red</span>
            </div>
          </div>
          <div className="db-topbar-r">
            <button className="db-tbtn">
              <IcSync />
              <span>Sincronizar</span>
            </button>
            <div className="db-tbtn-ico">
              <IcBell />
              <span className="db-notif-dot" />
            </div>
            <div className="db-topbar-av">{myInitials}</div>
          </div>
        </header>

        <section className="db-body">
          <div className="db-page-hd">
            <h1 className="db-page-title">Mi Red</h1>
            <div className="db-page-meta">
              <span>{following.length} siguiendo</span>
              <span className="db-dot" />
              <span className="db-meta-hi">{followers.length} seguidores</span>
            </div>
          </div>

          {loading && (
            <div style={{ marginBottom: '1rem', fontSize: '.8rem', color: 'var(--text-muted)' }}>
              Cargando tu red…
            </div>
          )}
          {error && (
            <div style={{ marginBottom: '1rem', fontSize: '.8rem', color: 'var(--amber)' }}>
              {error}
            </div>
          )}

          {/* KPIs */}
          <div className="db-kpis">
            <div className="db-kpi">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--blue"><IcUsers /></div>
                <span className="db-kpi-trend">+{followers.length}</span>
              </div>
              <div className="db-kpi-val">{followers.length}</div>
              <div className="db-kpi-lbl">Seguidores</div>
              <div className="db-kpi-sub">en tu perfil DevRoom</div>
            </div>
            <div className="db-kpi">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--green"><IcUserPlus /></div>
                <span className="db-kpi-trend">+{following.length}</span>
              </div>
              <div className="db-kpi-val">{following.length}</div>
              <div className="db-kpi-lbl">Siguiendo</div>
              <div className="db-kpi-sub">desarrolladores activos</div>
            </div>
            <div className="db-kpi">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--amber"><IcActivity /></div>
                <span className="db-kpi-trend">{feed.length} eventos</span>
              </div>
              <div className="db-kpi-val">{feed.length}</div>
              <div className="db-kpi-lbl">Actividad</div>
              <div className="db-kpi-sub">en tu feed reciente</div>
            </div>
            <div className="db-kpi">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--blue"><IcLink /></div>
                <span className="db-kpi-trend">activo</span>
              </div>
              <div className="db-kpi-val">
                {me?.username ? `@${me.username}` : '—'}
              </div>
              <div className="db-kpi-lbl">Handle público</div>
              <div className="db-kpi-sub">devroom.app/@{me?.username ?? '…'}</div>
            </div>
          </div>

          <div className="db-grid">
            {/* Columna izquierda: seguidores / siguiendo con tabs */}
            <div className="db-col">
              <div className="db-card">
                <div className="db-card-hd">
                  {/* Tabs */}
                  <div style={{ display: 'flex', gap: '.5rem' }}>
                    {['following', 'followers'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        style={{
                          background: tab === t ? 'var(--surface-3)' : 'transparent',
                          border: '1px solid',
                          borderColor: tab === t ? 'var(--border-hi)' : 'var(--border)',
                          borderRadius: '8px',
                          padding: '.3rem .75rem',
                          fontSize: '.78rem',
                          color: tab === t ? 'var(--text)' : 'var(--text-faint)',
                          cursor: 'pointer',
                        }}
                      >
                        {t === 'following' ? `Siguiendo (${following.length})` : `Seguidores (${followers.length})`}
                      </button>
                    ))}
                  </div>
                </div>

                {listToShow.length === 0 && !loading ? (
                  <p style={{ fontSize: '.82rem', color: 'var(--text-faint)', padding: '.5rem 0' }}>
                    {tab === 'followers'
                      ? 'Aún no tienes seguidores.'
                      : 'Aún no sigues a nadie.'}
                  </p>
                ) : (
                  <div className="db-jobs">
                    {listToShow.map((user) => {
                      const initials = getInitials(user.name, user.username)
                      return (
                        <div className="db-job" key={user.username}>
                          {user.avatarUrl ? (
                            <img
                              src={user.avatarUrl}
                              alt={user.username}
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: '9999px',
                                objectFit: 'cover',
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              className="db-job-logo"
                              style={{
                                background: 'linear-gradient(135deg,#f59e0b,#10b981)',
                                color: '#1e2330',
                                fontWeight: 700,
                              }}
                            >
                              {initials}
                            </div>
                          )}

                          <div className="db-job-info">
                            <div className="db-job-title">{user.name || user.username}</div>
                            <div className="db-job-meta">
                              <span>@{user.username}</span>
                              {user.role && (
                                <>
                                  <span className="db-dot" />
                                  <span>{user.role}</span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="db-job-r">
                            <button
                              className={user.isFollowing ? 'db-pill db-pill--green' : 'db-pill db-pill--blue'}
                              style={{ cursor: 'pointer', border: 'none' }}
                              onClick={() => handleToggleFollow(user)}
                            >
                              {user.isFollowing ? 'Siguiendo' : '+ Seguir'}
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Columna derecha: feed de actividad */}
            <div className="db-col">
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title">
                    <IcActivity /> Feed de actividad
                  </div>
                  <button
                    className="db-card-link"
                    onClick={() => setTab('feed')}
                  >
                    Ver todo <IcChevR />
                  </button>
                </div>

                {feed.length === 0 && !loading ? (
                  <p style={{ fontSize: '.82rem', color: 'var(--text-faint)', padding: '.5rem 0' }}>
                    Tu feed está vacío. Sigue a otros developers para ver su actividad.
                  </p>
                ) : (
                  <div className="db-jobs">
                    {feed.slice(0, 10).map((event) => {
                      const initials = getInitials(null, event.actorUsername)
                      return (
                        <div className="db-job" key={event.id}>
                          {event.actorAvatarUrl ? (
                            <img
                              src={event.actorAvatarUrl}
                              alt={event.actorUsername}
                              style={{
                                width: 34,
                                height: 34,
                                borderRadius: '9999px',
                                objectFit: 'cover',
                                flexShrink: 0,
                              }}
                            />
                          ) : (
                            <div
                              className="db-job-logo"
                              style={{
                                background: 'var(--surface-3)',
                                color: 'var(--text-muted)',
                                fontSize: '.75rem',
                              }}
                            >
                              {initials}
                            </div>
                          )}

                          <div className="db-job-info">
                            <div className="db-job-title">
                              <span style={{ color: 'var(--text)' }}>@{event.actorUsername}</span>
                              {' '}
                              <span style={{ color: 'var(--text-muted)', fontWeight: 400 }}>
                                {feedTypeLabel(event.type)}
                              </span>
                            </div>
                            {event.content && (
                              <div
                                className="db-job-meta"
                                style={{ marginTop: '.2rem', fontSize: '.78rem' }}
                              >
                                {event.content}
                              </div>
                            )}
                          </div>

                          <div className="db-job-r" style={{ fontSize: '.72rem', color: 'var(--text-faint)', whiteSpace: 'nowrap' }}>
                            {relativeTime(event.createdAt)}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}