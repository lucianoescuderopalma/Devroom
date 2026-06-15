// src/pages/Dashboard.jsx
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
const IcActivity = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)


// MOCKS de fallback
const REPOS_FALLBACK = [
  { name: 'devroom-backend',  lang: 'Java',       dot: '#f59e0b', commits: 142, score: 92, lvl: 'high', ago: 'hace 2 días' },
  { name: 'portfolio-react',  lang: 'TypeScript',  dot: '#38bdf8', commits: 87,  score: 88, lvl: 'high', ago: 'hace 5 días' },
  { name: 'ml-classifier',    lang: 'Python',      dot: '#10b981', commits: 63,  score: 74, lvl: 'mid',  ago: 'hace 2 sem'  },
  { name: 'devroom-frontend', lang: 'React/JSX',   dot: '#38bdf8', commits: 210, score: 90, lvl: 'high', ago: 'hace 1 día'  },
  { name: 'fiber-api',        lang: 'Go',          dot: '#a78bfa', commits: 31,  score: 58, lvl: 'low',  ago: 'hace 1 mes'  },
]

const JOBS_FALLBACK = [
  { co: 'F', title: 'Backend Engineer · Java / Spring Boot', company: 'Falabella Tech', mode: 'Remoto',       salary: '$4.000K–5.200K CLP', match: 92, lvl: 'high' },
  { co: 'B', title: 'Full Stack Developer · React + Node',   company: 'Bci Digital',    mode: 'Santiago',     salary: '$3.500K CLP',         match: 84, lvl: 'high' },
  { co: 'C', title: 'Software Engineer · Microservices',     company: 'Cornershop',     mode: 'Remoto LATAM', salary: '$3.800K CLP',         match: 78, lvl: 'mid'  },
  { co: 'R', title: 'Java Developer · Fintech',              company: 'Ripley Corp',    mode: 'Santiago',     salary: '$3.200K CLP',         match: 71, lvl: 'mid'  },
]

const SKILLS_FALLBACK = [
  { name: 'Java',        pct: 92, lvl: 'high' },
  { name: 'Spring Boot', pct: 88, lvl: 'high' },
  { name: 'React',       pct: 80, lvl: 'high' },
  { name: 'TypeScript',  pct: 74, lvl: 'mid'  },
  { name: 'PostgreSQL',  pct: 70, lvl: 'mid'  },
  { name: 'Docker',      pct: 60, lvl: 'low'  },
]

const ACTIVITY = [30, 70, 50, 90, 60, 40, 20]
const DAYS     = ['L', 'M', 'X', 'J', 'V', 'S', 'D']

const CV_CHECKS_FALLBACK = [
  { st: 'ok',      txt: 'Repositorios conectados'  },
  { st: 'ok',      txt: 'Skills extraídas por IA'  },
  { st: 'ok',      txt: 'Perfil público activo'    },
  { st: 'warn',    txt: 'Descripción personal'     },
  { st: 'pending', txt: 'Proyectos destacados'     },
]


// HELPERS
const scoreClass = (lvl) => {
  if (lvl === 'high') return 'db-badge db-badge--high'
  if (lvl === 'mid')  return 'db-badge db-badge--mid'
  return 'db-badge db-badge--low'
}

const pillClass = (lvl) => {
  if (lvl === 'high') return 'db-pill db-pill--green'
  if (lvl === 'mid')  return 'db-pill db-pill--amber'
  return 'db-pill db-pill--blue'
}

const skillLevelFromPct = (pct) => {
  if (pct >= 80) return 'high'
  if (pct >= 60) return 'mid'
  return 'low'
}

