import { describe, it, expect } from 'vitest'
import { generateItems } from '@/app/marketplace/data'

describe('Audit 209 - Integration: marketplace data', () => {
  it('should generate items with correct structure', () => {
    const items = generateItems(5)
    expect(items.length).toBe(5)

    items.forEach((item) => {
      expect(item.id).toBeDefined()
      expect(item.title).toBeDefined()
      expect(item.prompt).toBeDefined()
      expect(item.techs).toBeDefined()
      expect(item.team).toBeDefined()
      expect(item.rating).toBeDefined()
      expect(item.price).toBeDefined()
    })
  })

  it('should have valid team members', () => {
    const items = generateItems(10)
    items.forEach((item) => {
      expect(item.team.length).toBeGreaterThan(0)
      item.team.forEach((member) => {
        expect(member.name).toBeTruthy()
        expect(member.role).toBeTruthy()
        expect(member.img).toBeDefined()
      })
    })
  })

  it('should have valid tech assignments', () => {
    const items = generateItems(10)
    items.forEach((item) => {
      expect(item.techs.length).toBeGreaterThan(0)
      item.techs.forEach((tech) => {
        expect(tech.name).toBeTruthy()
        expect(tech.icon).toBeTruthy()
        expect(tech.className).toBeTruthy()
      })
    })
  })
})
