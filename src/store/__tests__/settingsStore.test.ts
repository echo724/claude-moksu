import { describe, it, expect, beforeEach } from 'vitest'
import { useSettingsStore } from '../settingsStore'

describe('settingsStore', () => {
  beforeEach(() => {
    // Reset store before each test
    useSettingsStore.setState({
      settings: {},
      activeCategory: 'general',
      validationErrors: []
    })
  })

  describe('updateSetting', () => {
    it('should update a top-level setting', () => {
      const { updateSetting, settings } = useSettingsStore.getState()

      updateSetting('model', 'opus')

      expect(useSettingsStore.getState().settings.model).toBe('opus')
    })

    it('should update a boolean setting', () => {
      const { updateSetting } = useSettingsStore.getState()

      updateSetting('respectGitignore', true)

      expect(useSettingsStore.getState().settings.respectGitignore).toBe(true)
    })
  })

  describe('updateNestedSetting', () => {
    it('should update a nested setting', () => {
      const { updateNestedSetting } = useSettingsStore.getState()

      updateNestedSetting('permissions.defaultMode', 'ask')

      expect(useSettingsStore.getState().settings.permissions?.defaultMode).toBe('ask')
    })

    it('should update a deeply nested setting', () => {
      const { updateNestedSetting } = useSettingsStore.getState()

      updateNestedSetting('sandbox.network.allowedDomains', ['example.com'])

      expect(useSettingsStore.getState().settings.sandbox?.network?.allowedDomains).toEqual(['example.com'])
    })

    it('should delete setting when value is empty string', () => {
      const { updateNestedSetting } = useSettingsStore.getState()

      updateNestedSetting('model', 'opus')
      updateNestedSetting('model', '')

      expect(useSettingsStore.getState().settings.model).toBeUndefined()
    })

    it('should delete setting when value is undefined', () => {
      const { updateNestedSetting } = useSettingsStore.getState()

      updateNestedSetting('model', 'opus')
      updateNestedSetting('model', undefined)

      expect(useSettingsStore.getState().settings.model).toBeUndefined()
    })

    it('should delete setting when value is empty array', () => {
      const { updateNestedSetting } = useSettingsStore.getState()

      updateNestedSetting('permissions.allow', ['pattern1'])
      updateNestedSetting('permissions.allow', [])

      expect(useSettingsStore.getState().settings.permissions?.allow).toBeUndefined()
    })
  })

  describe('setActiveCategory', () => {
    it('should change the active category', () => {
      const { setActiveCategory } = useSettingsStore.getState()

      setActiveCategory('permissions')

      expect(useSettingsStore.getState().activeCategory).toBe('permissions')
    })
  })

  describe('validateSettings', () => {
    it('should return true for valid settings', () => {
      const { updateSetting, validateSettings } = useSettingsStore.getState()

      updateSetting('model', 'opus')
      const isValid = validateSettings()

      expect(isValid).toBe(true)
      expect(useSettingsStore.getState().validationErrors).toHaveLength(0)
    })

    it('should return true for empty settings', () => {
      const { validateSettings } = useSettingsStore.getState()

      const isValid = validateSettings()

      expect(isValid).toBe(true)
    })
  })

  describe('exportSettings', () => {
    it('should export settings as JSON string', () => {
      const { updateSetting, exportSettings } = useSettingsStore.getState()

      updateSetting('model', 'opus')
      updateSetting('language', 'en')

      const json = exportSettings()
      const parsed = JSON.parse(json)

      expect(parsed.model).toBe('opus')
      expect(parsed.language).toBe('en')
    })

    it('should clean empty values from export', () => {
      const { updateNestedSetting, exportSettings } = useSettingsStore.getState()

      updateNestedSetting('model', 'opus')
      updateNestedSetting('language', '')

      const json = exportSettings()
      const parsed = JSON.parse(json)

      expect(parsed.model).toBe('opus')
      expect(parsed.language).toBeUndefined()
    })
  })

  describe('importSettings', () => {
    it('should import valid JSON', () => {
      const { importSettings } = useSettingsStore.getState()

      const json = JSON.stringify({ model: 'opus', language: 'en' })
      const success = importSettings(json)

      expect(success).toBe(true)
      expect(useSettingsStore.getState().settings.model).toBe('opus')
      expect(useSettingsStore.getState().settings.language).toBe('en')
    })

    it('should return false for invalid JSON', () => {
      const { importSettings } = useSettingsStore.getState()

      const success = importSettings('invalid json')

      expect(success).toBe(false)
    })

    it('should clear validation errors on successful import', () => {
      const { importSettings, setValidationErrors } = useSettingsStore.getState()

      setValidationErrors([{ path: 'test', message: 'error' }])

      const json = JSON.stringify({ model: 'opus' })
      importSettings(json)

      expect(useSettingsStore.getState().validationErrors).toHaveLength(0)
    })
  })

  describe('resetSettings', () => {
    it('should clear all settings', () => {
      const { updateSetting, resetSettings } = useSettingsStore.getState()

      updateSetting('model', 'opus')
      resetSettings()

      expect(useSettingsStore.getState().settings).toEqual({})
    })

    it('should clear validation errors', () => {
      const { setValidationErrors, resetSettings } = useSettingsStore.getState()

      setValidationErrors([{ path: 'test', message: 'error' }])
      resetSettings()

      expect(useSettingsStore.getState().validationErrors).toHaveLength(0)
    })
  })
})
