import { SettingsCard, SettingsCardItem } from '../SettingsContent'
import { SettingsRow } from '../SettingsRow'
import { HelpTooltip } from '../HelpTooltip'
import { TextField } from '../FormFields'
import { useSettingsStore } from '@/store/settingsStore'
import { getSettingMetadata } from '@/data/settingsMetadata'

export function AttributionSettings() {
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
        type: 'string' as const,
        section: 'attribution' as const,
      }
    }
    return metadata
  }

  return (
    <div className="space-y-4">
      <SettingsCard title="Attribution">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('attribution.commit').label}
            description={getMetadata('attribution.commit').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('attribution.commit').description}
                example={getMetadata('attribution.commit').example}
              />
            }
          >
            <TextField
              value={settings.attribution?.commit || ''}
              onChange={(v) => updateNestedSetting('attribution.commit', v)}
              placeholder="e.g., Co-Authored-By: Claude"
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('attribution.pr').label}
            description={getMetadata('attribution.pr').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('attribution.pr').description}
                example={getMetadata('attribution.pr').example}
              />
            }
          >
            <TextField
              value={settings.attribution?.pr || ''}
              onChange={(v) => updateNestedSetting('attribution.pr', v)}
              placeholder="e.g., Generated with Claude"
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>
    </div>
  )
}
