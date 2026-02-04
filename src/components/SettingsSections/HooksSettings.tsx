import { SettingsCard, SettingsCardItem } from '../SettingsContent'
import { SettingsRow } from '../SettingsRow'
import { HelpTooltip } from '../HelpTooltip'
import { ToggleField, TextField } from '../FormFields'
import { useSettingsStore } from '@/store/settingsStore'
import { getSettingMetadata } from '@/data/settingsMetadata'

export function HooksSettings() {
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
        section: 'hooks' as const,
      }
    }
    return metadata
  }

  const hookKeys = [
    'onProjectChange',
    'onToolCall',
    'onUserPromptSubmit',
    'onBackgroundShellStart',
    'onBackgroundShellEnd',
  ] as const

  return (
    <div className="space-y-4">
      <SettingsCard title="Hooks">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('disableAllHooks').label}
            description={getMetadata('disableAllHooks').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('disableAllHooks').description}
              />
            }
          >
            <ToggleField
              value={settings.disableAllHooks ?? false}
              onChange={(v) => updateNestedSetting('disableAllHooks', v)}
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>

      <SettingsCard title="Hook Commands">
        {hookKeys.map((hookKey) => {
          const metadata = getMetadata(`hooks.${hookKey}`)
          return (
            <SettingsCardItem key={hookKey}>
              <SettingsRow
                label={metadata.label}
                description={metadata.description}
                helpContent={
                  <HelpTooltip
                    description={metadata.description}
                    example={metadata.example}
                  />
                }
              >
                <TextField
                  value={settings.hooks?.[hookKey] || ''}
                  onChange={(v) => updateNestedSetting(`hooks.${hookKey}`, v)}
                  placeholder={`e.g., ${metadata.example || 'command'}`}
                />
              </SettingsRow>
            </SettingsCardItem>
          )
        })}
      </SettingsCard>
    </div>
  )
}
