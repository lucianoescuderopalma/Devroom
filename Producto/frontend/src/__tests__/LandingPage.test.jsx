// src/__tests__/LandingPage.test.jsx
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import LandingPage from '../pages/LandingPage.jsx'

// ── Mocks ─────────────────────────────────────────────────────────────────────
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})
vi.mock('../store/authStore', () => ({
  useAuthStore: () => ({ token: null, user: null, logout: vi.fn() })
}))
// Evitar crash por CSS import en test
vi.mock('../styles/index.css', () => ({}))

const renderLanding = () =>
  render(<MemoryRouter><LandingPage /></MemoryRouter>)

// ─────────────────────────────────────────────────────────────────────────────
describe('TC-LP01 — Hero badge visible', () => {
  it('muestra badge "Tu código habla por ti"', () => {
    renderLanding()
    expect(screen.getByTestId('hero-badge').textContent).toContain('Tu código habla por ti')
  })
})

describe('TC-LP02 — Hero title visible', () => {
  it('h1 contiene la palabra "currículum"', () => {
    renderLanding()
    expect(screen.getByTestId('hero-title').textContent).toContain('currículum')
  })
})

describe('TC-LP03 — Hero CTA principal presente', () => {
  it('botón "Crear mi perfil gratis" existe', () => {
    renderLanding()
    expect(screen.getByTestId('btn-cta-hero').textContent).toContain('Crear mi perfil gratis')
  })
})

describe('TC-LP04 — Hero link "Ver cómo funciona"', () => {
  it('link apunta a #como-funciona', () => {
    renderLanding()
    expect(screen.getByTestId('btn-how').getAttribute('href')).toBe('#como-funciona')
  })
})

describe('TC-LP05 — Grid de 6 feature cards', () => {
  it('renderiza exactamente 6 tarjetas de funcionalidades', () => {
    renderLanding()
    expect(screen.getAllByTestId('feature-card').length).toBe(6)
  })
})

describe('TC-LP06 — Sección HowItWorks con 4 pasos', () => {
  it('renderiza exactamente 4 pasos', () => {
    renderLanding()
    expect(screen.getAllByTestId('step').length).toBe(4)
  })
})

describe('TC-LP07 — CTA footer presente', () => {
  it('botón CTA del footer existe', () => {
    renderLanding()
    expect(screen.getByTestId('btn-cta-footer')).toBeTruthy()
  })
})

describe('TC-LP08 — Stats bar con 3 métricas', () => {
  it('renderiza 3 stat-items', () => {
    renderLanding()
    expect(screen.getAllByTestId('stat-item').length).toBe(3)
  })
})

describe('TC-LP09 — Footer presente', () => {
  it('footer contiene texto DevRoom', () => {
    renderLanding()
    expect(screen.getByTestId('footer').textContent).toContain('DevRoom')
  })
})
