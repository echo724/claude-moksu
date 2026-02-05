import { SettingsCard, SettingsCardItem } from '../SettingsContent'
import { SettingsRow } from '../SettingsRow'
import { HelpTooltip } from '../HelpTooltip'
import { SelectField, ToggleField, ArrayField } from '../FormFields'
import { useSettingsStore } from '@/store/settingsStore'
import { getSettingMetadata } from '@/data/settingsMetadata'

export function PermissionSettings() {
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
        section: 'permissions' as const,
      }
    }
    return metadata
  }

  const getSelectOptions = (enumValues?: string[]) => {
    if (!enumValues) return []
    return enumValues.map(value => ({ value, label: value }))
  }

  return (
    <div className="space-y-4">
      <SettingsCard title="Permission Mode">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('permissions.defaultMode').label}
            description={getMetadata('permissions.defaultMode').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('permissions.defaultMode').description}
                example={getMetadata('permissions.defaultMode').example}
              />
            }
          >
            <SelectField
              value={settings.permissions?.defaultMode || ''}
              onChange={(v) => updateNestedSetting('permissions.defaultMode', v)}
              options={getSelectOptions(getMetadata('permissions.defaultMode').enumValues)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('permissions.disableBypassPermissionsMode').label}
            description={getMetadata('permissions.disableBypassPermissionsMode').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('permissions.disableBypassPermissionsMode').description}
              />
            }
          >
            <ToggleField
              value={settings.permissions?.disableBypassPermissionsMode ?? false}
              onChange={(v) => updateNestedSetting('permissions.disableBypassPermissionsMode', v)}
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>

      <SettingsCard title="Permission Rules">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('permissions.allow').label}
            description={getMetadata('permissions.allow').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('permissions.allow').description}
                example={getMetadata('permissions.allow').example}
              />
            }
          >
            <ArrayField
              value={settings.permissions?.allow || []}
              onChange={(v) => updateNestedSetting('permissions.allow', v)}
              placeholder="Add allowed permission pattern"
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('permissions.ask').label}
            description={getMetadata('permissions.ask').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('permissions.ask').description}
                example={getMetadata('permissions.ask').example}
              />
            }
          >
            <ArrayField
              value={settings.permissions?.ask || []}
              onChange={(v) => updateNestedSetting('permissions.ask', v)}
              placeholder="Add ask permission pattern"
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('permissions.deny').label}
            description={getMetadata('permissions.deny').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('permissions.deny').description}
                example={getMetadata('permissions.deny').example}
              />
            }
          >
            <ArrayField
              value={settings.permissions?.deny || []}
              onChange={(v) => updateNestedSetting('permissions.deny', v)}
              placeholder="Add denied permission pattern"
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>

      <SettingsCard title="Directories">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('permissions.additionalDirectories').label}
            description={getMetadata('permissions.additionalDirectories').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('permissions.additionalDirectories').description}
                example={getMetadata('permissions.additionalDirectories').example}
              />
            }
          >
            <ArrayField
              value={settings.permissions?.additionalDirectories || []}
              onChange={(v) => updateNestedSetting('permissions.additionalDirectories', v)}
              placeholder="Add directory path"
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>
    </div>
  )
}
