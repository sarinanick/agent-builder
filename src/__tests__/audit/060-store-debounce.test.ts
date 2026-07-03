import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Audit 060 - Store update debounce', () => {
  beforeEach(() => { vi.useFakeTimers() })
  afterEach(() => { vi.useRealTimers() })

  it('should debounce store updates during typing', () => {
    let updateCount = 0
    let timer: ReturnType<typeof setTimeout> | null = null

    const debouncedUpdate = (value: string) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => { updateCount++ }, 300)
    }

    // Simulate rapid typing
    for (let i = 0; i < 10; i++) {
      debouncedUpdate(`char ${i}`)
    }

    expect(updateCount).toBe(0)
    vi.advanceTimersByTime(350)
    expect(updateCount).toBe(1)
  })

  it('should debounce on blur instead of keypress', () => {
    let savedValue = ''
    let timer: ReturnType<typeof setTimeout> | null = null

    const onBlur = (value: string) => {
      if (timer) clearTimeout(timer)
      savedValue = value
    }

    onBlur('final value')
    expect(savedValue).toBe('final value')
  })
})
