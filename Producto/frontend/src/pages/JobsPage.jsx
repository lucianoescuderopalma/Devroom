// src/pages/JobsPage.jsx
import { useState, useEffect } from 'react'
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

const IcFilter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
)

const IcPin = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 21s-6-4.35-6-10a6 6 0 1 1 12 0c0 5.65-6 10-6 10z" />
    <circle cx="12" cy="11" r="2" />
  </svg>
)

const badgeClass = (active) =>
  active ? 'db-badge db-badge--high' : 'db-badge db-badge--low'

export default function JobsPage() {
  const navigate = useNavigate()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const [modality, setModality] = useState('all')
  const [search, setSearch] = useState('')

  const loadJobs = async () => {
    try {
      setLoading(true)
      setError(null)

      const params = {}
      if (modality !== 'all') params.modality = modality
      if (search.trim()) params.search = search.trim()

      const res = await api.get('/api/jobs', { params })
      setJobs(res.data || [])
    } catch (e) {
      console.error(e)
      setError('No se pudieron cargar las ofertas de empleo.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadJobs()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const totalJobs = jobs.length
  const activeJobs = jobs.filter((j) => j.isActive).length
  const remoteJobs = jobs.filter(
    (j) => j.modality && j.modality.toLowerCase().includes('remoto'),
  ).length

  const NAV = [
    { icon: <IcGrid />, label: 'Dashboard', to: '/dashboard', active: false },
    { icon: <IcGithub />, label: 'Repositorios', to: '/repositorios', active: false },
    { icon: <IcDoc />, label: 'Mi CV', to: '/cv', active: false },
    { icon: <IcBag />, label: 'Empleos', to: '/empleos', active: true },
    { icon: <IcUsers />, label: 'Red', to: '/red', active: false },
    { icon: <IcUser />, label: 'Perfil público', to: '/perfil', active: false },
  ]

  const initials = 'LE'

  const filteredJobs = jobs // ya filtramos por backend con params; si quisieras, aquí puedes filtrar más

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
          <div className="db-side-av">{initials}</div>
          <div className="db-side-profile-txt">
            <div className="db-side-name">Luciano E.</div>
            <div className="db-side-handle">@lescudero · Santiago</div>
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
              <span className="db-bc-cur">Empleos</span>
            </div>
          </div>

          <div className="db-topbar-r">
            <button className="db-tbtn">
              <IcFilter />
              <span>Filtros</span>
            </button>

            <button className="db-tbtn" onClick={loadJobs}>
              <IcSync />
              <span>Actualizar</span>
            </button>

            <div className="db-tbtn-ico">
              <IcBell />
              <span className="db-notif-dot" />
            </div>

            <div className="db-topbar-av">{initials}</div>
          </div>
        </header>

        <section className="db-body">
          <div className="db-page-hd">
            <h1 className="db-page-title">Empleos recomendados</h1>
            <div className="db-page-meta">
              <span>Vacantes alineadas con tu stack y actividad reciente</span>
              <span className="db-dot" />
              <span className="db-meta-hi">
                {totalJobs} oportunidades activas
              </span>
            </div>
          </div>

          {loading && (
            <div style={{ marginBottom: '1rem', fontSize: '.8rem', color: 'var(--text-muted)' }}>
              Cargando ofertas…
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
                <div className="db-kpi-ico db-kpi-ico--amber">
                  <IcBag />
                </div>
                <span className="db-kpi-trend">
                  {totalJobs > 0 ? 'Nuevas hoy' : 'Sin datos'}
                </span>
              </div>
              <div className="db-kpi-val">{totalJobs}</div>
              <div className="db-kpi-lbl">Empleos compatibles</div>
              <div className="db-kpi-sub">según filtros actuales</div>
            </div>

            <div className="db-kpi">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--green">
                  <IcStar />
                </div>
                <span className="db-kpi-trend">Activos</span>
              </div>
              <div className="db-kpi-val">{activeJobs}</div>
              <div className="db-kpi-lbl">Ofertas activas</div>
              <div className="db-kpi-sub">según backend (isActive)</div>
            </div>

            <div className="db-kpi">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--blue">
                  <IcDoc />
                </div>
                <span className="db-kpi-trend">Remoto</span>
              </div>
              <div className="db-kpi-val">{remoteJobs}</div>
              <div className="db-kpi-lbl">Vacantes remotas</div>
              <div className="db-kpi-sub">con modalidad tipo remoto</div>
            </div>

            <div className="db-kpi">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--amber">
                  <IcUsers />
                </div>
                <span className="db-kpi-trend">Postulaciones</span>
              </div>
              <div className="db-kpi-val">0</div>
              <div className="db-kpi-lbl">Integración futura</div>
              <div className="db-kpi-sub">flujo de aplicar aún pendiente</div>
            </div>
          </div>

          <div className="db-grid">
            <div className="db-col">
              {/* Filtros */}
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title">
                    <IcFilter /> Filtros
                  </div>
                </div>

                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'minmax(0, 2fr) minmax(0, 1.2fr)',
                    gap: '.75rem',
                  }}
                >
                  <input
                    type="text"
                    placeholder="Buscar por título o empresa..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') loadJobs()
                    }}
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
                    value={modality}
                    onChange={(e) => setModality(e.target.value)}
                    style={{
                      padding: '.55rem .7rem',
                      borderRadius: '8px',
                      border: '1px solid var(--border)',
                      background: 'var(--surface-2)',
                      color: 'var(--text)',
                      fontSize: '.8rem',
                    }}
                  >
                    <option value="all">Todas las modalidades</option>
                    <option value="Remoto">Remoto</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Presencial">Presencial</option>
                  </select>
                </div>

                <div style={{ marginTop: '.75rem', textAlign: 'right' }}>
                  <button
                    className="db-tbtn"
                    type="button"
                    onClick={loadJobs}
                    style={{ fontSize: '.78rem', paddingInline: '.9rem' }}
                  >
                    <IcSync />
                    <span>Aplicar filtros</span>
                  </button>
                </div>
              </div>

              {/* Lista de empleos */}
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title">
                    <IcBag /> Vacantes destacadas
                  </div>
                  <span className="db-pill db-pill--blue">
                    {filteredJobs.length} mostradas
                  </span>
                </div>

                <div className="db-jobs">
                  {filteredJobs.map((job) => (
                    <div key={job.id} className="db-job">
                      <div className="db-job-logo">
                        {(job.companyName || 'C')[0]}
                      </div>

                      <div className="db-job-info">
                        <div className="db-job-title">{job.title}</div>
                        <div className="db-job-meta">
                          <span>{job.companyName || 'Empresa confidencial'}</span>
                          {job.location && (
                            <>
                              <span className="db-dot" />
                              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.25rem' }}>
                                <IcPin /> {job.location}
                              </span>
                            </>
                          )}
                          {job.modality && (
                            <>
                              <span className="db-dot" />
                              <span>{job.modality}</span>
                            </>
                          )}
                        </div>
                        {job.salaryRange && (
                          <div
                            style={{
                              marginTop: '.3rem',
                              fontSize: '.76rem',
                              color: 'var(--text-muted)',
                            }}
                          >
                            {job.salaryRange}
                          </div>
                        )}
                      </div>

                      <div className="db-job-r">
                        <span className={badgeClass(job.isActive)}>
                          {job.isActive ? 'Activa' : 'Cerrada'}
                        </span>
                        {typeof job.applicantsCount === 'number' && (
                          <div
                            style={{
                              marginTop: '.25rem',
                              fontSize: '.7rem',
                              color: 'var(--text-muted)',
                              textAlign: 'right',
                            }}
                          >
                            {job.applicantsCount} postulantes
                          </div>
                        )}
                        <button
                          className="db-job-btn"
                          type="button"
                          disabled={!job.isActive}
                        >
                          Postular
                        </button>
                      </div>
                    </div>
                  ))}

                  {!loading && !filteredJobs.length && (
                    <div
                      style={{
                        padding: '1.5rem 1rem',
                        fontSize: '.8rem',
                        color: 'var(--text-muted)',
                        textAlign: 'center',
                      }}
                    >
                      No se encontraron ofertas con esos filtros.
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Columna derecha con pipeline simple + insights */}
            <div className="db-col">
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title">
                    <IcDoc /> Tu pipeline
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '.75rem' }}>
                  <div
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '1rem 1rem .9rem',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '.72rem',
                        color: 'var(--text-faint)',
                        marginBottom: '.25rem',
                      }}
                    >
                      Compatibles
                    </div>
                    <div
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.65rem',
                        fontWeight: 800,
                        lineHeight: 1,
                        letterSpacing: '-.03em',
                      }}
                    >
                      {totalJobs}
                    </div>
                    <div
                      style={{
                        marginTop: '.35rem',
                        fontSize: '.74rem',
                        color: 'var(--text-muted)',
                      }}
                    >
                      Vacantes visibles con tu stack actual.
                    </div>
                  </div>

                  <div
                    style={{
                      background: 'var(--surface-2)',
                      border: '1px solid var(--border)',
                      borderRadius: '10px',
                      padding: '1rem 1rem .9rem',
                    }}
                  >
                    <div
                      style={{
                        fontSize: '.72rem',
                        color: 'var(--text-faint)',
                        marginBottom: '.25rem',
                      }}
                    >
                      Insights
                    </div>
                    <div
                      style={{
                        fontSize: '.8rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                      }}
                    >
                      A medida que conectemos tu CV y match real,
                      aquí verás métricas de postulaciones y entrevistas.
                    </div>
                  </div>
                </div>
              </div>

              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title">
                    <IcUsers /> Acciones rápidas
                  </div>
                </div>

                <div style={{ display: 'grid', gap: '.75rem' }}>
                  <button
                    className="db-tbtn db-tbtn--primary"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => navigate('/cv')}
                  >
                    Exportar CV para aplicar
                  </button>
                  <button
                    className="db-tbtn"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => navigate('/perfil')}
                  >
                    Ver perfil público
                  </button>
                  <button
                    className="db-tbtn"
                    style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => navigate('/dashboard')}
                  >
                    Volver al dashboard
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}