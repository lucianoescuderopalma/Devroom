// src/__tests__/Navbar.test.jsx
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'

// ── Mocks ─────────────────────────────────────────────────────────────────────
const mockNavigate = vi.fn()
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom')
  return { ...actual, useNavigate: () => mockNavigate }
})

const mockStore = { token: null, user: null, logout: vi.fn() }
vi.mock('../store/authStore', () => ({ useAuthStore: () => mockStore }))

// ── Helper ────────────────────────────────────────────────────────────────────
const renderNavbar = (props = {}) =>
  render(<MemoryRouter><Navbar {...props} /></MemoryRouter>)

// ─────────────────────────────────────────────────────────────────────────────
describe('TC-N01 — Navbar renderiza sin sesión', () => {
  it('muestra botón "Iniciar sesión" y "Entrar con GitHub"', () => {
    renderNavbar()
    expect(screen.getByTestId('btn-login')).toBeTruthy()
    expect(screen.getByTestId('btn-github-login')).toBeTruthy()
  })
})

describe('TC-N02 — Navbar renderiza con sesión activa', () => {
  beforeEach(() => {
    mockStore.token = 'fake-jwt'
    mockStore.user  = { username: 'lescudero', name: 'Luciano', avatarUrl: null }
  })

  it('muestra username y botón de logout', () => {
    renderNavbar()
    expect(screen.getByTestId('navbar-username').textContent).toContain('lescudero')
    expect(screen.getByTestId('btn-logout')).toBeTruthy()
  })

  it('NO muestra botones de login cuando hay sesión', () => {
    renderNavbar()
    expect(screen.queryByTestId('btn-login')).toBeNull()
    expect(screen.queryByTestId('btn-github-login')).toBeNull()
  })
})

describe('TC-N03 — Navbar logo navega a /', () => {
  it('logo contiene enlace a /)', () => {
    renderNavbar()
    const logo = screen.getByTestId('navbar-logo')
    expect(logo.getAttribute('href')).toBe('/')
  })
})

describe('TC-N04 — Navbar logout', () => {
  beforeEach(() => {
    mockStore.token = 'fake-jwt'
    mockStore.user  = { username: 'test', avatarUrl: null }
  })

  it('llama logout y redirige a / al presionar Salir', () => {
    renderNavbar()
    fireEvent.click(screen.getByTestId('btn-logout'))
    expect(mockStore.logout).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/')
  })
})

describe('TC-N05 — Navbar muestra avatar de iniciales sin avatarUrl', () => {
  beforeEach(() => {
    mockStore.token = 'fake-jwt'
    mockStore.user  = { username: 'lescudero', avatarUrl: null }
  })

  it('muestra iniciales "LE"', () => {
    renderNavbar()
    const av = screen.getByTestId('navbar-avatar-initials')
    expect(av.textContent).toBe('LE')
  })
})

describe('TC-N06 — Navbar muestra img cuando hay avatarUrl', () => {
  beforeEach(() => {
    mockStore.token = 'fake-jwt'
    mockStore.user  = { username: 'lescudero', avatarUrl: 'https://github.com/avatar.png' }
  })

  it('renderiza <img> con src correcto', () => {
    renderNavbar()
    const img = screen.getByTestId('navbar-avatar-img')
    expect(img.getAttribute('src')).toBe('https://github.com/avatar.png')
  })
})

describe('TC-N07 — Navbar link Dashboard visible cuando showDashboardLink=true', () => {
  beforeEach(() => {
    mockStore.token = 'fake-jwt'
    mockStore.user  = { username: 'u', avatarUrl: null }
  })

  it('muestra btn-dashboard', () => {
    renderNavbar({ showDashboardLink: true })
    expect(screen.getByTestId('btn-dashboard')).toBeTruthy()
  })

  it('oculta btn-dashboard cuando showDashboardLink=false', () => {
    renderNavbar({ showDashboardLink: false })
    expect(screen.queryByTestId('btn-dashboard')).toBeNull()
  })
})
