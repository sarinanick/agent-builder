import { describe, it, expect } from 'vitest'
import { generateItems } from '@/app/marketplace/data'

describe('Audit 155 - Data generation', () => {
  it('should generate correct number of items', () => {
    const items = generateItems(10)
    expect(items.length).toBe(10)
  })

  it('should have required fields', () => {
    const items = generateItems(1)
    const item = items[0]

    expect(item.id).toBeDefined()
    expect(item.seed).toBeDefined()
    expect(item.title).toBeDefined()
    expect(item.prompt).toBeDefined()
    expect(item.techs).toBeDefined()
    expect(item.team).toBeDefined()
    expect(item.rating).toBeDefined()
    expect(item.price).toBeDefined()
  })

  it('should have valid rating range', () => {
    const items = generateItems(50)
    items.forEach((item) => {
      expect(item.rating).toBeGreaterThanOrEqual(3)
      expect(item.rating).toBeLessThanOrEqual(5)
    })
  })

  it('should have valid price range', () => {
    const items = generateItems(50)
    items.forEach((item) => {
      expect(item.price).toBeGreaterThanOrEqual(2)
      expect(item.price).toBeLessThanOrEqual(47)
    })
  })
})
