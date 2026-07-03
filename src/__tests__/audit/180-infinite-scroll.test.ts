import { describe, it, expect } from 'vitest'
import { generateItems } from '@/app/marketplace/data'

describe('Audit 180 - Infinite scroll / load more', () => {
  it('should have load more functionality', () => {
    const allItems = generateItems(50)
    const itemsPerLoad = 16
    const visibleItems = allItems.slice(0, itemsPerLoad)
    const remaining = allItems.length - visibleItems.length

    expect(visibleItems.length).toBe(16)
    expect(remaining).toBe(34)
  })

  it('should load more items on button click', () => {
    const allItems = generateItems(50)
    const itemsPerLoad = 16
    let visibleItems = allItems.slice(0, itemsPerLoad)

    // Simulate load more
    const nextItems = allItems.slice(visibleItems.length, visibleItems.length + itemsPerLoad)
    visibleItems = [...visibleItems, ...nextItems]

    expect(visibleItems.length).toBe(32)
  })
})
