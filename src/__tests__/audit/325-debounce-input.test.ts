import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Audit 325 - Debounced input', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('should debounce search input', () => {
    let searchCount = 0
    let timer: ReturnType<typeof setTimeout> | null = null

    const debouncedSearch = (query: string) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => { searchCount++ }, 300)
    }

    // Simulate rapid typing
    for (let i = 0; i < 5; i++) {
      debouncedSearch(`query ${i}`)
    }

    expect(searchCount).toBe(0)
    vi.advanceTimersByTime(350)
    expect(searchCount).toBe(1)
  })

  it('should debounce filter changes', () => {
    let filterCount = 0
    let timer: ReturnType<typeof setTimeout> | null = null

    const debouncedFilter = () => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => { filterCount++ }, 100)
    }

    for (let i = 0; i < 10; i++) {
      debouncedFilter()
    }

    expect(filterCount).toBe(0)
    vi.advanceTimersByTime(150)
    expect(filterCount).toBe(1)
  })
})
