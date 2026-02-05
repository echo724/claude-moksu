import { SettingsCard, SettingsCardItem } from '../SettingsContent'
import { SettingsRow } from '../SettingsRow'
import { HelpTooltip } from '../HelpTooltip'
import { SelectField, TextField, NumberField } from '../FormFields'
import { useSettingsStore } from '@/store/settingsStore'
import { getSettingMetadata } from '@/data/settingsMetadata'

export function StatusLineSettings() {
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
        section: 'statusLine' as const,
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
      <SettingsCard title="Status Line">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('statusLine.type').label}
            description={getMetadata('statusLine.type').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('statusLine.type').description}
                example={getMetadata('statusLine.type').example}
              />
            }
          >
            <SelectField
              value={settings.statusLine?.type || ''}
              onChange={(v) => updateNestedSetting('statusLine.type', v)}
              options={getSelectOptions(getMetadata('statusLine.type').enumValues)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('statusLine.command').label}
            description={getMetadata('statusLine.command').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('statusLine.command').description}
                example={getMetadata('statusLine.command').example}
              />
            }
          >
            <TextField
              value={settings.statusLine?.command || ''}
              onChange={(v) => updateNestedSetting('statusLine.command', v)}
              placeholder="e.g., git status --short"
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('statusLine.padding').label}
            description={getMetadata('statusLine.padding').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('statusLine.padding').description}
                example={getMetadata('statusLine.padding').example}
              />
            }
          >
            <NumberField
              value={settings.statusLine?.padding ?? 0}
              onChange={(v) => updateNestedSetting('statusLine.padding', v)}
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>
    </div>
  )
}
