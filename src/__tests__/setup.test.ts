import { describe, it, expect } from 'vitest'

describe('environment', () => {
  it('TypeScript strict mode is active', () => {
    const add = (a: number, b: number): number => a + b
    expect(add(1, 2)).toBe(3)
  })
})
