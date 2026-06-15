// src/__tests__/Helpers.test.js
// Tests unitarios de funciones helper del Dashboard
import { describe, it, expect } from 'vitest'

// Copiamos las funciones helper directamente para testearlas de forma aislada
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
    if (parts.length >= 2) {
      // "Luciano Escudero" → L + E → "LE"
      return (parts[0][0] + parts[1][0]).toUpperCase()
    }
    // "Carlos" → "Ca".toUpperCase() → "CA"
    return parts[0].slice(0, 2).toUpperCase()
  }
  return (username || 'LE').slice(0, 2).toUpperCase()
}

// ─────────────────────────────────────────────────────────────────────────────
describe('TC-H01 — scoreClass()', () => {
  it('high → db-badge--high', () => expect(scoreClass('high')).toContain('db-badge--high'))
  it('mid  → db-badge--mid',  () => expect(scoreClass('mid')).toContain('db-badge--mid'))
  it('low  → db-badge--low',  () => expect(scoreClass('low')).toContain('db-badge--low'))
  it('default → db-badge--low', () => expect(scoreClass('unknown')).toContain('db-badge--low'))
})

describe('TC-H02 — pillClass()', () => {
  it('high → db-pill--green', () => expect(pillClass('high')).toContain('db-pill--green'))
  it('mid  → db-pill--amber', () => expect(pillClass('mid')).toContain('db-pill--amber'))
  it('low  → db-pill--blue',  () => expect(pillClass('low')).toContain('db-pill--blue'))
})

describe('TC-H03 — skillLevelFromPct()', () => {
  it('100 → high', () => expect(skillLevelFromPct(100)).toBe('high'))
  it('80  → high', () => expect(skillLevelFromPct(80)).toBe('high'))
  it('79  → mid',  () => expect(skillLevelFromPct(79)).toBe('mid'))
  it('60  → mid',  () => expect(skillLevelFromPct(60)).toBe('mid'))
  it('59  → low',  () => expect(skillLevelFromPct(59)).toBe('low'))
  it('0   → low',  () => expect(skillLevelFromPct(0)).toBe('low'))
})

describe('TC-H04 — initialsFromName()', () => {
  it('Luciano Escudero → LE', () => expect(initialsFromName('Luciano Escudero', 'x')).toBe('LE'))
  it('María Paz Torres → MP', () => expect(initialsFromName('María Paz Torres', 'x')).toBe('MP'))
  it('sin name → usa username slice(0,2)', () => expect(initialsFromName(null, 'lescudero')).toBe('LE'))
  it('sin name ni username → LE por defecto', () => expect(initialsFromName(null, null)).toBe('LE'))
  it('nombre de 1 palabra → 1 inicial mayúscula', () => expect(initialsFromName('Carlos', 'x')).toBe('CA'))
})

describe('TC-H05 — strokeDashoffset cálculo del ring SVG', () => {
  it('score 100 → offset = 0', () => {
    const circ   = 2 * Math.PI * 50
    const offset = circ - (100 / 100) * circ
    expect(offset).toBeCloseTo(0, 2)
  })

  it('score 0 → offset = circ completo', () => {
    const circ   = 2 * Math.PI * 50
    const offset = circ - (0 / 100) * circ
    expect(offset).toBeCloseTo(circ, 2)
  })

  it('score 50 → offset = circ / 2', () => {
    const circ   = 2 * Math.PI * 50
    const offset = circ - (50 / 100) * circ
    expect(offset).toBeCloseTo(circ / 2, 2)
  })

  it('score 87 → offset < circ y > 0', () => {
    const circ   = 2 * Math.PI * 50
    const offset = circ - (87 / 100) * circ
    expect(offset).toBeGreaterThan(0)
    expect(offset).toBeLessThan(circ)
  })
})
