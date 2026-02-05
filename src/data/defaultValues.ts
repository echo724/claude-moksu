import type { ClaudeSettings } from '@/schemas'

export const defaultSettings: ClaudeSettings = {
  // All fields are optional, so we start with an empty object
  // Users can add settings as needed
}

// Helper to create a new empty settings object
export function createEmptySettings(): ClaudeSettings {
  return {}
}

// Helper to check if settings object is empty (no meaningful values)
export function isSettingsEmpty(settings: ClaudeSettings): boolean {
  return Object.keys(settings).length === 0
}

// Helper to clean settings (remove undefined/null/empty values)
export function cleanSettings(settings: ClaudeSettings): Partial<ClaudeSettings> {
  const jsonString = JSON.stringify(settings, (_key, value) => {
    // Remove undefined and null values
    if (value === undefined || value === null) return undefined
    // Remove empty strings
    if (typeof value === 'string' && value.trim() === '') return undefined
    // Remove empty arrays
    if (Array.isArray(value) && value.length === 0) return undefined
    // Remove empty objects (but not arrays)
    if (
      typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0
    ) {
      return undefined
    }
    return value
  })

  // Handle case where all values were filtered out
  if (jsonString === undefined || jsonString === 'undefined') {
    return {}
  }

  return JSON.parse(jsonString)
}
