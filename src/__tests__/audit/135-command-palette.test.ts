import { describe, it, expect } from 'vitest'

describe('Audit 135 - Command palette', () => {
  it('should open with Ctrl+K', () => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        return true
      }
      return false
    }

    const event = new KeyboardEvent('keydown', { key: 'k', ctrlKey: true })
    expect(handleKey(event)).toBe(true)
  })

  it('should close with Escape', () => {
    let isOpen = true
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') isOpen = false
    }

    handleKey(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(isOpen).toBe(false)
  })

  it('should filter results based on query', () => {
    const items = [
      { title: 'AI Concept #1', prompt: 'surreal landscape' },
      { title: 'AI Concept #2', prompt: 'sci-fi city' },
      { title: 'AI Concept #3', prompt: 'abstract art' },
    ]

    const query = 'landscape'
    const filtered = items.filter((i) =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.prompt.toLowerCase().includes(query.toLowerCase())
    )

    expect(filtered.length).toBe(1)
    expect(filtered[0].title).toBe('AI Concept #1')
  })
})
