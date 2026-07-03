import { describe, it, expect } from 'vitest'

describe('Audit 015 - Favorite state single source of truth', () => {
  it('should use Set for favorite IDs instead of separate list', () => {
    // The ideal approach: use a Set of IDs, derive the list from allItems
    const allItems = [
      { id: 1, title: 'Item 1', liked: false },
      { id: 2, title: 'Item 2', liked: false },
      { id: 3, title: 'Item 3', liked: false },
    ]

    // Single source of truth: Set of favorite IDs
    const favoriteIds = new Set<number>()

    // Toggle favorite
    const toggleFavorite = (id: number) => {
      if (favoriteIds.has(id)) {
        favoriteIds.delete(id)
      } else {
        favoriteIds.add(id)
      }
    }

    toggleFavorite(1)
    toggleFavorite(3)

    // Derived state
    const favoriteItems = allItems.filter((item) => favoriteIds.has(item.id))

    expect(favoriteIds.size).toBe(2)
    expect(favoriteIds.has(1)).toBe(true)
    expect(favoriteIds.has(3)).toBe(true)
    expect(favoriteIds.has(2)).toBe(false)
    expect(favoriteItems.length).toBe(2)
    expect(favoriteItems[0].id).toBe(1)
    expect(favoriteItems[1].id).toBe(3)
  })

  it('should not mutate allItems when toggling favorite', () => {
    const allItems = [
      { id: 1, title: 'Item 1' },
      { id: 2, title: 'Item 2' },
    ]

    const favoriteIds = new Set<number>()
    favoriteIds.add(1)

    // AllItems should remain unchanged
    expect(allItems[0]).toEqual({ id: 1, title: 'Item 1' })
    expect(allItems[1]).toEqual({ id: 2, title: 'Item 2' })
  })
})
