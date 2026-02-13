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
      const { updateSetting } = useSettingsStore.getState()

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

  describe('persistence', () => {
    it('should persist settings to localStorage after changes', () => {
      const { updateSetting } = useSettingsStore.getState()

      updateSetting('model', 'opus')

      const stored = localStorage.getItem('claude-moksu-settings')
      expect(stored).not.toBeNull()
      const parsed = JSON.parse(stored!)
      expect(parsed.state.settings.model).toBe('opus')
    })

    it('should restore settings from localStorage on init', () => {
      // Pre-populate localStorage with settings
      const storedState = {
        state: { settings: { model: 'sonnet', language: 'en' } },
        version: 1
      }
      localStorage.setItem('claude-moksu-settings', JSON.stringify(storedState))

      // Trigger rehydration
      useSettingsStore.persist.rehydrate()

      expect(useSettingsStore.getState().settings.model).toBe('sonnet')
      expect(useSettingsStore.getState().settings.language).toBe('en')
    })

    it('should handle corrupted localStorage gracefully', () => {
      // Set corrupted data
      localStorage.setItem('claude-moksu-settings', 'not valid json')

      // Should not throw when rehydrating
      expect(() => useSettingsStore.persist.rehydrate()).not.toThrow()
    })

    it('should not persist UI state (activeCategory)', () => {
      const { setActiveCategory, updateSetting } = useSettingsStore.getState()

      updateSetting('model', 'opus')
      setActiveCategory('permissions')

      const stored = localStorage.getItem('claude-moksu-settings')
      const parsed = JSON.parse(stored!)

      // Settings should be persisted
      expect(parsed.state.settings.model).toBe('opus')
      // UI state should not be persisted
      expect(parsed.state.activeCategory).toBeUndefined()
    })

    it('should not persist validationErrors', () => {
      const { setValidationErrors, updateSetting } = useSettingsStore.getState()

      updateSetting('model', 'opus')
      setValidationErrors([{ path: 'test', message: 'error' }])

      const stored = localStorage.getItem('claude-moksu-settings')
      const parsed = JSON.parse(stored!)

      expect(parsed.state.validationErrors).toBeUndefined()
    })

    it('should clear localStorage on resetSettings', () => {
      const { updateSetting, resetSettings } = useSettingsStore.getState()

      updateSetting('model', 'opus')
      resetSettings()

      const stored = localStorage.getItem('claude-moksu-settings')
      const parsed = JSON.parse(stored!)
      expect(parsed.state.settings).toEqual({})
    })
  })

  describe('new settings (v2 update)', () => {
    it('should import and export all new settings correctly', () => {
      const { importSettings, exportSettings } = useSettingsStore.getState()

      const newSettings = {
        prefersReducedMotion: true,
        teammateMode: 'tmux',
        otelHeadersHelper: '/bin/otel.sh',
        '$schema': 'https://code.claude.com/schemas/settings.json',
        fileSuggestion: {
          type: 'command',
          command: '~/.claude/file-suggest.sh'
        },
        spinnerVerbs: {
          mode: 'append',
          verbs: ['Analyzing', 'Processing']
        },
        permissions: {
          allowManagedHooksOnly: true,
          allowManagedPermissionRulesOnly: false
        },
        allowedMcpServers: ['github', 'memory'],
        deniedMcpServers: ['filesystem'],
        strictKnownMarketplaces: ['https://claude.com/marketplace'],
        enabledPlugins: {
          'test-plugin': true,
          'other-plugin': false
        },
        extraKnownMarketplaces: {
          'https://example.com/marketplace': 'Example Marketplace'
        },
        awsAuthRefresh: '~/.aws/refresh.sh',
        awsCredentialExport: '~/.aws/export.sh'
      }

      // Import
      const json = JSON.stringify(newSettings)
      const success = importSettings(json)
      expect(success).toBe(true)

      // Verify all settings were imported
      const state = useSettingsStore.getState().settings
      expect(state.prefersReducedMotion).toBe(true)
      expect(state.teammateMode).toBe('tmux')
      expect(state.otelHeadersHelper).toBe('/bin/otel.sh')
      expect(state.$schema).toBe('https://code.claude.com/schemas/settings.json')
      expect(state.fileSuggestion?.type).toBe('command')
      expect(state.fileSuggestion?.command).toBe('~/.claude/file-suggest.sh')
      expect(state.spinnerVerbs?.mode).toBe('append')
      expect(state.spinnerVerbs?.verbs).toEqual(['Analyzing', 'Processing'])
      expect(state.permissions?.allowManagedHooksOnly).toBe(true)
      expect(state.permissions?.allowManagedPermissionRulesOnly).toBe(false)
      expect(state.allowedMcpServers).toEqual(['github', 'memory'])
      expect(state.deniedMcpServers).toEqual(['filesystem'])
      expect(state.strictKnownMarketplaces).toEqual(['https://claude.com/marketplace'])
      expect(state.enabledPlugins).toEqual({ 'test-plugin': true, 'other-plugin': false })
      expect(state.extraKnownMarketplaces).toEqual({ 'https://example.com/marketplace': 'Example Marketplace' })
      expect(state.awsAuthRefresh).toBe('~/.aws/refresh.sh')
      expect(state.awsCredentialExport).toBe('~/.aws/export.sh')

      // Export and verify
      const exported = exportSettings()
      const exportedParsed = JSON.parse(exported)
      expect(exportedParsed.prefersReducedMotion).toBe(true)
      expect(exportedParsed.teammateMode).toBe('tmux')
      expect(exportedParsed.enabledPlugins).toEqual({ 'test-plugin': true, 'other-plugin': false })
    })
  })
})
