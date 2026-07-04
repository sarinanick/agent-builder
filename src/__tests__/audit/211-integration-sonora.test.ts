import { describe, it, expect } from 'vitest'
import { SONORA_TRACKS, SONORA_GENRES, SONORA_FEATURES } from '@/app/marketplace/data'

describe('Audit 211 - Integration: Sonora data', () => {
  it('should have tracks', () => {
    expect(SONORA_TRACKS.length).toBeGreaterThan(0)
    SONORA_TRACKS.forEach((track) => {
      expect(track.id).toBeDefined()
      expect(track.title).toBeTruthy()
      expect(track.genre).toBeTruthy()
      expect(track.duration).toBeTruthy()
    })
  })

  it('should have genres', () => {
    expect(SONORA_GENRES.length).toBeGreaterThan(0)
  })

  it('should have features', () => {
    expect(SONORA_FEATURES.length).toBeGreaterThan(0)
    SONORA_FEATURES.forEach((feature) => {
      expect(feature.title).toBeTruthy()
      expect(feature.desc).toBeTruthy()
    })
  })
})
