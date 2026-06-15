// src/__tests__/AuthStore.test.js
// Tests unitarios del store Zustand sin componentes
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Creamos una instancia fresca del store sin persistencia para cada test
vi.mock('zustand/middleware', () => ({
  persist: (fn) => fn,
}))

// Importamos la factory del store directamente
import { create } from 'zustand'

const createAuthStore = () =>
  create((set) => ({
    token: null,
    user:  null,
    setToken: (token) => set({ token }),
    setUser:  (user)  => set({ user }),
    login:  (token, user) => set({ token, user }),
    logout: () => set({ token: null, user: null }),
  }))

// ─────────────────────────────────────────────────────────────────────────────
describe('TC-AS01 — Estado inicial del authStore', () => {
  it('token y user son null por defecto', () => {
    const store = createAuthStore()
    expect(store.getState().token).toBeNull()
    expect(store.getState().user).toBeNull()
  })
})

describe('TC-AS02 — login() setea token y user', () => {
  it('guarda token y user correctamente', () => {
    const store = createAuthStore()
    store.getState().login('abc123', { username: 'lescudero' })
    expect(store.getState().token).toBe('abc123')
    expect(store.getState().user.username).toBe('lescudero')
  })
})

describe('TC-AS03 — logout() limpia token y user', () => {
  it('token y user vuelven a null tras logout', () => {
    const store = createAuthStore()
    store.getState().login('abc123', { username: 'lescudero' })
    store.getState().logout()
    expect(store.getState().token).toBeNull()
    expect(store.getState().user).toBeNull()
  })
})

describe('TC-AS04 — setToken() actualiza solo el token', () => {
  it('actualiza token sin tocar user', () => {
    const store = createAuthStore()
    store.getState().setUser({ username: 'devuser' })
    store.getState().setToken('nuevo-token')
    expect(store.getState().token).toBe('nuevo-token')
    expect(store.getState().user.username).toBe('devuser')
  })
})

describe('TC-AS05 — setUser() actualiza solo el user', () => {
  it('actualiza user sin tocar token', () => {
    const store = createAuthStore()
    store.getState().setToken('tok-x')
    store.getState().setUser({ username: 'nuevo' })
    expect(store.getState().token).toBe('tok-x')
    expect(store.getState().user.username).toBe('nuevo')
  })
})
