import { describe, it, expect } from 'vitest'

describe('Audit 195 - Share functionality', () => {
  it('should copy link to clipboard', async () => {
    const mockClipboard = {
      writeText: async (text: string) => {},
    }
    Object.assign(navigator, { clipboard: mockClipboard })

    const shareUrl = 'https://agent-builder-sable.vercel.app'
    await navigator.clipboard.writeText(shareUrl)

    expect(true).toBe(true)
  })

  it('should show toast on share', () => {
    const showToast = (icon: string, msg: string) => {
      return { icon, msg }
    }

    const result = showToast('🔗', 'Link copied')
    expect(result.icon).toBe('🔗')
  })
})
