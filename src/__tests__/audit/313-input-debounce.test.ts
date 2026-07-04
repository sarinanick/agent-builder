import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Audit 313 - Input debounce', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('should debounce search', () => {
    let count = 0
    let timer: ReturnType<typeof setTimeout> | null = null
    const debounce = (fn: () => void) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(fn, 300)
    }

    for (let i = 0; i < 10; i++) debounce(() => count++)
    expect(count).toBe(0)
    vi.advanceTimersByTime(350)
    expect(count).toBe(1)
  })
})
