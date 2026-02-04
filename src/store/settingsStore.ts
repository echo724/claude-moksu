import { create } from 'zustand'
import type { ClaudeSettings } from '@/schemas'
import type { SettingsCategory } from '@/components/Sidebar'
import { cleanSettings } from '@/data'
import { claudeSettingsSchema } from '@/schemas/claudeSettings'
import { ZodError } from 'zod'

interface ValidationError {
  path: string
  message: string
}

interface SettingsState {
  // Settings data
  settings: ClaudeSettings

  // UI state
  activeCategory: SettingsCategory

  // Validation state
  validationErrors: ValidationError[]

  // Actions
  updateSetting: <K extends keyof ClaudeSettings>(key: K, value: ClaudeSettings[K]) => void
  updateNestedSetting: (path: string, value: unknown) => void
  setActiveCategory: (category: SettingsCategory) => void
  setValidationErrors: (errors: ValidationError[]) => void
  validateSettings: () => boolean
  resetSettings: () => void
  importSettings: (json: string) => boolean
  exportSettings: () => string
}

// Helper to set a value at a nested path
function setNestedValue(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
  const keys = path.split('.')
  const result = { ...obj }
  let current: Record<string, unknown> = result

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    if (current[key] === undefined || current[key] === null) {
      current[key] = {}
    } else {
      current[key] = { ...(current[key] as Record<string, unknown>) }
    }
    current = current[key] as Record<string, unknown>
  }

  const lastKey = keys[keys.length - 1]

  // If value is undefined/null/empty, delete the key
  if (value === undefined || value === null || value === '' ||
      (Array.isArray(value) && value.length === 0)) {
    delete current[lastKey]
  } else {
    current[lastKey] = value
  }

  return result
}

// Helper to get a value at a nested path
export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const keys = path.split('.')
  let current: unknown = obj

  for (const key of keys) {
    if (current === undefined || current === null) {
      return undefined
    }
    current = (current as Record<string, unknown>)[key]
  }

  return current
}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  // Initial state
  settings: {},
  activeCategory: 'general',
  validationErrors: [],

  // Actions
  updateSetting: (key, value) => {
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: value
      }
    }))
  },

  updateNestedSetting: (path, value) => {
    set((state) => ({
      settings: setNestedValue(state.settings as Record<string, unknown>, path, value) as ClaudeSettings
    }))
  },

  setActiveCategory: (category) => {
    set({ activeCategory: category })
  },

  setValidationErrors: (errors) => {
    set({ validationErrors: errors })
  },

  validateSettings: () => {
    const { settings } = get()
    try {
      claudeSettingsSchema.parse(settings)
      set({ validationErrors: [] })
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const errors = error.errors.map((err) => ({
          path: err.path.join('.'),
          message: err.message
        }))
        set({ validationErrors: errors })
      }
      return false
    }
  },

  resetSettings: () => {
    set({
      settings: {},
      validationErrors: []
    })
  },

  importSettings: (json) => {
    try {
      const parsed = JSON.parse(json)
      set({
        settings: parsed,
        validationErrors: []
      })
      return true
    } catch {
      return false
    }
  },

  exportSettings: () => {
    const { settings } = get()
    const cleaned = cleanSettings(settings)
    return JSON.stringify(cleaned, null, 2)
  }
}))

// Selector hooks for common operations
export const useSettings = () => useSettingsStore((state) => state.settings)
export const useActiveCategory = () => useSettingsStore((state) => state.activeCategory)
export const useValidationErrors = () => useSettingsStore((state) => state.validationErrors)
