import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

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

const IcCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
    <polyline points="20 6 9 17 4 12" />
  </svg>
)

const IcActivity = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

// MOCKS como fallback visual
const STRENGTHS = [
  { name: 'Experiencia técnica', detail: 'Java, Spring Boot, React, TypeScript y APIs.', status: 'ok' },
  { name: 'Stack visible', detail: 'Repositorios y skills detectadas correctamente.', status: 'ok' },
  { name: 'Resumen profesional', detail: 'Necesita una versión más vendedora y concreta.', status: 'warn' },
  { name: 'Proyectos destacados', detail: 'Falta priorizar 2 o 3 proyectos con impacto.', status: 'warn' },
]

const SECTIONS = [
  { title: 'Resumen profesional', state: 'Completar', tone: 'amber' },
  { title: 'Experiencia', state: 'Bien estructurada', tone: 'green' },
  { title: 'Skills técnicas', state: 'Actualizada', tone: 'green' },
  { title: 'Proyectos', state: 'Reforzar', tone: 'blue' },
  { title: 'Enlaces y portafolio', state: 'Activo', tone: 'green' },
]

const SUGGESTIONS = [
  'Agregar un resumen de 3 líneas orientado a backend/full stack.',
  'Destacar devroom-backend y devroom-frontend como proyectos principales.',
  'Incluir métricas o resultados concretos en experiencia reciente.',
]

const CV_CHECKS = [
  { st: 'ok', txt: '12 repositorios conectados' },
  { st: 'ok', txt: 'Skills extraídas por IA' },
  { st: 'ok', txt: 'Perfil público activo' },
  { st: 'warn', txt: 'Descripción personal' },
  { st: 'pending', txt: 'Proyectos destacados' },
]

const SKILLS = [
  { name: 'Java', pct: 92 },
  { name: 'Spring Boot', pct: 88 },
  { name: 'React', pct: 80 },
  { name: 'TypeScript', pct: 74 },
  { name: 'PostgreSQL', pct: 70 },
  { name: 'Docker', pct: 60 },
]

const ACTIVITY = [30, 70, 50, 90, 60, 40, 20]
const DAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

function pillClass(tone) {
  if (tone === 'green') return 'db-pill db-pill--green'
  if (tone === 'blue') return 'db-pill db-pill--blue'
  return 'db-pill db-pill--amber'
}

function skillLevelFromPct(pct) {
  if (pct >= 80) return 'high'
  if (pct >= 60) return 'mid'
  return 'low'
}

