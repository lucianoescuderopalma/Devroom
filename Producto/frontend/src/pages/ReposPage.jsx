// src/pages/ReposPage.jsx
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

// ICONOS
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

const IcStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
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

const IcDown = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
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

const IcCode = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
)

// HELPERS UI
const pillClass = (tone) => {
  if (tone === 'green') return 'db-pill db-pill--green'
  if (tone === 'amber') return 'db-pill db-pill--amber'
  return 'db-pill db-pill--blue'
}

export default function ReposPage() {
  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [me, setMe] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState(null)

  const [search, setSearch] = useState('')
  const [languageFilter, setLanguageFilter] = useState('all')
  const [visibilityFilter, setVisibilityFilter] = useState('all')

  const load = async () => {
    try {
      setLoading(true)
      setError(null)

      const meRes = await api.get('/api/auth/me')
      const profile = meRes.data
      setMe(profile)

      const reposRes = await api.get(`/api/users/${profile.username}/repos`)
      setRepos(reposRes.data || [])
    } catch (err) {
      console.error(err)
      setError('No se pudieron cargar tus repositorios.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  const handleSync = async () => {
    try {
      setSyncing(true)
      setSyncMsg(null)
      const res = await api.post('/api/repos/sync')
      setSyncMsg(`✓ ${res.data.count ?? 0} repos sincronizados desde GitHub`)
      await load()
    } catch (e) {
      console.error(e)
      setSyncMsg('Error al sincronizar con GitHub')
    } finally {
      setSyncing(false)
    }
  }

  const languages = useMemo(() => {
    const set = new Set()
    repos.forEach((r) => {
      if (r.mainLanguage) set.add(r.mainLanguage)
    })
    return Array.from(set).sort()
  }, [repos])

  const publicCount = repos.filter((r) => !r.isPrivate).length
  const privateCount = repos.filter((r) => r.isPrivate).length

  const filteredRepos = useMemo(() => {
    let list = [...repos]

    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (r) =>
          r.name?.toLowerCase().includes(q) ||
          r.description?.toLowerCase().includes(q)
      )
    }

    if (languageFilter !== 'all') {
      list = list.filter((r) => r.mainLanguage === languageFilter)
    }

    if (visibilityFilter === 'public') {
      list = list.filter((r) => !r.isPrivate)
    } else if (visibilityFilter === 'private') {
      list = list.filter((r) => r.isPrivate)
    }

    list.sort((a, b) => (a.name || '').localeCompare(b.name || ''))

    return list
  }, [repos, search, languageFilter, visibilityFilter])

  const navItems = [
    { icon: <IcGrid />, label: 'Dashboard', to: '/dashboard', active: false },
    { icon: <IcGithub />, label: 'Repositorios', to: '/repositorios', active: true },
    { icon: <IcDoc />, label: 'Mi CV', to: '/cv', active: false },
    { icon: <IcBag />, label: 'Empleos', to: '/empleos', active: false },
    { icon: <IcUsers />, label: 'Red', to: '/red', active: false },
    { icon: <IcUser />, label: 'Perfil público', to: '/perfil', active: false },
  ]

  const initials = (me?.name || me?.username || 'LE').slice(0, 2).toUpperCase()

  return (
    <div className="db-wrap">
      {mobileOpen && <div className="db-overlay" onClick={() => setMobileOpen(false)} />}

      <aside className={`db-side ${mobileOpen ? 'db-side--open' : ''}`}>
        <div className="db-side-logo">
          <div className="db-side-logo-icon">{'</>'}</div>
          <div className="db-side-logo-txt">DevRoom</div>
        </div>

        <nav className="db-nav">
          {navItems.map((item) => (
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
          <div className="db-side-av">{initials}</div>
          <div className="db-side-profile-txt">
            <div className="db-side-name">{me?.name || 'Luciano E.'}</div>
            <div className="db-side-handle">
              @{me?.username || 'lescudero'} · {me?.location || 'Santiago'}
            </div>
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
              <span className="db-bc-cur">Repositorios</span>
            </div>
          </div>

          <div className="db-topbar-r">
            <button className="db-tbtn" onClick={handleSync} disabled={syncing}>
              <IcSync />
              <span>{syncing ? 'Sincronizando…' : 'Sincronizar con GitHub'}</span>
            </button>

            <button className="db-tbtn db-tbtn--primary" onClick={() => navigate('/dashboard')}>
              <IcGrid />
              <span>Volver al dashboard</span>
            </button>

            <div className="db-tbtn-ico">
              <IcBell />
              <span className="db-notif-dot" />
            </div>

            <div className="db-topbar-av">{initials}</div>
          </div>
        </header>

        {syncMsg && (
          <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', padding: '.4rem 1.5rem' }}>
            {syncMsg}
          </div>
        )}

        <section className="db-body">
          <div className="db-page-hd">
            <h1 className="db-page-title">Repositorios conectados</h1>
            <div className="db-page-meta">
              <span>{repos.length} repos totales</span>
              <span className="db-dot" />
              <span>{publicCount} públicos · {privateCount} privados</span>
              <span className="db-dot" />
              <span className="db-meta-hi">{languages.length} lenguajes detectados</span>
            </div>
          </div>

          {loading && (
            <div style={{ marginBottom: '1rem', fontSize: '.8rem', color: 'var(--text-muted)' }}>
              Cargando repositorios…
            </div>
          )}
          {error && (
            <div style={{ marginBottom: '1rem', fontSize: '.8rem', color: 'var(--amber)' }}>
              {error}
            </div>
          )}

          {/* KPIs sin commits */}
          <div className="db-kpis">
            <div className="db-kpi">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--amber"><IcGithub /></div>
                <span className="db-kpi-trend">Repos</span>
              </div>
              <div className="db-kpi-val">{repos.length}</div>
              <div className="db-kpi-lbl">Total conectados</div>
              <div className="db-kpi-sub">sincronizados desde GitHub</div>
            </div>

            <div className="db-kpi">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--blue"><IcCode /></div>
                <span className="db-kpi-trend">Lenguajes</span>
              </div>
              <div className="db-kpi-val">{languages.length}</div>
              <div className="db-kpi-lbl">Stacks detectados</div>
              <div className="db-kpi-sub">según repos conectados</div>
            </div>

            <div className="db-kpi">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--amber"><IcStar /></div>
                <span className="db-kpi-trend">Visibilidad</span>
              </div>
              <div className="db-kpi-val">{publicCount}</div>
              <div className="db-kpi-lbl">Repos públicos</div>
              <div className="db-kpi-sub">{privateCount} privados</div>
            </div>
          </div>

          <div className="db-grid">
            <div className="db-col">
              {/* Filtros */}
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title">
                    <IcCode /> Filtros
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr) minmax(0, 1.2fr)',
                    gap: '.75rem',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Buscar por nombre o descripción..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    style={{
                      padding: '.55rem .7rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface-2)',
                      color: 'var(--text)',
                      fontSize: '.8rem',
                    }}
                  />

                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value)}
                    style={{
                      padding: '.55rem .7rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface-2)',
                      color: 'var(--text)',
                      fontSize: '.8rem',
                    }}
                  >
                    <option value="all">Todos los lenguajes</option>
                    {languages.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang}
                      </option>
                    ))}
                  </select>

                  <select
                    value={visibilityFilter}
                    onChange={(e) => setVisibilityFilter(e.target.value)}
                    style={{
                      padding: '.55rem .7rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface-2)',
                      color: 'var(--text)',
                      fontSize: '.8rem',
                    }}
                  >
                    <option value="all">Todos (públicos/privados)</option>
                    <option value="public">Sólo públicos</option>
                    <option value="private">Sólo privados</option>
                  </select>
                </div>
              </div>

              {/* Tabla de repos (sin commits) */}
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title">
                    <IcGithub /> Lista de repositorios
                  </div>
                  <span className="db-pill db-pill--blue">
                    {filteredRepos.length} mostrados
                  </span>
                </div>

                <div className="db-tbl-wrap">
                  <table className="db-tbl">
                    <thead>
                      <tr>
                        <th>Repositorio</th>
                        <th>Lenguaje</th>
                        <th>Visibilidad</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRepos.map((r) => (
                        <tr key={r.id || r.name}>
                          <td>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '.1rem' }}>
                              <a
                                href={r.url}
                                target="_blank"
                                rel="noreferrer"
                                className="db-repo"
                              >
                                {r.name}
                              </a>
                              {r.description && (
                                <span
                                  className="db-tmuted"
                                  style={{ maxWidth: '380px', fontSize: '.72rem' }}
                                >
                                  {r.description}
                                </span>
                              )}
                            </div>
                          </td>
                          <td>
                            <span className="db-lang">
                              <span
                                className="db-lang-dot"
                                style={{ backgroundColor: '#38bdf8' }}
                              />
                              {r.mainLanguage || 'N/A'}
                            </span>
                          </td>
                          <td>
                            <span
                              className={pillClass(r.isPrivate ? 'amber' : 'green')}
                              style={{ fontSize: '.7rem' }}
                            >
                              {r.isPrivate ? 'Privado' : 'Público'}
                            </span>
                          </td>
                        </tr>
                      ))}

                      {!loading && !filteredRepos.length && (
                        <tr>
                          <td
                            colSpan={3}
                            className="db-tmuted"
                            style={{ textAlign: 'center', padding: '1.5rem 0' }}
                          >
                            No se encontraron repositorios con esos filtros.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Columna derecha: sólo resumen repos / tip */}
            <div className="db-col">
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title">
                    <IcUsers /> Resumen rápido
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '.75rem' }}>
                  <div
                    style={{
                      background: 'var(--surface-2)',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      padding: '1rem',
                    }}
                  >
                    <div style={{ fontSize: '.75rem', color: 'var(--text-faint)' }}>
                      Repos públicos
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.8rem',
                        fontWeight: 800,
                        letterSpacing: '-.03em',
                        marginTop: '.1rem',
                      }}
                    >
                      {publicCount}
                    </div>
                    <div
                      style={{
                        marginTop: '.3rem',
                        fontSize: '.75rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Visibles para CV y perfil público.
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--surface-2)',
                      borderRadius: '10px',
                      border: '1px solid var(--border)',
                      padding: '1rem',
                    }}
                  >
                    <div style={{ fontSize: '.75rem', color: 'var(--text-faint)' }}>
                      Tip
                    </div>
                    <div
                      style={{
                        marginTop: '.3rem',
                        fontSize: '.8rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.7,
                      }}
                    >
                      Prioriza 2–3 repos públicos sólidos (backend, frontend y
                      un proyecto personal) y mantén README y descripciones al día:
                      esto es lo que más verán recruiters y el resto de DevRoom.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}