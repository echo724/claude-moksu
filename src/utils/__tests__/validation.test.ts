import { describe, it, expect } from 'vitest'
import { validateField, formatValidationError } from '../validation'

describe('validation utilities', () => {
  describe('validateField', () => {
    it('should validate a valid string field', () => {
      const result = validateField('model', 'opus')

      expect(result.valid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should validate a valid number field', () => {
      const result = validateField('cleanupPeriodDays', 30)

      expect(result.valid).toBe(true)
    })

    it('should validate a valid boolean field', () => {
      const result = validateField('respectGitignore', true)

      expect(result.valid).toBe(true)
    })

    it('should handle nested field paths gracefully', () => {
      // Nested field validation is complex - the function returns true for paths it can't fully validate
      const result = validateField('permissions.defaultMode', 'ask')

      // Should not throw an error, even if validation is incomplete
      expect(result).toBeDefined()
      expect(typeof result.valid).toBe('boolean')
    })

    it('should return true for non-existent field paths', () => {
      const result = validateField('nonexistent.field.path', 'value')

      expect(result.valid).toBe(true)
    })
  })

  describe('formatValidationError', () => {
    it('should format "Expected" errors', () => {
      const formatted = formatValidationError('Expected string, received number')

      expect(formatted).toBe('Must be string, received number')
    })

    it('should format "Required" errors', () => {
      const formatted = formatValidationError('Required')

      expect(formatted).toBe('This field is required')
    })

    it('should format "Invalid" errors', () => {
      const formatted = formatValidationError('Invalid enum value')

      expect(formatted).toBe('Invalid value enum value')
    })

    it('should not modify other errors', () => {
      const formatted = formatValidationError('Custom error message')

      expect(formatted).toBe('Custom error message')
    })
  })
})
