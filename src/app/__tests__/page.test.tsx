/**
 * @jest-environment jsdom
 */

describe('Home Page', () => {
  it('should pass basic smoke test', () => {
    // Basic smoke test to verify Jest is working
    expect(1 + 1).toBe(2)
  })

  it('should have environment variables', () => {
    // Test environment setup
    expect(process.env.NODE_ENV).toBeDefined()
  })
})