import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 145 - Avatar group component', () => {
  it('should have overlap effect', () => {
    const avatarPath = join(process.cwd(), 'src/components/ui/AvatarGroup.tsx')
    const content = readFileSync(avatarPath, 'utf-8')
    expect(content).toContain('avatar-group')
    expect(content).toContain('margin-left')
  })

  it('should have hover expand animation', () => {
    const avatarPath = join(process.cwd(), 'src/components/ui/AvatarGroup.tsx')
    const content = readFileSync(avatarPath, 'utf-8')
    expect(content).toContain('hover')
    expect(content).toContain('transition')
  })

  it('should have tooltip on hover', () => {
    const avatarPath = join(process.cwd(), 'src/components/ui/AvatarGroup.tsx')
    const content = readFileSync(avatarPath, 'utf-8')
    expect(content).toContain('Tooltip')
    expect(content).toContain('Radix')
  })
})
