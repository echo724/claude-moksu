import { SettingsCard, SettingsCardItem } from '../SettingsContent'
import { SettingsRow } from '../SettingsRow'
import { HelpTooltip } from '../HelpTooltip'
import { SelectField, TextField } from '../FormFields'
import { useSettingsStore } from '@/store/settingsStore'
import { getSettingMetadata } from '@/data/settingsMetadata'

export function AuthSettings() {
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
        section: 'auth' as const,
      }
    }
    return metadata
  }

  return (
    <div className="space-y-4">
      <SettingsCard title="Authentication">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('forceLoginMethod').label}
            description={getMetadata('forceLoginMethod').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('forceLoginMethod').description}
                example={getMetadata('forceLoginMethod').example}
              />
            }
          >
            <SelectField
              value={settings.forceLoginMethod || ''}
              onChange={(v) => updateNestedSetting('forceLoginMethod', v)}
              options={getMetadata('forceLoginMethod').enumValues || []}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('forceLoginOrgUUID').label}
            description={getMetadata('forceLoginOrgUUID').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('forceLoginOrgUUID').description}
                example={getMetadata('forceLoginOrgUUID').example}
              />
            }
          >
            <TextField
              value={settings.forceLoginOrgUUID || ''}
              onChange={(v) => updateNestedSetting('forceLoginOrgUUID', v)}
              placeholder="e.g., 123e4567-e89b-12d3-a456-426614174000"
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>
    </div>
  )
}