const initialsFromName = (name, username) => {
  if (name?.trim()) {
    const parts = name.trim().split(/\s+/)
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase()
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (username || 'LE').slice(0, 2).toUpperCase()
}


export default function Dashboard() {
  const navigate = useNavigate()
  const [collapsed,  setCollapsed]  = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  const [me,      setMe]      = useState(null)
  const [stats,   setStats]   = useState(null)
  const [cv,      setCv]      = useState(null)
  const [repos,   setRepos]   = useState([])
  const [jobs,    setJobs]    = useState([])
  const [loading, setLoading] = useState(false)
  const [error,   setError]   = useState(null)

  const [syncing, setSyncing] = useState(false)
  const [syncMsg, setSyncMsg] = useState(null)

  const load = async () => {
    try {
      setLoading(true)
      setError(null)

      const meRes   = await api.get('/api/auth/me')
      const profile = meRes.data
      setMe(profile)

      const [statsRes, cvRes, reposRes, jobsRes] = await Promise.all([
        api.get('/api/profile/stats'),
        api.get('/api/cv/me'),
        api.get(`/api/users/${profile.username}/repos`),
        api.get('/api/jobs'),
      ])

      setStats(statsRes.data || null)
      setCv(cvRes.data || null)
      setRepos((reposRes.data || []).filter(r => !r.isPrivate))
      setJobs(jobsRes.data || [])
    } catch (err) {
      console.error(err)
      setError('No se pudo cargar tu dashboard. Revisa tu conexión.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  const handleSync = async () => {
    try {
      setSyncing(true)
      setSyncMsg(null)
      const res = await api.post('/api/repos/sync')
      setSyncMsg(`✓ ${res.data.count ?? 0} repos sincronizados`)
      await load()
    } catch (e) {
      console.error(e)
      setSyncMsg('Error al sincronizar repos')
    } finally {
      setSyncing(false)
    }
  }

  const score  = typeof cv?.score === 'number' ? cv.score : 87
  const circ   = 2 * Math.PI * 50
  const offset = circ - (score / 100) * circ

  const reposCount     = repos.length || REPOS_FALLBACK.length
  const distinctSkills = stats?.distinctSkills ?? SKILLS_FALLBACK.length
  const totalCommits   = repos?.length
    ? repos.reduce((acc, r) => acc + (r.commits ?? 0), 0)
    : 47

  const skillsFromStats = stats?.skills?.length
    ? stats.skills.map(s => ({ name: s.name, pct: s.pct, lvl: skillLevelFromPct(s.pct) }))
    : SKILLS_FALLBACK

  const reposForTable = repos?.length
    ? repos.map(r => ({
        name:    r.name,
        lang:    r.mainLanguage || 'N/A',
        dot:     '#38bdf8',
        commits: r.commits ?? 0,
        score:   r.scoreLevel || '-',
        lvl:     r.scoreLevel === 'Alto' ? 'high'
               : r.scoreLevel === 'Medio' ? 'mid'
               : r.scoreLevel === 'Bajo'  ? 'low'
               : 'mid',
        ago: '—',
      }))
    : REPOS_FALLBACK

  const jobsForList = jobs?.length
    ? jobs.map(j => ({
        co:      j.companyName ? j.companyName[0].toUpperCase() : 'E',
        title:   j.title,
        company: j.companyName,
        mode:    j.location || j.modality || 'Remoto',
        salary:  j.salaryRange || 'A convenir',
        match:   80,
        lvl:     'mid',
      }))
    : JOBS_FALLBACK

  const cvChecks = stats
    ? [
        { st: 'ok',                         txt: `${reposCount} repositorios conectados`               },
        { st: 'ok',                         txt: `${distinctSkills} skills detectadas por IA`          },
        { st: cv?.isOnline ? 'ok' : 'warn', txt: cv?.isOnline ? 'Perfil público activo' : 'Activa tu perfil público' },
      ]
    : CV_CHECKS_FALLBACK

  const initials = initialsFromName(me?.name, me?.username)

  const navItems = [
    { icon: <IcGrid />,  label: 'Dashboard',      active: true,  to: '/dashboard'   },
    { icon: <IcGithub />,label: 'Repositorios',   active: false, to: '/repositorios' },
    { icon: <IcDoc />,   label: 'Mi CV',           active: false, to: '/cv'          },
    { icon: <IcBag />,   label: 'Empleos',         active: false, to: '/empleos'     },
    { icon: <IcUsers />, label: 'Red',             active: false, to: '/red'         },
    { icon: <IcUser />,  label: 'Perfil público',  active: false, to: '/perfil'      },
  ]

  return (
    <div className={`db-wrap${collapsed ? ' db-wrap--col' : ''}`}>
      {mobileOpen && <div className="db-overlay" onClick={() => setMobileOpen(false)} />}

      {/* ── Sidebar ── */}
      <aside className={'db-side' + (collapsed ? ' db-side--col' : '') + (mobileOpen ? ' db-side--open' : '')}>
        <div className="db-side-logo">
          <div className="db-side-logo-icon">{'</>'}</div>
          <span className="db-side-logo-txt">DevRoom</span>
        </div>

        {/* TC-DB02: nav-item-{label} */}
        <nav className="db-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              data-testid={`nav-item-${item.label}`}
              className={`db-nav-item${item.active ? ' db-nav-item--on' : ''}`}
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
            <div className="db-side-handle">@{me?.username || 'lescudero'} · {me?.location || 'Santiago'}</div>
          </div>
        </div>

        <button className="db-side-toggle" onClick={() => setCollapsed(v => !v)}>
          <IcChevR />
        </button>
      </aside>

      {/* ── Main ── */}
      <div className="db-main">
        <header className="db-topbar">
          <div className="db-topbar-l">
            <button className="db-topbar-menu" onClick={() => setMobileOpen(v => !v)}>
              <IcMenu />
            </button>
            <div className="db-breadcrumb">
              <span className="db-bc-root">DevRoom</span>
              <IcChevR />
              <span className="db-bc-cur">Dashboard</span>
            </div>
          </div>

          <div className="db-topbar-r">
            {/* TC-DB11: btn-sync */}
            <button
              data-testid="btn-sync"
              className="db-tbtn"
              onClick={handleSync}
              disabled={syncing}
            >
              <IcSync />
              <span>{syncing ? 'Sincronizando…' : 'Sincronizar'}</span>
            </button>

            {/* TC-DB12: btn-ver-cv */}
            <button
              data-testid="btn-ver-cv"
              className="db-tbtn db-tbtn--primary"
              onClick={() => navigate('/cv')}
            >
              <IcDown />
              <span>Ver CV</span>
            </button>

            <button className="db-tbtn-ico">
              <IcBell />
              <span className="db-notif-dot" />
            </button>
            <div className="db-topbar-av">{initials}</div>
          </div>
        </header>

        {syncMsg && (
          <div style={{ fontSize: '.78rem', color: 'var(--text-muted)', padding: '.4rem 1.5rem' }}>
            {syncMsg}
          </div>
        )}

        <div className="db-body">
          {/* TC-DB01: page-title */}
          <div className="db-page-hd">
            <h1 className="db-page-title" data-testid="page-title">
              {me ? `Bienvenido, ${me.name?.split(' ')[0] || me.username}` : 'Bienvenido'}
            </h1>
            <div className="db-page-meta">
              <span>{reposCount} repositorios analizados</span>
              <span className="db-dot" />
              <span>{distinctSkills} skills detectadas</span>
              <span className="db-dot" />
              <span className="db-meta-hi">Score CV: {score} / 100</span>
            </div>
          </div>

          {loading && (
            <div style={{ marginBottom: '1rem', fontSize: '.8rem', color: 'var(--text-muted)' }}>
              Cargando tus datos…
            </div>
          )}
          {error && (
            <div style={{ marginBottom: '1rem', fontSize: '.8rem', color: 'var(--amber)' }}>
              {error}
            </div>
          )}

          {/* TC-DB03: kpi-repos, kpi-score, kpi-jobs, kpi-cv  |  TC-DB10: kpi-grid */}
          <div className="db-kpis" data-testid="kpi-grid">
            <div className="db-kpi" data-testid="kpi-repos">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--amber"><IcGithub /></div>
                <span className="db-kpi-trend">{reposCount > 0 ? `+${reposCount}` : '+0'}</span>
              </div>
              <div className="db-kpi-val">{reposCount}</div>
              <div className="db-kpi-lbl">Repositorios</div>
              <div className="db-kpi-sub">analizados por IA</div>
            </div>

            <div className="db-kpi" data-testid="kpi-score">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--green"><IcStar /></div>
                <span className="db-kpi-trend">Score CV</span>
              </div>
              <div className="db-kpi-val">{score}%</div>
              <div className="db-kpi-lbl">Score del perfil</div>
              <div className="db-kpi-sub">{distinctSkills} skills detectadas</div>
            </div>

            <div className="db-kpi" data-testid="kpi-jobs">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--blue"><IcBag /></div>
                <span className="db-kpi-trend">{jobsForList.length ? `+${jobsForList.length}` : '+0'}</span>
              </div>
              <div className="db-kpi-val">{jobsForList.length}</div>
              <div className="db-kpi-lbl">Empleos activos</div>
              <div className="db-kpi-sub">desde tu Job Board</div>
            </div>

            <div className="db-kpi" data-testid="kpi-cv">
              <div className="db-kpi-top">
                <div className="db-kpi-ico db-kpi-ico--amber"><IcDoc /></div>
                <span className="db-kpi-trend">{score}%</span>
              </div>
              <div className="db-kpi-val">CV</div>
              <div className="db-kpi-lbl">Generado por IA</div>
              <div className="db-kpi-sub">{cv?.isOnline ? 'versión online activa' : 'listo para exportar'}</div>
            </div>
          </div>

          <div className="db-grid">
            <div className="db-col">
              {/* TC-DB04 / TC-DB05 / TC-DB13: repo-row */}
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title"><IcGithub /> Repositorios analizados</div>
                  <button className="db-card-link" onClick={() => navigate('/repositorios')}>
                    Ver todos <IcChevR />
                  </button>
                </div>
                <div className="db-tbl-wrap">
                  <table className="db-tbl">
                    <thead>
                      <tr>
                        <th>Repositorio</th>
                        <th>Lenguaje</th>
                        <th>Commits</th>
                        <th>Score IA</th>
                        <th>Actualizado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reposForTable.map((r) => (
                        <tr key={r.name} data-testid="repo-row">
                          <td><span className="db-repo">{r.name}</span></td>
                          <td>
                            <span className="db-lang">
                              <span className="db-lang-dot" style={{ backgroundColor: r.dot }} />
                              {r.lang}
                            </span>
                          </td>
                          <td className="db-tnum">{r.commits}</td>
                          <td><span className={scoreClass(r.lvl)}>{r.score}</span></td>
                          <td className="db-tmuted">{r.ago}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* TC-DB06: job-item */}
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title"><IcBag /> Empleos recomendados</div>
                  <span className="db-pill db-pill--blue">{jobsForList.length} activos</span>
                </div>
                <div className="db-jobs">
                  {jobsForList.map((job) => (
                    <div className="db-job" key={job.title + job.company} data-testid="job-item">
                      <div className="db-job-logo">{job.co}</div>
                      <div className="db-job-info">
                        <div className="db-job-title">{job.title}</div>
                        <div className="db-job-meta">
                          <span>{job.company}</span>
                          <span className="db-dot" />
                          <span>{job.mode}</span>
                          <span className="db-dot" />
                          <span className="db-job-salary">{job.salary}</span>
                        </div>
                      </div>
                      <div className="db-job-r">
                        <span className={pillClass(job.lvl)}>{job.match}%</span>
                        <button className="db-job-btn" onClick={() => navigate('/empleos')}>Ver</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="db-col">
              {/* TC-DB07: cv-score-ring, cv-score-text  |  TC-DB08: cv-check-item */}
              <div className="db-card db-card--center">
                <div className="db-card-hd db-card-hd--full">
                  <div className="db-card-title"><IcDoc /> Score del CV</div>
                  <span className="db-pill db-pill--green">{score} / 100</span>
                </div>

                <div className="db-ring">
                  <svg
                    width="126"
                    height="126"
                    viewBox="0 0 120 120"
                    data-testid="cv-score-ring"
                  >
                    <defs>
                      <linearGradient id="cvg" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#10b981" />
                      </linearGradient>
                    </defs>
                    <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,.06)" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="50"
                      fill="none"
                      stroke="url(#cvg)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      strokeDasharray={circ}
                      strokeDashoffset={offset}
                      transform="rotate(-90 60 60)"
                    />
                    <text
                      x="60" y="56"
                      textAnchor="middle"
                      fontFamily="Sora,sans-serif"
                      fontSize="22"
                      fontWeight="800"
                      fill="#e2e8f0"
                      data-testid="cv-score-text"
                    >
                      {score}
                    </text>
                    <text x="60" y="72" textAnchor="middle" fontFamily="Space Grotesk,sans-serif" fontSize="8" fill="#7c8db5">
                      COMPLETITUD
                    </text>
                  </svg>
                </div>

                <div className="db-cv-checks">
                  {cvChecks.map((item) => (
                    <div
                      className={`db-cv-check${item.st === 'pending' ? ' db-cv-pending' : ''}`}
                      key={item.txt}
                      data-testid="cv-check-item"
                    >
                      <span className={'db-cv-dot' + (item.st === 'ok' ? ' db-cv-dot--ok' : item.st === 'warn' ? ' db-cv-dot--warn' : '')} />
                      <span>{item.txt}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* TC-DB09: skill-item */}
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title"><IcStar /> Top skills</div>
                </div>
                <div className="db-skills">
                  {skillsFromStats.map((s) => (
                    <div className="db-skill" key={s.name} data-testid="skill-item">
                      <span className="db-skill-name">{s.name}</span>
                      <div className="db-skill-bg">
                        <div className={`db-skill-fill db-skill-fill--${s.lvl}`} style={{ width: `${s.pct}%` }} />
                      </div>
                      <span className={`db-skill-pct db-skill-pct--${s.lvl}`}>{Math.round(s.pct)}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actividad semanal */}
              <div className="db-card">
                <div className="db-card-hd">
                  <div className="db-card-title"><IcActivity /> Actividad semanal</div>
                  <span className="db-pill db-pill--amber">{totalCommits} commits</span>
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
                  <div className="db-card-title"><IcUsers /> Resumen</div>
                </div>
                <div className="db-jobs">
                  <div className="db-job">
                    <div className="db-job-logo">#</div>
                    <div className="db-job-info">
                      <div className="db-job-title">Ranking del perfil</div>
                      <div className="db-job-meta">
                        <span>Stack principal</span>
                        <span className="db-dot" />
                        <span>{skillsFromStats[0]?.name || 'Java'}</span>
                      </div>
                    </div>
                    <div className="db-job-r">
                      <span className="db-pill db-pill--amber">Activo</span>
                    </div>
                  </div>
                  <div className="db-job">
                    <div className="db-job-logo">AI</div>
                    <div className="db-job-info">
                      <div className="db-job-title">Actividad detectada</div>
                      <div className="db-job-meta">
                        <span>{reposCount} repos</span>
                        <span className="db-dot" />
                        <span>{distinctSkills} skills</span>
                      </div>
                    </div>
                    <div className="db-job-r">
                      <span className="db-pill db-pill--green">Monitorizando</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
