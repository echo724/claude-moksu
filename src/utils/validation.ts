import { ClaudeSettingsSchema } from '@/schemas/settings.schema'
import { z } from 'zod'

/**
 * Get the Zod schema for a specific field path
 */
export function getFieldSchema(path: string): unknown {
  const keys = path.split('.')
  let schema: unknown = ClaudeSettingsSchema

  for (const key of keys) {
    // Check if schema is an object schema
    if (schema && typeof schema === 'object' && 'shape' in schema) {
      const shape = (schema as { shape: Record<string, unknown> }).shape
      schema = shape[key]
      if (!schema) return null
    } else if (schema && typeof schema === 'object' && '_zod' in schema) {
      // Handle optional/nullable wrappers in Zod v4
      const innerType = (schema as { _zod: { innerType?: unknown } })._zod?.innerType
      if (innerType && typeof innerType === 'object' && 'shape' in innerType) {
        const shape = (innerType as { shape: Record<string, unknown> }).shape
        schema = shape[key]
        if (!schema) return null
      } else {
        return null
      }
    } else {
      return null
    }
  }

  return schema
}

/**
 * Validate a single field value
 */
export function validateField(path: string, value: unknown): { valid: boolean; error?: string } {
  try {
    const schema = getFieldSchema(path)
    if (!schema || typeof schema !== 'object' || !('parse' in schema)) {
      return { valid: true }
    }

    (schema as { parse: (v: unknown) => unknown }).parse(value)
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstIssue = error.issues?.[0]
      return {
        valid: false,
        error: firstIssue?.message || 'Invalid value'
      }
    }
    return { valid: false, error: 'Invalid value' }
  }
}

/**
 * Format validation error messages for display
 */
export function formatValidationError(error: string): string {
  // Make error messages more user-friendly
  return error
    .replace('Expected', 'Must be')
    .replace('Required', 'This field is required')
    .replace('Invalid', 'Invalid value')
}
