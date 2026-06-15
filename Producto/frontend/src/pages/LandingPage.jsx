import React from 'react'
import Navbar from '../components/layout/Navbar.jsx'
import { useNavigate } from 'react-router-dom'
import '../styles/index.css'


/* ─── Icons ─────────────────────────────────────────────────── */
const ArrowRight = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M5 12h14M12 5l7 7-7 7"/>
  </svg>
)
const GithubIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
  </svg>
)
const ShieldIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)


/* ─── Mock Dashboard ─────────────────────────────────────────── */
function MockDashboard() {
  const jobs = [
    { title: 'Backend Engineer · Java', company: 'Falabella Tech · Remoto', match: 92, color: 'high' },
    { title: 'Full Stack Developer',    company: 'Bci Digital · Santiago',  match: 78, color: 'mid'  },
    { title: 'Software Engineer',       company: 'Cornershop · Híbrido',    match: 71, color: 'mid'  },
  ]
  const skills = [
    { name: 'Java',        pct: 92 },
    { name: 'Spring Boot', pct: 88 },
    { name: 'React',       pct: 80 },
    { name: 'TypeScript',  pct: 74 },
  ]
  return (
    <div className="mock-wrap">
      <div className="mock-window">
        <div className="mock-topbar">
          <div className="mock-dots">
            <span className="dot dot-red" />
            <span className="dot dot-yellow" />
            <span className="dot dot-green" />
          </div>
          <span className="mock-url">
            <span className="mock-url-lock">🔒</span> devroom.app/dashboard
          </span>
          <div className="mock-topbar-spacer" />
        </div>
        <div className="mock-body">
          <aside className="mock-sidebar">
            <div className="mock-avatar-wrap">
              <div className="mock-avatar" />
              <div className="mock-online" />
            </div>
            <p className="mock-name">Luciano E.</p>
            <p className="mock-handle">@lescudero · Santiago</p>
            <div className="mock-stat-row">
              <div className="mock-stat"><strong>12</strong><span>repos</span></div>
              <div className="mock-stat-divider" />
              <div className="mock-stat"><strong>7</strong><span>skills</span></div>
            </div>
            <hr className="mock-divider" />
            <p className="mock-label">Top skills</p>
            {skills.map(s => (
              <div key={s.name} className="mock-skill-row">
                <span className="mock-skill-name">{s.name}</span>
                <div className="mock-skill-bar">
                  <div className="mock-skill-fill" style={{ width: `${s.pct}%` }} />
                </div>
              </div>
            ))}
          </aside>
          <main className="mock-main">
            <div className="mock-card">
              <div className="mock-card-header">
                <span className="mock-card-icon">⚡</span>
                <div>
                  <p className="mock-card-title">CV generado por IA</p>
                  <p className="mock-card-sub">12 repositorios · Actualizado hace 2 días</p>
                </div>
                <span className="mock-cv-badge">87%</span>
              </div>
              <div className="mock-bar-bg">
                <div className="mock-bar-fill" style={{ width: '87%' }} />
              </div>
              <div className="mock-bar-labels">
                <span>Completitud del perfil</span>
                <span>87 / 100</span>
              </div>
            </div>
            <div className="mock-card">
              <div className="mock-card-header">
                <span className="mock-card-icon">🎯</span>
                <p className="mock-card-title">Empleos recomendados</p>
              </div>
              {jobs.map(j => (
                <div key={j.title} className="mock-job-row">
                  <div className="mock-job-dot" />
                  <div className="mock-job-info">
                    <p className="mock-job-name">{j.title}</p>
                    <p className="mock-job-co">{j.company}</p>
                  </div>
                  <span className={`mock-badge ${j.color === 'high' ? 'mock-badge-high' : 'mock-badge-mid'}`}>
                    {j.match}%
                  </span>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
      <div className="float-tag float-tag-left"><span>🤖</span> IA activa</div>
      <div className="float-tag float-tag-right"><span>✅</span> CV listo</div>
    </div>
  )
}


/* ─── Features ───────────────────────────────────────────────── */
function Features() {
  const list = [
    { icon: '🤖', title: 'Extracción de skills con IA', featured: true,
      desc: 'Analiza repos automáticamente: lenguajes, frameworks, arquitecturas y tu rol en cada proyecto.',
      tag: 'Núcleo del sistema' },
    { icon: '📄', title: 'CV dinámico', green: true,
      desc: 'Se genera y actualiza solo con cada nuevo proyecto. Exportable a PDF con un clic.',
      tag: 'Auto-actualizado' },
    { icon: '🔗', title: 'Perfil público',
      desc: 'URL pública devroom.app/@tuusuario compartible con reclutadores sin que se registren.' },
    { icon: '💼', title: 'Job Board inteligente',
      desc: 'Empleos ordenados por tu % de compatibilidad real de stack, no por keywords.' },
    { icon: '👥', title: 'Red de desarrolladores',
      desc: 'Sigue devs, explora proyectos y tecnologías sin el ruido de las redes genéricas.' },
    { icon: '🇨🇱', title: 'Foco en LATAM',
      desc: 'Empresas locales, salarios en CLP/USD, contexto chileno y latinoamericano.' },
  ]
  return (
    <section className="features-section" id="features" data-testid="features-section">
      <div className="section-header">
        <p className="section-label">✦ Funcionalidades</p>
        <h2 className="section-title">Todo lo que necesitas en un solo lugar</h2>
        <p className="section-subtitle">Desde el análisis de tus repos hasta la postulación, sin salir de DevRoom.</p>
      </div>
      <div className="features-grid">
        {list.map(f => (
          <div
            key={f.title}
            className={`feature-card${f.featured ? ' feature-card-featured' : ''}${f.green ? ' feature-card-green' : ''}`}
            data-testid="feature-card"
          >
            <div className="feature-icon-wrap">
              <span className="feature-icon">{f.icon}</span>
            </div>
            <h3 className="feature-title">{f.title}</h3>
            <p className="feature-desc">{f.desc}</p>
            {f.tag && (
              <span className={`feature-tag${f.green ? ' feature-tag-green' : ''}`}>{f.tag}</span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}


/* ─── How It Works ───────────────────────────────────────────── */
function HowItWorks() {
  const steps = [
    { n: '01', icon: '🔑', title: 'Conecta tu GitHub',       desc: 'Un clic con OAuth 2.0. Solo repos públicos, sin contraseñas ni acceso a código privado.' },
    { n: '02', icon: '🤖', title: 'La IA analiza tu código', desc: 'En menos de 30s detecta lenguajes, frameworks, arquitecturas y tu nivel de participación.' },
    { n: '03', icon: '📄', title: 'Tu CV se genera solo',    desc: 'PDF y perfil web con competencias reales, proyectos destacados y métricas de actividad.' },
    { n: '04', icon: '🚀', title: 'Postula con un clic',     desc: 'Empleos ordenados por % de match real. Postula con tu CV especializado adjunto.' },
  ]
  return (
    <section className="how-section" id="como-funciona" data-testid="how-section">
      <div className="section-header">
        <p className="section-label">⏱ Cómo funciona</p>
        <h2 className="section-title">De cero a empleado en 4 pasos</h2>
        <p className="section-subtitle">Diseñado para no interrumpir tu flujo de trabajo.</p>
      </div>
      <div className="steps-grid">
        {steps.map((s, i) => (
          <div key={s.n} className="step" data-testid="step">
            <div className="step-head">
              <span className="step-num">{s.n}</span>
              {i < steps.length - 1 && <span className="step-connector" />}
            </div>
            <div className="step-icon-wrap">{s.icon}</div>
            <h3 className="step-title">{s.title}</h3>
            <p className="step-desc">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}


/* ─── Skills Showcase ────────────────────────────────────────── */
function Skills() {
  const skills = [
    { name: 'Java',        pct: 92, level: 'Avanzado'   },
    { name: 'Spring Boot', pct: 88, level: 'Avanzado'   },
    { name: 'React',       pct: 80, level: 'Avanzado'   },
    { name: 'TypeScript',  pct: 74, level: 'Intermedio' },
    { name: 'PostgreSQL',  pct: 70, level: 'Intermedio' },
    { name: 'Docker',      pct: 60, level: 'Intermedio' },
    { name: 'Python',      pct: 50, level: 'Básico'     },
  ]
  return (
    <section className="skills-section" id="ia">
      <div className="skills-visual">
        <div className="skills-card">
          <div className="skills-card-header">
            <span className="skills-card-icon">⚡</span>
            <div>
              <p className="skills-card-title">Skills extraídas automáticamente</p>
              <p className="skills-card-sub">Análisis de 12 repositorios · hace 2 días</p>
            </div>
          </div>
          {skills.map(s => (
            <div key={s.name} className="skill-row">
              <span className="skill-name">{s.name}</span>
              <div className="skill-bar-bg">
                <div
                  className={`skill-bar-fill ${s.pct >= 80 ? 'skill-bar-high' : s.pct >= 60 ? 'skill-bar-mid' : 'skill-bar-low'}`}
                  style={{ width: `${s.pct}%` }}
                />
              </div>
              <span className={`skill-level ${s.level === 'Avanzado' ? 'skill-level-high' : s.level === 'Intermedio' ? 'skill-level-mid' : 'skill-level-low'}`}>
                {s.level}
              </span>
            </div>
          ))}
          <div className="ai-badge"><span>✦</span> Extraído de 12 repositorios por IA</div>
        </div>
      </div>

      <div className="skills-text">
        <p className="section-label">⚡ Inteligencia artificial</p>
        <h2 className="section-title">
          Tu código ya tiene toda la información.<br />
          <span className="amber">Nosotros solo la leemos.</span>
        </h2>
        <p className="skills-desc">No más CVs desactualizados. Cada nuevo repositorio actualiza tu perfil automáticamente, sin que hagas nada.</p>
        <p className="skills-desc">
          Analizamos <code className="code">package.json</code>, <code className="code">pom.xml</code>,{' '}
          <code className="code">requirements.txt</code>, <code className="code">go.mod</code> y más para extraer tu stack real.
        </p>
        <ul className="skills-bullets">
          <li><span className="bullet-check">✓</span> Lenguajes con % de uso real</li>
          <li><span className="bullet-check">✓</span> Frameworks y arquitecturas detectadas</li>
          <li><span className="bullet-check">✓</span> Rol ejercido: autor, reviewer, colaborador</li>
          <li><span className="bullet-check">✓</span> Actualización automática con cada push</li>
        </ul>
        <a href="#" className="btn-hero">Ver mi perfil estimado <ArrowRight /></a>
      </div>
    </section>
  )
}


/* ─── Testimonials ───────────────────────────────────────────── */
function Testimonials() {
  const items = [
    { quote: 'Por fin un perfil que refleja lo que realmente sé hacer. Mi CV anterior no mencionaba ni la mitad de mis proyectos.', name: 'Sebastián M.', role: 'Backend Dev · Santiago', av: 'S' },
    { quote: 'Me llamaron de tres empresas en la primera semana. El match por stack hace que las ofertas sean mucho más relevantes.', name: 'Valentina R.', role: 'Full Stack · Valparaíso', av: 'V' },
    { quote: 'Increíble que detectara que uso Clean Architecture solo leyendo la estructura de mis repos.', name: 'Diego F.', role: 'Software Engineer · Remoto', av: 'D' },
  ]
  return (
    <section className="testimonials-section">
      <div className="section-header">
        <p className="section-label">💬 Testimonios</p>
        <h2 className="section-title">Devs que ya encontraron su próximo paso</h2>
      </div>
      <div className="testimonials-grid">
        {items.map(t => (
          <div key={t.name} className="testimonial-card">
            <p className="testimonial-quote">"{t.quote}"</p>
            <div className="testimonial-author">
              <div className="testimonial-av">{t.av}</div>
              <div>
                <p className="testimonial-name">{t.name}</p>
                <p className="testimonial-role">{t.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}


/* ─── Landing Page ───────────────────────────────────────────── */
export default function LandingPage() {
  const navigate = useNavigate()

  const stats = [
    { n: '30s',  l: 'Tiempo de análisis de tu GitHub' },
    { n: '8+',   l: 'Formatos de dependencias soportados' },
    { n: '100%', l: 'Gratis para desarrolladores' },
  ]

  return (
    <>
      <Navbar />

      {/* ── Hero ── */}
      <section className="hero" data-testid="hero-section">
        <div className="hero-bg" aria-hidden="true">
          <div className="hero-grid" />
          <div className="hero-glow hero-glow-1" />
          <div className="hero-glow hero-glow-2" />
          <div className="hero-glow hero-glow-3" />
        </div>

        <div className="hero-content">
          <span className="hero-badge" data-testid="hero-badge">
            <span className="badge-dot" data-testid="badge-dot" />
            Tu código habla por ti
          </span>

          <h1 className="hero-title" data-testid="hero-title">
            Tu GitHub es tu mejor{' '}
            <span className="amber">currículum</span>
            <br />
            <span className="green">ahora lo saben todos</span>
          </h1>

          <p className="hero-subtitle">
            DevRoom conecta tus repositorios con IA para extraer competencias reales,
            generar tu CV automáticamente y conectarte con empleos que encajan con tu stack.
          </p>

          <div className="hero-actions">
            <button onClick={() => navigate('/auth/github')} className="btn-hero" data-testid="btn-cta-hero">
              <GithubIcon />
              Crear mi perfil gratis
            </button>
            <a href="#como-funciona" className="btn-hero-outline" data-testid="btn-how">
              Ver cómo funciona <ArrowRight />
            </a>
          </div>

          <div className="social-proof">
            <div className="avatar-stack">
              {['av1','av2','av3','av4'].map(c => (
                <div key={c} className={`av ${c}`} />
              ))}
            </div>
            <span>Ya usado por <strong>+200 devs</strong> en Chile y LATAM</span>
          </div>
        </div>

        <MockDashboard />
      </section>

      {/* ── Stats bar ── */}
      <div className="stats-bar" data-testid="stats-bar">
        {stats.map((s, i) => (
          <div key={s.n} className="stat-item" data-testid="stat-item">
            <p className="stat-num">{s.n}</p>
            <p className="stat-label">{s.l}</p>
            {i < stats.length - 1 && <div className="stat-divider" />}
          </div>
        ))}
      </div>

      <Features />
      <HowItWorks />
      <Skills />
      <Testimonials />

      {/* ── CTA Final ── */}
      <section className="cta-section" data-testid="cta-section">
        <div className="cta-glow" aria-hidden="true" />
        <div className="cta-box">
          <span className="cta-badge">✦ Únete ahora</span>
          <h2 className="cta-title">
            Tu próximo empleo empieza en tu{' '}
            <span className="amber">repositorio</span>
          </h2>
          <p className="cta-subtitle">
            Crea tu perfil en segundos con GitHub. Sin formularios, sin CVs manuales.
          </p>
          <button
            onClick={() => navigate('/auth/github')}
            className="btn-hero-lg"
            data-testid="btn-cta-footer"
          >
            <GithubIcon size={20} />
            Entrar con GitHub — es gratis
          </button>
          <p className="cta-note">
            <ShieldIcon /> Solo repositorios públicos · Sin acceso a código privado
          </p>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="footer" data-testid="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <p className="footer-logo">⟨/⟩ DevRoom</p>
            <p className="footer-slogan">Conectando código, potenciando personas.</p>
          </div>
          <nav>
            <ul className="footer-links">
              {['Inicio', 'Funciones', 'Cómo funciona', 'Empleos'].map(l => (
                <li key={l}><a href="#">{l}</a></li>
              ))}
            </ul>
          </nav>
          <p className="footer-copy">© 2026 DevRoom · Proyecto universitario</p>
        </div>
      </footer>
    </>
  )
}