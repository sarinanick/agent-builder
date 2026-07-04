import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 145 - Avatar group component', () => {
  it('should have avatar group class', () => {
    const avatarPath = join(process.cwd(), 'src/components/ui/AvatarGroup.tsx')
    const content = readFileSync(avatarPath, 'utf-8')
    expect(content).toContain('avatar-group')
  })

  it('should use Radix UI Tooltip', () => {
    const avatarPath = join(process.cwd(), 'src/components/ui/AvatarGroup.tsx')
    const content = readFileSync(avatarPath, 'utf-8')
    expect(content).toContain('@radix-ui/react-tooltip')
  })

  it('should have tooltip content with name and role', () => {
    const avatarPath = join(process.cwd(), 'src/components/ui/AvatarGroup.tsx')
    const content = readFileSync(avatarPath, 'utf-8')
    expect(content).toContain('member.name')
    expect(content).toContain('member.role')
  })

  it('should support max prop', () => {
    const avatarPath = join(process.cwd(), 'src/components/ui/AvatarGroup.tsx')
    const content = readFileSync(avatarPath, 'utf-8')
    expect(content).toContain('max')
  })
})
