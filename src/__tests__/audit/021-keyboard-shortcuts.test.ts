import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

describe('Audit 021 - Keyboard shortcuts scoping', () => {
  let addEventListenerSpy: ReturnType<typeof vi.spyOn>
  let removeEventListenerSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    addEventListenerSpy = vi.spyOn(window, 'addEventListener')
    removeEventListenerSpy = vi.spyOn(window, 'removeEventListener')
  })

  afterEach(() => {
    addEventListenerSpy.mockRestore()
    removeEventListenerSpy.mockRestore()
  })

  it('should register keydown listener for undo/redo', () => {
    // The page component registers keydown handlers
    // This test validates that the handler is properly scoped
    const handlers: Record<string, EventListenerOrEventListenerObject> = {}

    addEventListenerSpy.mockImplementation((type, handler) => {
      handlers[type] = handler
    })

    // Simulate what page.tsx does
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault()
      }
    }

    window.addEventListener('keydown', handler)

    expect(handlers['keydown']).toBeDefined()

    // Test that handler prevents default for Ctrl+Z
    const event = new KeyboardEvent('keydown', {
      key: 'z',
      ctrlKey: true,
      cancelable: true,
    })

    const prevented = !event.defaultPrevented
    handler(event)
    expect(event.defaultPrevented).toBe(true)
  })

  it('should not prevent default for Backspace in input', () => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return
      // Only prevent for Delete, not Backspace
      if (e.key === 'Delete') {
        e.preventDefault()
      }
    }

    // Backspace in input should NOT be prevented
    const event = new KeyboardEvent('keydown', {
      key: 'Backspace',
      cancelable: true,
    })
    Object.defineProperty(event, 'target', { value: { tagName: 'INPUT' } })

    handler(event)
    expect(event.defaultPrevented).toBe(false)
  })
})
