import { SettingsCard, SettingsCardItem } from '../SettingsContent'
import { SettingsRow } from '../SettingsRow'
import { HelpTooltip } from '../HelpTooltip'
import { ToggleField, ArrayField, NumberField } from '../FormFields'
import { useSettingsStore } from '@/store/settingsStore'
import { getSettingMetadata } from '@/data/settingsMetadata'

export function SandboxSettings() {
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
        section: 'sandbox' as const,
      }
    }
    return metadata
  }

  return (
    <div className="space-y-4">
      <SettingsCard title="Sandbox Basics">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('sandbox.enabled').label}
            description={getMetadata('sandbox.enabled').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('sandbox.enabled').description}
              />
            }
          >
            <ToggleField
              value={settings.sandbox?.enabled ?? false}
              onChange={(v) => updateNestedSetting('sandbox.enabled', v)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('sandbox.autoAllowBashIfSandboxed').label}
            description={getMetadata('sandbox.autoAllowBashIfSandboxed').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('sandbox.autoAllowBashIfSandboxed').description}
              />
            }
          >
            <ToggleField
              value={settings.sandbox?.autoAllowBashIfSandboxed ?? false}
              onChange={(v) => updateNestedSetting('sandbox.autoAllowBashIfSandboxed', v)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('sandbox.allowUnsandboxedCommands').label}
            description={getMetadata('sandbox.allowUnsandboxedCommands').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('sandbox.allowUnsandboxedCommands').description}
              />
            }
          >
            <ToggleField
              value={settings.sandbox?.allowUnsandboxedCommands ?? false}
              onChange={(v) => updateNestedSetting('sandbox.allowUnsandboxedCommands', v)}
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>

      <SettingsCard title="Commands">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('sandbox.excludedCommands').label}
            description={getMetadata('sandbox.excludedCommands').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('sandbox.excludedCommands').description}
                example={getMetadata('sandbox.excludedCommands').example}
              />
            }
          >
            <ArrayField
              value={settings.sandbox?.excludedCommands || []}
              onChange={(v) => updateNestedSetting('sandbox.excludedCommands', v)}
              placeholder="Add command to exclude"
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>

      <SettingsCard title="Network">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('sandbox.network.allowedDomains').label}
            description={getMetadata('sandbox.network.allowedDomains').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('sandbox.network.allowedDomains').description}
                example={getMetadata('sandbox.network.allowedDomains').example}
              />
            }
          >
            <ArrayField
              value={settings.sandbox?.network?.allowedDomains || []}
              onChange={(v) => updateNestedSetting('sandbox.network.allowedDomains', v)}
              placeholder="Add allowed domain"
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('httpProxyPort').label}
            description={getMetadata('httpProxyPort').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('httpProxyPort').description}
                example={getMetadata('httpProxyPort').example}
              />
            }
          >
            <NumberField
              value={settings.httpProxyPort ?? 0}
              onChange={(v) => updateNestedSetting('httpProxyPort', v)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('socksProxyPort').label}
            description={getMetadata('socksProxyPort').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('socksProxyPort').description}
                example={getMetadata('socksProxyPort').example}
              />
            }
          >
            <NumberField
              value={settings.socksProxyPort ?? 0}
              onChange={(v) => updateNestedSetting('socksProxyPort', v)}
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>

      <SettingsCard title="Advanced Network">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('allowUnixSockets').label}
            description={getMetadata('allowUnixSockets').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('allowUnixSockets').description}
              />
            }
          >
            <ToggleField
              value={settings.allowUnixSockets ?? false}
              onChange={(v) => updateNestedSetting('allowUnixSockets', v)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('allowAllUnixSockets').label}
            description={getMetadata('allowAllUnixSockets').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('allowAllUnixSockets').description}
              />
            }
          >
            <ToggleField
              value={settings.allowAllUnixSockets ?? false}
              onChange={(v) => updateNestedSetting('allowAllUnixSockets', v)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('allowLocalBinding').label}
            description={getMetadata('allowLocalBinding').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('allowLocalBinding').description}
              />
            }
          >
            <ToggleField
              value={settings.allowLocalBinding ?? false}
              onChange={(v) => updateNestedSetting('allowLocalBinding', v)}
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>

      <SettingsCard title="Docker">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('sandbox.enableWeakerNestedSandbox').label}
            description={getMetadata('sandbox.enableWeakerNestedSandbox').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('sandbox.enableWeakerNestedSandbox').description}
              />
            }
          >
            <ToggleField
              value={settings.sandbox?.enableWeakerNestedSandbox ?? false}
              onChange={(v) => updateNestedSetting('sandbox.enableWeakerNestedSandbox', v)}
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>
    </div>
  )
}
