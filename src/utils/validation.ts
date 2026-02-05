import { ClaudeSettingsSchema } from '@/schemas/settings.schema'
import { z } from 'zod'

/**
 * Get the Zod schema for a specific field path
 */
export function getFieldSchema(path: string): z.ZodType | null {
  const keys = path.split('.')
  let schema: z.ZodType = ClaudeSettingsSchema

  for (const key of keys) {
    if (schema instanceof z.ZodObject) {
      const shape = schema.shape
      schema = shape[key]
      if (!schema) return null
    } else if (schema instanceof z.ZodOptional || schema instanceof z.ZodNullable) {
      schema = schema.unwrap()
      if (schema instanceof z.ZodObject) {
        const shape = schema.shape
        schema = shape[key]
        if (!schema) return null
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
    if (!schema) {
      return { valid: true }
    }

    schema.parse(value)
    return { valid: true }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const firstError = error.errors?.[0]
      return {
        valid: false,
        error: firstError?.message || 'Invalid value'
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
