// src/__tests__/mocks.js
// Mocks compartidos para todos los test suites

import { vi } from 'vitest'

// ── react-router-dom ─────────────────────────────────────────────────────────
export const mockNavigate = vi.fn()

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  }
})

// ── axios / api ───────────────────────────────────────────────────────────────
export const mockApi = {
  get:  vi.fn(),
  post: vi.fn(),
}

vi.mock('../api/axios', () => ({ default: mockApi }))

// ── zustand authStore ────────────────────────────────────────────────────────
export const mockAuthStore = {
  token:   null,
  user:    null,
  logout:  vi.fn(),
  login:   vi.fn(),
  setToken: vi.fn(),
  setUser:  vi.fn(),
}

vi.mock('../store/authStore', () => ({
  useAuthStore: () => mockAuthStore,
}))

// ── Datos de prueba comunes ───────────────────────────────────────────────────
export const MOCK_USER = {
  username: 'lescudero',
  name: 'Luciano Escudero',
  location: 'Santiago',
  avatarUrl: null,
}

export const MOCK_STATS = {
  distinctSkills: 6,
  skills: [
    { name: 'Java',       pct: 92 },
    { name: 'Spring Boot',pct: 88 },
    { name: 'React',      pct: 80 },
    { name: 'TypeScript', pct: 74 },
    { name: 'PostgreSQL', pct: 70 },
    { name: 'Docker',     pct: 60 },
  ],
}

export const MOCK_CV = {
  score: 87,
  isOnline: true,
}

export const MOCK_REPOS = [
  { name: 'devroom-backend',  mainLanguage: 'Java',       commits: 142, scoreLevel: 'Alto',  isPrivate: false },
  { name: 'portfolio-react',  mainLanguage: 'TypeScript', commits: 87,  scoreLevel: 'Alto',  isPrivate: false },
  { name: 'ml-classifier',    mainLanguage: 'Python',     commits: 63,  scoreLevel: 'Medio', isPrivate: false },
  { name: 'devroom-frontend', mainLanguage: 'React/JSX',  commits: 210, scoreLevel: 'Alto',  isPrivate: false },
  { name: 'fiber-api',        mainLanguage: 'Go',         commits: 31,  scoreLevel: 'Bajo',  isPrivate: false },
]

export const MOCK_JOBS = [
  { title: 'Backend Engineer · Java',  companyName: 'Falabella Tech', location: 'Remoto',  salaryRange: '$4.000K CLP' },
  { title: 'Full Stack Developer',      companyName: 'Bci Digital',    location: 'Santiago', salaryRange: '$3.500K CLP' },
  { title: 'Software Engineer',         companyName: 'Cornershop',     location: 'Remoto LATAM', salaryRange: '$3.800K CLP' },
  { title: 'Java Developer · Fintech',  companyName: 'Ripley Corp',    location: 'Santiago', salaryRange: '$3.200K CLP' },
]
