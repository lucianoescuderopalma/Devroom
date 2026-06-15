// src/__tests__/Dashboard.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Dashboard from '../pages/Dashboard.jsx'

// ── Mocks ─────────────────────────────────────────────────────────────────────
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockApi = vi.hoisted(() => ({ get: vi.fn(), post: vi.fn() }))
vi.mock('../api/axios', () => ({ default: mockApi }))

const REPOS = [
  { name: 'devroom-backend',  mainLanguage: 'Java',      commits: 142, scoreLevel: 'Alto',  isPrivate: false },
  { name: 'portfolio-react',  mainLanguage: 'TypeScript', commits: 87,  scoreLevel: 'Alto',  isPrivate: false },
  { name: 'ml-classifier',    mainLanguage: 'Python',     commits: 63,  scoreLevel: 'Medio', isPrivate: false },
  { name: 'devroom-frontend', mainLanguage: 'React/JSX',  commits: 210, scoreLevel: 'Alto',  isPrivate: false },
  { name: 'fiber-api',        mainLanguage: 'Go',         commits: 31,  scoreLevel: 'Bajo',  isPrivate: false },
]
const JOBS  = [
  { title: 'Backend Engineer · Java',  companyName: 'Falabella Tech', location: 'Remoto',   salaryRange: '$4.000K CLP' },
  { title: 'Full Stack Developer',      companyName: 'Bci Digital',   location: 'Santiago',  salaryRange: '$3.500K CLP' },
  { title: 'Software Engineer',         companyName: 'Cornershop',    location: 'LATAM',     salaryRange: '$3.800K CLP' },
  { title: 'Java Developer · Fintech',  companyName: 'Ripley Corp',   location: 'Santiago',  salaryRange: '$3.200K CLP' },
]
const STATS = {
  distinctSkills: 6,
  skills: [
    { name: 'Java',        pct: 92 },
    { name: 'Spring Boot', pct: 88 },
    { name: 'React',       pct: 80 },
    { name: 'TypeScript',  pct: 74 },
    { name: 'PostgreSQL',  pct: 70 },
    { name: 'Docker',      pct: 60 },
  ],
}
const CV    = { score: 87, isOnline: true }
const ME    = { username: 'lescudero', name: 'Luciano Escudero', location: 'Santiago' }

const setupApiOk = () => {
  mockApi.get.mockImplementation((url) => {
    if (url === '/api/auth/me')                       return Promise.resolve({ data: ME })
    if (url === '/api/profile/stats')                 return Promise.resolve({ data: STATS })
    if (url === '/api/cv/me')                         return Promise.resolve({ data: CV })
    if (url.includes('/repos'))                       return Promise.resolve({ data: REPOS })
    if (url === '/api/jobs')                          return Promise.resolve({ data: JOBS })
    return Promise.resolve({ data: {} })
  })
}

const renderDashboard = () =>
  render(<MemoryRouter><Dashboard /></MemoryRouter>)

// ─────────────────────────────────────────────────────────────────────────────
describe('TC-DB01 — Dashboard renderiza con datos de la API', () => {
  beforeEach(() => { setupApiOk(); vi.clearAllMocks(); setupApiOk() })

  it('muestra el título de bienvenida con el nombre del usuario', async () => {
    renderDashboard()
    await waitFor(() =>
      expect(screen.getByTestId('page-title').textContent).toContain('Luciano')
    )
  })
})

describe('TC-DB02 — Sidebar contiene todos los items de navegación', () => {
  beforeEach(() => { vi.clearAllMocks(); setupApiOk() })

  it('renderiza los 6 nav items', async () => {
    renderDashboard()
    await waitFor(() =>
      expect(screen.getAllByTestId(/^nav-item-/).length).toBeGreaterThanOrEqual(6)
    )
  })
})

describe('TC-DB03 — KPIs: 4 tarjetas visibles', () => {
  beforeEach(() => { vi.clearAllMocks(); setupApiOk() })

  it('renderiza kpi-repos, kpi-score, kpi-jobs, kpi-cv', async () => {
    renderDashboard()
    await waitFor(() => {
      expect(screen.getByTestId('kpi-repos')).toBeTruthy()
      expect(screen.getByTestId('kpi-score')).toBeTruthy()
      expect(screen.getByTestId('kpi-jobs')).toBeTruthy()
      expect(screen.getByTestId('kpi-cv')).toBeTruthy()
    })
  })
})

describe('TC-DB04 — Tabla de repositorios muestra 5 filas', () => {
  beforeEach(() => { vi.clearAllMocks(); setupApiOk() })

  it('repos-table tiene exactamente 5 filas de datos', async () => {
    renderDashboard()
    await waitFor(() => {
      expect(screen.getAllByTestId('repo-row').length).toBe(5)
    })
  })
})

