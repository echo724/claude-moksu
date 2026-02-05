import { SettingsCard, SettingsCardItem } from '../SettingsContent'
import { SettingsRow } from '../SettingsRow'
import { HelpTooltip } from '../HelpTooltip'
import { TextField, NumberField, ToggleField, SelectField, KeyValueField } from '../FormFields'
import { useSettingsStore } from '@/store/settingsStore'
import { getSettingMetadata } from '@/data/settingsMetadata'

export function GeneralSettings() {
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
        section: 'general' as const,
      }
    }
    return metadata
  }

  // Helper to convert enumValues to select options
  const getSelectOptions = (enumValues?: string[]) => {
    if (!enumValues) return []
    return enumValues.map(value => ({ value, label: value }))
  }

  return (
    <div className="space-y-4">
      <SettingsCard title="Model & Language">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('model').label}
            description={getMetadata('model').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('model').description}
                example={getMetadata('model').example}
              />
            }
          >
            <TextField
              value={settings.model || ''}
              onChange={(v) => updateNestedSetting('model', v)}
              placeholder="e.g., opus, sonnet, haiku"
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('language').label}
            description={getMetadata('language').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('language').description}
                example={getMetadata('language').example}
              />
            }
          >
            <TextField
              value={settings.language || ''}
              onChange={(v) => updateNestedSetting('language', v)}
              placeholder="e.g., en"
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>

      <SettingsCard title="Updates & Behavior">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('autoUpdatesChannel').label}
            description={getMetadata('autoUpdatesChannel').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('autoUpdatesChannel').description}
                example={getMetadata('autoUpdatesChannel').example}
              />
            }
          >
            <SelectField
              value={settings.autoUpdatesChannel || ''}
              onChange={(v) => updateNestedSetting('autoUpdatesChannel', v)}
              options={getSelectOptions(getMetadata('autoUpdatesChannel').enumValues)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('cleanupPeriodDays').label}
            description={getMetadata('cleanupPeriodDays').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('cleanupPeriodDays').description}
                example={getMetadata('cleanupPeriodDays').example}
              />
            }
          >
            <NumberField
              value={settings.cleanupPeriodDays ?? 30}
              onChange={(v) => updateNestedSetting('cleanupPeriodDays', v)}
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>

      <SettingsCard title="Display Options">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('showTurnDuration').label}
            description={getMetadata('showTurnDuration').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('showTurnDuration').description}
              />
            }
          >
            <ToggleField
              value={settings.showTurnDuration ?? false}
              onChange={(v) => updateNestedSetting('showTurnDuration', v)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('spinnerTipsEnabled').label}
            description={getMetadata('spinnerTipsEnabled').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('spinnerTipsEnabled').description}
              />
            }
          >
            <ToggleField
              value={settings.spinnerTipsEnabled ?? true}
              onChange={(v) => updateNestedSetting('spinnerTipsEnabled', v)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('terminalProgressBarEnabled').label}
            description={getMetadata('terminalProgressBarEnabled').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('terminalProgressBarEnabled').description}
              />
            }
          >
            <ToggleField
              value={settings.terminalProgressBarEnabled ?? true}
              onChange={(v) => updateNestedSetting('terminalProgressBarEnabled', v)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('alwaysThinkingEnabled').label}
            description={getMetadata('alwaysThinkingEnabled').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('alwaysThinkingEnabled').description}
              />
            }
          >
            <ToggleField
              value={settings.alwaysThinkingEnabled ?? false}
              onChange={(v) => updateNestedSetting('alwaysThinkingEnabled', v)}
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>

      <SettingsCard title="Paths & Output">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('plansDirectory').label}
            description={getMetadata('plansDirectory').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('plansDirectory').description}
                example={getMetadata('plansDirectory').example}
              />
            }
          >
            <TextField
              value={settings.plansDirectory || ''}
              onChange={(v) => updateNestedSetting('plansDirectory', v)}
              placeholder="e.g., ~/Documents/plans"
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('outputStyle').label}
            description={getMetadata('outputStyle').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('outputStyle').description}
                example={getMetadata('outputStyle').example}
              />
            }
          >
            <SelectField
              value={settings.outputStyle || ''}
              onChange={(v) => updateNestedSetting('outputStyle', v)}
              options={getSelectOptions(getMetadata('outputStyle').enumValues)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('respectGitignore').label}
            description={getMetadata('respectGitignore').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('respectGitignore').description}
              />
            }
          >
            <ToggleField
              value={settings.respectGitignore ?? true}
              onChange={(v) => updateNestedSetting('respectGitignore', v)}
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>

      <SettingsCard title="Advanced">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('apiKeyHelper').label}
            description={getMetadata('apiKeyHelper').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('apiKeyHelper').description}
                example={getMetadata('apiKeyHelper').example}
              />
            }
          >
            <TextField
              value={settings.apiKeyHelper || ''}
              onChange={(v) => updateNestedSetting('apiKeyHelper', v)}
              placeholder="e.g., /path/to/api-key-helper.sh"
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('companyAnnouncements').label}
            description={getMetadata('companyAnnouncements').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('companyAnnouncements').description}
              />
            }
          >
            <ToggleField
              value={settings.companyAnnouncements ?? true}
              onChange={(v) => updateNestedSetting('companyAnnouncements', v)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('env').label}
            description={getMetadata('env').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('env').description}
                example={getMetadata('env').example}
              />
            }
          >
            <KeyValueField
              value={settings.env || {}}
              onChange={(v) => updateNestedSetting('env', v)}
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>
    </div>
  )
}