export default function CvPage() {
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const [cv, setCv] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCv = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await api.get('/api/cv/me')
        setCv(res.data || null)
      } catch (err) {
        console.error(err)
        setError('No se pudo cargar tu CV, mostrando versión estimada.')
      } finally {
        setLoading(false)
      }
    }

    fetchCv()
  }, [])

  const score = typeof cv?.score === 'number' ? cv.score : 87
  const circ = 2 * Math.PI * 50
  const offset = circ - (score / 100) * circ

  const summaryText =
    cv?.summary ||
    'Desarrollador backend / full stack con experiencia en Java, Spring Boot y React, enfocado en construir APIs limpias y productos escalables.'

  const fullName = cv?.fullName || 'Luciano E.'
  const headline = cv?.headline || 'Backend / Full Stack Developer'
  const location = cv?.location || 'Santiago'

  // Skills desde backend (cv.skills) → fallback a SKILLS mock
  const skillsToShow = cv?.skills?.length
    ? cv.skills.map((s) => {
        let pct
        if (s.level === 'Avanzado') pct = 92
        else if (s.level === 'Intermedio') pct = 74
        else pct = 60
        return { name: s.name, pct }
      })
    : SKILLS

  // Checks derivados del CV si hay datos, sino mocks
  const cvChecksFromCv =
    cv && (cv.skills?.length || cv.projects?.length)
      ? [
          cv.projects?.length
            ? { st: 'ok', txt: `${cv.projects.length} proyectos destacados` }
            : null,
          cv.skills?.length
            ? { st: 'ok', txt: `${cv.skills.length} skills detectadas` }
            : null,
          { st: cv.isPublic ? 'ok' : 'warn', txt: cv.isPublic ? 'CV público activo' : 'CV aún no público' },
        ].filter(Boolean)
      : CV_CHECKS

  const NAV = [
    { icon: <IcGrid />, label: 'Dashboard', to: '/dashboard', active: false },
    { icon: <IcGithub />, label: 'Repositorios', to: '/repositorios', active: false },
    { icon: <IcDoc />, label: 'Mi CV', to: '/cv', active: true },
    { icon: <IcBag />, label: 'Empleos', to: '/empleos', active: false },
    { icon: <IcUsers />, label: 'Red', to: '/red', active: false },
    { icon: <IcUser />, label: 'Perfil público', to: '/perfil', active: false },
  ]

  const handleExport = async () => {
  try {
    const res = await api.get('/api/cv/export', {
      responseType: 'blob',
    })

    const blob = new Blob([res.data], { type: 'application/pdf' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'cv-devroom.pdf'
    document.body.appendChild(a)
    a.click()
    a.remove()
    window.URL.revokeObjectURL(url)
  } catch (e) {
    console.error(e)
    alert('No se pudo exportar el CV en PDF. Inténtalo de nuevo en unos minutos.')
  }
}

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
          <div className="db-side-av">{fullName.slice(0, 2).toUpperCase()}</div>
          <div className="db-side-profile-txt">
            <div className="db-side-name">{fullName}</div>
            <div className="db-side-handle">@lescudero · {location}</div>
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
              <span className="db-bc-cur">Mi CV</span>
            </div>
          </div>

          <div className="db-topbar-r">
            <button className="db-tbtn" onClick={() => window.location.reload()}>
              <IcSync />
              <span>Sincronizar</span>
            </button>

            <button className="db-tbtn db-tbtn--primary" onClick={handleExport}>
              <IcDown />
              <span>Exportar CV</span>
            </button>

            <div className="db-tbtn-ico">
              <IcBell />
              <span className="db-notif-dot" />
            </div>

            <div className="db-topbar-av">{fullName.slice(0, 2).toUpperCase()}</div>
          </div>
        </header>

        <section className="db-body">
          <div className="db-page-hd">
            <h1 className="db-page-title">Mi CV</h1>
            <div className="db-page-meta">
              <span>Currículum generado con IA a partir de tu perfil técnico</span>
              <span className="db-dot" />
              <span className="db-meta-hi">{score} / 100 de completitud</span>
            </div>
          </div>

          {headline && (
            <div
              style={{
                marginBottom: '0.8rem',
                fontSize: '.9rem',
                color: 'var(--text-muted)',
              }}
            >
              {headline}
            </div>
          )}

          {loading && (
            <div style={{ marginBottom: '1rem', fontSize: '.8rem', color: 'var(--text-muted)' }}>
              Analizando tu perfil y generando CV…
            </div>
          )}
          {error && (
            <div style={{ marginBottom: '1rem', fontSize: '.8rem', color: 'var(--amber)' }}>
              {error}
            </div>
          )}

          <div className="db-kpis">
            <div className="db-kpi">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--amber">
                  <IcDoc />
                </div>
                <span className="db-kpi-trend">{score}%</span>
              </div>
              <div className="db-kpi-val">CV</div>
              <div className="db-kpi-lbl">Generado por IA</div>
              <div className="db-kpi-sub">
                {cv?.isOnline ? 'versión online activa' : 'listo para exportar'}
              </div>
            </div>

            <div className="db-kpi">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--green">
                  <IcStar />
                </div>
                <span className="db-kpi-trend">Skills</span>
              </div>
              <div className="db-kpi-val">{skillsToShow.length}</div>
              <div className="db-kpi-lbl">Skills detectadas</div>
              <div className="db-kpi-sub">
                {skillsToShow.slice(0, 3).map((s) => s.name).join(' · ') || 'Conecta repos para detectar stack'}
              </div>
            </div>

            <div className="db-kpi">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--blue">
                  <IcGithub />
                </div>
                <span className="db-kpi-trend">
                  {cv?.projects?.length ? `+${cv.projects.length}` : '+2'}
                </span>
              </div>
              <div className="db-kpi-val">{cv?.projects?.length ?? 2}</div>
              <div className="db-kpi-lbl">Proyectos base</div>
              <div className="db-kpi-sub">usados para enriquecer contenido</div>
            </div>

            <div className="db-kpi">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--amber">
                  <IcUsers />
                </div>
                <span className="db-kpi-trend">mejorable</span>
              </div>
              <div className="db-kpi-val">{STRENGTHS.filter((s) => s.status !== 'ok').length}</div>
              <div className="db-kpi-lbl">Áreas a reforzar</div>
              <div className="db-kpi-sub">antes de exportar versión final</div>
            </div>
          </div>

          <div className="db-grid">
            <div className="db-col">
              {/* Estructura del CV */}
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title">
                    <IcDoc /> Estructura del CV
                  </div>
                  <button className="db-card-link" type="button">
                    Editar <IcChevR />
                  </button>
                </div>

                <div className="db-jobs">
                  {SECTIONS.map((section) => (
                    <div className="db-job" key={section.title}>
                      <div className="db-job-logo">
                        <IcCheck />
                      </div>
                      <div className="db-job-info">
                        <div className="db-job-title">{section.title}</div>
                        <div className="db-job-meta">
                          <span>Estado actual del bloque</span>
                        </div>
                      </div>
                      <div className="db-job-r">
                        <span className={pillClass(section.tone)}>{section.state}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recomendaciones de mejora */}
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title">
                    <IcStar /> Recomendaciones de mejora
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '.75rem' }}>
                  {SUGGESTIONS.map((item) => (
                    <div
                      key={item}
                      style={{
                        background: 'var(--surface-2)',
                        border: '1px solid var(--border)',
                        borderRadius: '10px',
                        padding: '1rem',
                        fontSize: '.82rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.65,
                      }}
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="db-col">
              {/* Score y resumen */}
              <div className="db-card db-card--center">
                <div className="db-card-hd db-card-hd--full">
                  <div className="db-card-title">
                    <IcDoc /> Score del CV
                  </div>
                  <span className="db-pill db-pill--green">{score} / 100</span>
                </div>

                <div className="db-ring">
                  <svg width="126" height="126" viewBox="0 0 120 120">
                    <defs>
                      <linearGradient id="cvgrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0" stopColor="#f59e0b" />
                        <stop offset="1" stopColor="#10b981" />
                      </linearGradient>
                    </defs>

                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="rgba(255,255,255,.06)"
                      strokeWidth="10"
                    />
                    <circle
                      cx="60"
                      cy="60"
                      r="50"
                      fill="none"
                      stroke="url(#cvgrad)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circ}
                      strokeDashoffset={offset}
                      transform="rotate(-90 60 60)"
                    />
                    <text
                      x="60"
                      y="56"
                      textAnchor="middle"
                      fontFamily="Sora, sans-serif"
                      fontSize="22"
                      fontWeight="800"
                      fill="#e2e8f0"
                    >
                      {score}
                    </text>
                    <text
                      x="60"
                      y="72"
                      textAnchor="middle"
                      fontFamily="Space Grotesk, sans-serif"
                      fontSize="8"
                      fill="#7c8db5"
                    >
                      COMPLETITUD
                    </text>
                  </svg>
                </div>

                <p className="db-cv-summary">
                  {summaryText}
                </p>

                <div className="db-cv-checks">
                  {cvChecksFromCv.map((item) => (
                    <div
                      className={`db-cv-check${item.st === 'pending' ? ' db-cv-pending' : ''}`}
                      key={item.txt}
                    >
                      <span
                        className={
                          'db-cv-dot' +
                          (item.st === 'ok'
                            ? ' db-cv-dot--ok'
                            : item.st === 'warn'
                            ? ' db-cv-dot--warn'
                            : '')
                        }
                      />
                      <span>{item.txt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top skills */}
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title">
                    <IcStar /> Top skills
                  </div>
                </div>

                <div className="db-skills">
                  {skillsToShow.map((s) => {
                    const lvl = skillLevelFromPct(s.pct)
                    return (
                      <div className="db-skill" key={s.name}>
                        <span className="db-skill-name">{s.name}</span>
                        <div className="db-skill-bg">
                          <div
                            className={`db-skill-fill db-skill-fill--${lvl}`}
                            style={{ width: `${s.pct}%` }}
                          />
                        </div>
                        <span className={`db-skill-pct db-skill-pct--${lvl}`}>
                          {Math.round(s.pct)}%
                        </span>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Actividad semanal (placeholder visual) */}
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title">
                    <IcActivity /> Actividad semanal
                  </div>
                  <span className="db-pill db-pill--amber">
                    47 commits
                  </span>
                </div>

                <div className="db-activity">
                  {ACTIVITY.map((v, i) => (
                    <div className="db-act-col" key={DAYS[i]}>
                      <div className="db-act-bar-wrap">
                        <div className="db-act-bar" style={{ height: `${v}%` }} />
                      </div>
                      <div className="db-act-day">{DAYS[i]}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resumen lateral */}
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title">
                    <IcUsers /> Resumen
                  </div>
                </div>

                <div className="db-jobs">
                  <div className="db-job">
                    <div className="db-job-logo">#</div>
                    <div className="db-job-info">
                      <div className="db-job-title">Ranking del perfil</div>
                      <div className="db-job-meta">
                        <span>Top 15%</span>
                        <span className="db-dot" />
                        <span>stack Java</span>
                      </div>
                    </div>
                    <div className="db-job-r">
                      <span className="db-pill db-pill--amber">TOP</span>
                    </div>
                  </div>

                  <div className="db-job">
                    <div className="db-job-logo">AI</div>
                    <div className="db-job-info">
                      <div className="db-job-title">Actividad detectada</div>
                      <div className="db-job-meta">
                        <span>{cv?.projects?.length ?? 2} proyectos</span>
                        <span className="db-dot" />
                        <span>{skillsToShow.length} skills</span>
                      </div>
                    </div>
                    <div className="db-job-r">
                      <span className="db-pill db-pill--green">Activo</span>
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