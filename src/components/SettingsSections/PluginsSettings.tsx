import { SettingsCard, SettingsCardItem } from '../SettingsContent'
import { SettingsRow } from '../SettingsRow'
import { HelpTooltip } from '../HelpTooltip'
import { KeyValueField } from '../FormFields'
import { useSettingsStore } from '@/store/settingsStore'
import { getSettingMetadata } from '@/data/settingsMetadata'

export function PluginsSettings() {
  const settings = useSettingsStore((state) => state.settings)
  const updateNestedSetting = useSettingsStore((state) => state.updateNestedSetting)

  const getMetadata = (key: string) => {
    const metadata = getSettingMetadata(key)
    if (!metadata) {
      console.warn(`Metadata not found for key: ${key}`)
      return {
        key,
        label: key,
        description: '',
        type: 'object' as const,
        section: 'plugins' as const,
      }
    }
    return metadata
  }

  // Convert boolean values to strings for the UI
  const enabledPluginsAsStrings = Object.entries(settings.enabledPlugins || {}).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: String(value) }),
    {} as Record<string, string>
  )

  // Convert strings back to booleans when updating
  const handleEnabledPluginsChange = (value: Record<string, string> | undefined) => {
    if (!value) {
      updateNestedSetting('enabledPlugins', undefined)
      return
    }
    const asBoolean = Object.entries(value).reduce(
      (acc, [key, val]) => ({ ...acc, [key]: val === 'true' }),
      {} as Record<string, boolean>
    )
    updateNestedSetting('enabledPlugins', asBoolean)
  }

  return (
    <div className="space-y-4">
      <SettingsCard title="Plugins">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('enabledPlugins').label}
            description={getMetadata('enabledPlugins').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('enabledPlugins').description}
                example={getMetadata('enabledPlugins').example}
              />
            }
          >
            <KeyValueField
              value={enabledPluginsAsStrings}
              onChange={handleEnabledPluginsChange}
              keyPlaceholder="plugin-name"
              valuePlaceholder="true"
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('extraKnownMarketplaces').label}
            description={getMetadata('extraKnownMarketplaces').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('extraKnownMarketplaces').description}
                example={getMetadata('extraKnownMarketplaces').example}
              />
            }
          >
            <KeyValueField
              value={settings.extraKnownMarketplaces || {}}
              onChange={(v) => updateNestedSetting('extraKnownMarketplaces', v)}
              keyPlaceholder="https://example.com/marketplace"
              valuePlaceholder="Example Marketplace"
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>
    </div>
  )
}
