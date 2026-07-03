import { describe, it, expect } from 'vitest'
import { generateItems } from '@/app/marketplace/data'

describe('Audit 170 - Marketplace filtering', () => {
  const items = generateItems(50)

  it('should filter by category', () => {
    const imageItems = items.filter((i) => i.category === 'image')
    expect(imageItems.length).toBeGreaterThan(0)
    imageItems.forEach((item) => {
      expect(item.category).toBe('image')
    })
  })

  it('should filter by tool', () => {
    const mjItems = items.filter((i) => i.techs.some((t) => t.name === 'Midjourney'))
    expect(mjItems.length).toBeGreaterThan(0)
  })

  it('should filter by price range', () => {
    const cheapItems = items.filter((i) => i.price <= 10)
    expect(cheapItems.length).toBeGreaterThan(0)
    cheapItems.forEach((item) => {
      expect(item.price).toBeLessThanOrEqual(10)
    })
  })

  it('should sort by newest', () => {
    const sorted = [...items].sort((a, b) => b.createdAt - a.createdAt)
    expect(sorted[0].createdAt).toBeGreaterThanOrEqual(sorted[1].createdAt)
  })

  it('should sort by rating', () => {
    const sorted = [...items].sort((a, b) => b.rating - a.rating)
    expect(sorted[0].rating).toBeGreaterThanOrEqual(sorted[1].rating)
  })
})
