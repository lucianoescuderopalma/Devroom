import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import api from '../api/axios'

// ICONOS
const IcMapPin = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
)
const IcCalendar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
)
const IcGithub = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
)
const IcLink = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
    <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
  </svg>
)
const IcArrowLeft = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M15 18l-6-6 6-6" />
  </svg>
)
const IcActivity = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
)

// MOCKS de fallback
const FALLBACK_SKILLS = [
  { name: 'Java', pct: 92, level: 'Avanzado' },
  { name: 'Spring Boot', pct: 88, level: 'Avanzado' },
  { name: 'React', pct: 80, level: 'Avanzado' },
  { name: 'TypeScript', pct: 74, level: 'Intermedio' },
  { name: 'PostgreSQL', pct: 70, level: 'Intermedio' },
  { name: 'Docker', pct: 60, level: 'Intermedio' },
]

const FALLBACK_REPOS = [
  {
    name: 'devroom-backend',
    lang: 'Java',
    desc: 'API REST con Spring Boot, JPA, JWT y arquitectura hexagonal.',
  },
  {
    name: 'devroom-frontend',
    lang: 'React/JSX',
    desc: 'Dashboard SPA en React + Vite con design system propio.',
  },
  {
    name: 'portfolio-react',
    lang: 'TypeScript',
    desc: 'Portfolio personal con animaciones y scroll reveal.',
  },
]

const EXPERIENCE = [
  {
    role: 'Full Stack Developer',
    company: 'Freelance / Proyectos propios',
    period: '2024 – presente',
    desc: 'Construyendo DevRoom: plataforma de análisis de perfil de desarrolladores con IA. Stack: Spring Boot, React, PostgreSQL, Docker.',
  },
  {
    role: 'Técnico en Infraestructura',
    company: 'Institución educacional · Santiago',
    period: '2023 – 2024',
    desc: 'Procurement y mantenimiento de equipos de fibra óptica, fusionadoras y switches. Gestión de proveedores y licitaciones.',
  },
]

function skillLevelFromPct(pct) {
  if (pct >= 80) return 'Avanzado'
  if (pct >= 60) return 'Intermedio'
  return 'Básico'
}

