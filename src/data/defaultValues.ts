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

// Clean hooks by removing invalid entries (entire handlers/groups, not individual fields)
function cleanHooks(hooks: Record<string, unknown>): Record<string, unknown> | undefined {
  const cleaned: Record<string, unknown> = {}

  for (const [event, groups] of Object.entries(hooks)) {
    if (!Array.isArray(groups)) continue

    const validGroups = groups
      .map((group) => {
        if (!group || typeof group !== 'object') return null
        const g = group as Record<string, unknown>
        const hookHandlers = Array.isArray(g.hooks) ? g.hooks : []

        // Filter out invalid hook handlers (missing required fields)
        const validHooks = hookHandlers.filter((hook) => {
          if (!hook || typeof hook !== 'object') return false
          const h = hook as Record<string, unknown>
          if (h.type === 'command') return typeof h.command === 'string' && h.command.trim() !== ''
          if (h.type === 'prompt' || h.type === 'agent') return typeof h.prompt === 'string' && h.prompt.trim() !== ''
          return false
        })

        if (validHooks.length === 0) return null

        const result: Record<string, unknown> = { hooks: validHooks }
        if (typeof g.matcher === 'string' && g.matcher.trim()) {
          result.matcher = g.matcher.trim()
        }
        return result
      })
      .filter((g): g is Record<string, unknown> => g !== null)

    if (validGroups.length > 0) {
      cleaned[event] = validGroups
    }
  }

  return Object.keys(cleaned).length > 0 ? cleaned : undefined
}

// Helper to clean settings (remove undefined/null/empty values)
export function cleanSettings(settings: ClaudeSettings): Partial<ClaudeSettings> {
  // Pre-process hooks to remove invalid entries before generic cleaning
  const preprocessed = { ...settings } as Record<string, unknown>
  if (preprocessed.hooks && typeof preprocessed.hooks === 'object' && !Array.isArray(preprocessed.hooks)) {
    const cleanedHooks = cleanHooks(preprocessed.hooks as Record<string, unknown>)
    if (cleanedHooks) {
      preprocessed.hooks = cleanedHooks
    } else {
      delete preprocessed.hooks
    }
  }

  const jsonString = JSON.stringify(preprocessed, (_key, value) => {
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