describe('TC-DB05 — Tabla incluye repo "devroom-backend"', () => {
  beforeEach(() => { vi.clearAllMocks(); setupApiOk() })

  it('el primer repo es devroom-backend', async () => {
    renderDashboard()
    await waitFor(() => {
      const rows = screen.getAllByTestId('repo-row')
      expect(rows[0].textContent).toContain('devroom-backend')
    })
  })
})

describe('TC-DB06 — Jobs list muestra los empleos', () => {
  beforeEach(() => { vi.clearAllMocks(); setupApiOk() })

  it('jobs-list tiene items de empleo', async () => {
    renderDashboard()
    await waitFor(() => {
      expect(screen.getAllByTestId('job-item').length).toBeGreaterThanOrEqual(1)
    })
  })
})

describe('TC-DB07 — Score ring SVG presente', () => {
  beforeEach(() => { vi.clearAllMocks(); setupApiOk() })

  it('cv-score-ring y cv-score-text están en el DOM', async () => {
    renderDashboard()
    await waitFor(() => {
      expect(screen.getByTestId('cv-score-ring')).toBeTruthy()
      expect(screen.getByTestId('cv-score-text').textContent).toBe('87')
    })
  })
})

describe('TC-DB08 — CV checks muestran al menos un ítem ok', () => {
  beforeEach(() => { vi.clearAllMocks(); setupApiOk() })

  it('cv-checks tiene al menos 1 ítem', async () => {
    renderDashboard()
    await waitFor(() => {
      expect(screen.getAllByTestId('cv-check-item').length).toBeGreaterThanOrEqual(1)
    })
  })
})

describe('TC-DB09 — Skills list renderiza las 6 skills', () => {
  beforeEach(() => { vi.clearAllMocks(); setupApiOk() })

  it('skills-list tiene 6 skill-item', async () => {
    renderDashboard()
    await waitFor(() => {
      expect(screen.getAllByTestId('skill-item').length).toBe(6)
    })
  })
})

describe('TC-DB10 — Fallback: sin API usa datos de respaldo', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockApi.get.mockRejectedValue(new Error('network error'))
  })

  it('aun así renderiza el dashboard (usa FALLBACK data)', async () => {
    renderDashboard()
    await waitFor(() =>
      expect(screen.getByTestId('kpi-grid')).toBeTruthy()
    )
  })
})

describe('TC-DB11 — Botón Sincronizar llama a /api/repos/sync', () => {
  beforeEach(() => {
    vi.clearAllMocks(); setupApiOk()
    mockApi.post.mockResolvedValue({ data: { count: 5 } })
  })

  it('presionar btn-sync dispara POST /api/repos/sync', async () => {
    renderDashboard()
    await waitFor(() => screen.getByTestId('btn-sync'))
    fireEvent.click(screen.getByTestId('btn-sync'))
    await waitFor(() =>
      expect(mockApi.post).toHaveBeenCalledWith('/api/repos/sync')
    )
  })
})

describe('TC-DB12 — Botón "Ver CV" navega a /cv', () => {
  beforeEach(() => { vi.clearAllMocks(); setupApiOk() })

  it('click en btn-ver-cv llama navigate("/cv")', async () => {
    renderDashboard()
    await waitFor(() => screen.getByTestId('btn-ver-cv'))
    fireEvent.click(screen.getByTestId('btn-ver-cv'))
    expect(mockNavigate).toHaveBeenCalledWith('/cv')
  })
})

describe('TC-DB13 — Repositorios privados no aparecen en la tabla', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockApi.get.mockImplementation((url) => {
      if (url === '/api/auth/me')     return Promise.resolve({ data: ME })
      if (url === '/api/profile/stats') return Promise.resolve({ data: STATS })
      if (url === '/api/cv/me')       return Promise.resolve({ data: CV })
      if (url.includes('/repos'))     return Promise.resolve({
        data: [...REPOS, { name: 'secreto', mainLanguage: 'Go', commits: 1, scoreLevel: 'Bajo', isPrivate: true }]
      })
      if (url === '/api/jobs')        return Promise.resolve({ data: JOBS })
      return Promise.resolve({ data: {} })
    })
  })

  it('el repo privado "secreto" NO aparece en la tabla', async () => {
    renderDashboard()
    await waitFor(() => {
      const rows = screen.getAllByTestId('repo-row')
      const nombres = rows.map(r => r.textContent)
      expect(nombres.some(n => n.includes('secreto'))).toBe(false)
    })
  })
})

describe('TC-DB14 — Navegación sidebar a /repositorios', () => {
  beforeEach(() => { vi.clearAllMocks(); setupApiOk() })

  it('click en nav-item-Repositorios navega a /repositorios', async () => {
    renderDashboard()
    await waitFor(() => screen.getByTestId('nav-item-Repositorios'))
    fireEvent.click(screen.getByTestId('nav-item-Repositorios'))
    expect(mockNavigate).toHaveBeenCalledWith('/repositorios')
  })
})
