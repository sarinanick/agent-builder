import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Audit 304 - Debounce search', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('should debounce search input', () => {
    let searchCount = 0
    let timer: ReturnType<typeof setTimeout> | null = null

    const debouncedSearch = (query: string) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => { searchCount++ }, 300)
    }

    for (let i = 0; i < 10; i++) {
      debouncedSearch(`query ${i}`)
    }

    expect(searchCount).toBe(0)
    vi.advanceTimersByTime(350)
    expect(searchCount).toBe(1)
  })
})
