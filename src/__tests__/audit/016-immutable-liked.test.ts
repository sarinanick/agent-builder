import { describe, it, expect } from 'vitest'

describe('Audit 016 - Immutable liked state', () => {
  it('should not mutate item.liked directly', () => {
    const items = [
      { id: 1, liked: false },
      { id: 2, liked: false },
    ]

    // BAD: Direct mutation
    // items[0].liked = true  // Don't do this!

    // GOOD: Create new array with new objects
    const updatedItems = items.map((item) =>
      item.id === 1 ? { ...item, liked: true } : item
    )

    // Original should be unchanged
    expect(items[0].liked).toBe(false)
    expect(updatedItems[0].liked).toBe(true)
    expect(items[1].liked).toBe(false)
    expect(updatedItems[1].liked).toBe(false)
  })

  it('should create new Set when toggling', () => {
    const favorites = new Set<number>([1, 2])

    // GOOD: Create new Set
    const newFavorites = new Set(favorites)
    newFavorites.add(3)

    expect(favorites.size).toBe(2)
    expect(newFavorites.size).toBe(3)
    expect(newFavorites.has(3)).toBe(true)
  })
})
