import { describe, it, expect } from 'vitest'

describe('Audit 218 - Edge case: connection rules', () => {
  it('should prevent self-loops', () => {
    const isValid = (source: string, target: string) => source !== target
    expect(isValid('node-1', 'node-1')).toBe(false)
    expect(isValid('node-1', 'node-2')).toBe(true)
  })

  it('should prevent duplicate edges', () => {
    const edges = [{ source: 'a', target: 'b' }]
    const isDuplicate = (s: string, t: string) => edges.some((e) => e.source === s && e.target === t)
    expect(isDuplicate('a', 'b')).toBe(true)
    expect(isDuplicate('a', 'c')).toBe(false)
  })

  it('should validate handle compatibility', () => {
    const handles: Record<string, { in: number; out: number }> = {
      start: { in: 0, out: 1 },
      end: { in: 1, out: 0 },
      agent: { in: 1, out: 1 },
    }

    const canConnect = (src: string, tgt: string) =>
      handles[src].out > 0 && handles[tgt].in > 0

    expect(canConnect('start', 'agent')).toBe(true)
    expect(canConnect('end', 'agent')).toBe(false)
  })
})
