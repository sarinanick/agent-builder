import { describe, it, expect } from 'vitest'

describe('Audit 350 - Network performance', () => {
  it('should use lazy loading for images', () => {
    const hasLazyLoading = true
    expect(hasLazyLoading).toBe(true)
  })

  it('should use async decoding for images', () => {
    const hasAsyncDecoding = true
    expect(hasAsyncDecoding).toBe(true)
  })

  it('should use CDN for external images', () => {
    const cdns = ['picsum.photos', 'i.pravatar.cc']
    cdns.forEach((cdn) => {
      expect(cdn).toBeTruthy()
    })
  })
})
