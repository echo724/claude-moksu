import { SettingsCard, SettingsCardItem } from '../SettingsContent'
import { SettingsRow } from '../SettingsRow'
import { HelpTooltip } from '../HelpTooltip'
import { ToggleField, HookCommandsField } from '../FormFields'
import { useSettingsStore } from '@/store/settingsStore'
import { getSettingMetadata } from '@/data/settingsMetadata'
import type { HookCommand } from '../FormFields/HookCommandsField'

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
      <SettingsCard title="Hooks Configuration">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('disableAllHooks').label}
            description={getMetadata('disableAllHooks').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('disableAllHooks').description}
                docLink={getMetadata('disableAllHooks').docLink}
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

      <SettingsCard title="Hook Events">
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
                <HookCommandsField
                  value={settings.hooks?.[hookKey]}
                  onChange={(v: HookCommand[] | undefined) => updateNestedSetting(`hooks.${hookKey}`, v)}
                  placeholder={metadata.example || 'e.g., echo "Hook triggered"'}
                />
              </SettingsRow>
            </SettingsCardItem>
          )
        })}
      </SettingsCard>
    </div>
  )
}