export default function PublicProfilePage() {
  const navigate = useNavigate()

  const [profile, setProfile] = useState(null)
  const [stats, setStats] = useState(null)
  const [repos, setRepos] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true)
        setError(null)

        // 1) Perfil del usuario autenticado (UserProfileDTO)
        const meRes = await api.get('/api/auth/me')
        const me = meRes.data
        setProfile(me)

        // 2) Stats a partir de repos (lenguajes, commits, etc.)
        const statsRes = await api.get('/api/profile/stats')
        setStats(statsRes.data || null)

        // 3) Repositorios públicos del usuario para destacar 3
        if (me?.username) {
          const reposRes = await api.get(`/api/users/${me.username}/repos`)
          setRepos(reposRes.data || [])
        }
      } catch (err) {
        setError('No se pudo cargar el perfil público.')
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [])

  const initials =
    profile?.name?.trim() ?
      profile.name.trim().split(' ').map(p => p[0]).join('').slice(0, 2).toUpperCase() :
      'LE'

  const location = profile?.location || 'Santiago, Chile'
  const role = profile?.role || 'Full Stack Developer · Java / Spring Boot · React'
  const githubUrl = profile?.githubUrl || (profile?.username ? `https://github.com/${profile.username}` : 'https://github.com/')
  const publicHandle = profile?.username ? `devroom.app/@${profile.username}` : 'devroom.app/@lescudero'

  const skillsFromStats = stats?.skills?.length
    ? stats.skills.map(s => ({
        name: s.name,
        pct: s.pct,
        level: skillLevelFromPct(s.pct),
      }))
    : FALLBACK_SKILLS

  const reposToShow =
    repos && repos.length
      ? repos
          .filter(r => !r.isPrivate)
          .slice(0, 3)
          .map(r => ({
            name: r.name,
            lang: r.mainLanguage || 'N/A',
            desc: r.description || 'Repositorio sin descripción.',
            commits: r.commits ?? null,
          }))
      : FALLBACK_REPOS

  const totalCommits = stats?.totalCommits ?? 0
  const reposCount = stats?.reposCount ?? reposToShow.length
  const distinctSkills = stats?.distinctSkills ?? skillsFromStats.length

  return (
    <>
      <Navbar
        showMarketingLinks={false}
        showLandingLink={true}
        showDashboardLink={false}
      />

      <main
        className="db-content"
        style={{
          maxWidth: '1100px',
          marginInline: 'auto',
          paddingTop: '96px',
        }}
      >
        {/* Header perfil */}
        <header className="db-page-header" style={{ marginBottom: '2rem' }}>
          <div
            className="db-page-header-left"
            style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}
          >
            <div
              style={{
                width: 72,
                height: 72,
                borderRadius: '9999px',
                background: profile?.avatarUrl
                  ? `url(${profile.avatarUrl}) center/cover no-repeat`
                  : 'linear-gradient(135deg,#f59e0b,#10b981)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Sora, sans-serif',
                fontWeight: 800,
                fontSize: '1.4rem',
                color: '#1e2330',
              }}
            >
              {!profile?.avatarUrl && initials}
            </div>
            <div>
              <p className="section-label">Perfil público</p>
              <h1 className="section-title" style={{ marginBottom: '0.5rem' }}>
                {profile?.name || 'Luciano Escudero'}
              </h1>
              <p className="db-page-sub">
                {role}
              </p>
              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '0.75rem',
                  marginTop: '0.75rem',
                  fontSize: '0.8rem',
                }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <IcMapPin /> {location}
                </span>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                  <IcCalendar /> Desde mayo 2024
                </span>
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#38bdf8',
                  }}
                >
                  <IcGithub /> {githubUrl.replace('https://', '')}
                </a>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    color: '#7c8db5',
                  }}
                >
                  <IcLink /> {publicHandle}
                </span>
              </div>
            </div>
          </div>
          <div className="db-page-actions">
            <button
              type="button"
              className="btn-hero-outline"
              onClick={() => navigate('/dashboard')}
            >
              <IcArrowLeft />
              Volver al dashboard
            </button>
          </div>
        </header>

        {loading && (
          <div style={{ marginBottom: '1rem', fontSize: '.8rem', color: 'var(--text-muted)' }}>
            Cargando perfil público…
          </div>
        )}
        {error && (
          <div style={{ marginBottom: '1rem', fontSize: '.8rem', color: 'var(--amber)' }}>
            {error}
          </div>
        )}

        <section className="db-grid" style={{ alignItems: 'flex-start' }}>
          {/* Columna izquierda: resumen + repos */}
          <div className="db-col">
            {/* Resumen breve */}
            <article className="db-card" style={{ marginBottom: '1rem' }}>
              <div className="db-card-hd">
                <div className="db-card-title">Sobre mí</div>
              </div>
              <p
                style={{
                  fontSize: '.86rem',
                  lineHeight: 1.7,
                  color: 'var(--text-muted)',
                }}
              >
                {profile?.bio ||
                  'Desarrollador backend / full stack con foco en APIs limpias, buen diseño de dominios y productos que resuelven problemas reales.'}
              </p>
            </article>

            {/* Repos destacados */}
            <article className="db-card">
              <div className="db-card-hd">
                <div className="db-card-title">
                  <IcGithub /> Repositorios destacados
                </div>
              </div>

              <div className="db-jobs">
                {reposToShow.map((repo) => (
                  <div className="db-job" key={repo.name}>
                    <div className="db-job-logo">
                      {repo.name[0].toUpperCase()}
                    </div>
                    <div className="db-job-info">
                      <div className="db-job-title">{repo.name}</div>
                      <div className="db-job-meta">
                        <span>{repo.lang}</span>
                        {typeof repo.commits === 'number' && (
                          <>
                            <span className="db-dot" />
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '.25rem' }}>
                              <IcActivity /> {repo.commits} commits
                            </span>
                          </>
                        )}
                      </div>
                      <p
                        style={{
                          marginTop: '.3rem',
                          fontSize: '.78rem',
                          color: 'var(--text-muted)',
                          lineHeight: 1.6,
                        }}
                      >
                        {repo.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            {/* Experiencia */}
            <article className="db-card">
              <div className="db-card-hd">
                <div className="db-card-title">Experiencia</div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {EXPERIENCE.map((exp) => (
                  <div key={exp.role}>
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        fontSize: '.8rem',
                        marginBottom: '.25rem',
                      }}
                    >
                      <span style={{ fontWeight: 600 }}>{exp.role}</span>
                      <span style={{ color: 'var(--text-faint)' }}>{exp.period}</span>
                    </div>
                    <div
                      style={{
                        fontSize: '.78rem',
                        color: 'var(--text-muted)',
                        marginBottom: '.35rem',
                      }}
                    >
                      {exp.company}
                    </div>
                    <p
                      style={{
                        fontSize: '.78rem',
                        color: 'var(--text-muted)',
                        lineHeight: 1.6,
                      }}
                    >
                      {exp.desc}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>

          {/* Columna derecha: stats + skills */}
          <div className="db-col">
            {/* Stats rápidos */}
            <article className="db-card">
              <div className="db-card-hd">
                <div className="db-card-title">
                  <IcActivity /> Actividad técnica
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, minmax(0,1fr))',
                  gap: '.75rem',
                }}
              >
                <div
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '.75rem .9rem',
                  }}
                >
                  <div style={{ fontSize: '.72rem', color: 'var(--text-faint)' }}>
                    Repos conectados
                  </div>
                  <div
                    style={{
                      marginTop: '.15rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.35rem',
                    }}
                  >
                    {reposCount}
                  </div>
                  <div style={{ marginTop: '.15rem', fontSize: '.74rem', color: 'var(--text-muted)' }}>
                    base para este perfil
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '.75rem .9rem',
                  }}
                >
                  <div style={{ fontSize: '.72rem', color: 'var(--text-faint)' }}>
                    Skills detectadas
                  </div>
                  <div
                    style={{
                      marginTop: '.15rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.35rem',
                    }}
                  >
                    {distinctSkills}
                  </div>
                  <div style={{ marginTop: '.15rem', fontSize: '.74rem', color: 'var(--text-muted)' }}>
                    lenguajes y stacks
                  </div>
                </div>

                <div
                  style={{
                    background: 'var(--surface-2)',
                    border: '1px solid var(--border)',
                    borderRadius: '10px',
                    padding: '.75rem .9rem',
                  }}
                >
                  <div style={{ fontSize: '.72rem', color: 'var(--text-faint)' }}>
                    Commits totales
                  </div>
                  <div
                    style={{
                      marginTop: '.15rem',
                      fontFamily: 'var(--font-display)',
                      fontWeight: 800,
                      fontSize: '1.35rem',
                    }}
                  >
                    {totalCommits}
                  </div>
                  <div style={{ marginTop: '.15rem', fontSize: '.74rem', color: 'var(--text-muted)' }}>
                    en repos priorizados
                  </div>
                </div>
              </div>
            </article>

            {/* Skills principales */}
            <article className="db-card">
              <div className="db-card-hd">
                <div className="db-card-title">Skills principales</div>
              </div>

              <div className="db-skills">
                {skillsFromStats.map((s) => (
                  <div className="db-skill" key={s.name}>
                    <div className="db-skill-name">
                      {s.name}
                      <span
                        style={{
                          marginLeft: '.35rem',
                          fontSize: '.7rem',
                          color: 'var(--text-faint)',
                        }}
                      >
                        · {s.level}
                      </span>
                    </div>

                    <div className="db-skill-bg">
                      <div
                        className="db-skill-fill db-skill-fill--high"
                        style={{ width: `${s.pct}%` }}
                      />
                    </div>

                    <div className="db-skill-pct db-skill-pct--high">
                      {Math.round(s.pct)}%
                    </div>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </section>
      </main>
    </>
  )
}