import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('Audit 001 - Project Setup', () => {
  it('should have required test scripts in package.json', () => {
    const pkgPath = join(process.cwd(), 'package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    expect(pkg.scripts.test).toBeDefined()
    expect(pkg.scripts.typecheck).toBeDefined()
  })

  it('should have vitest installed', () => {
    const pkgPath = join(process.cwd(), 'package.json')
    const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
    expect(pkg.devDependencies?.vitest).toBeDefined()
  })
})
