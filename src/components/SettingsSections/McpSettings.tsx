import { SettingsCard, SettingsCardItem } from '../SettingsContent'
import { SettingsRow } from '../SettingsRow'
import { HelpTooltip } from '../HelpTooltip'
import { ToggleField, ArrayField } from '../FormFields'
import { useSettingsStore } from '@/store/settingsStore'
import { getSettingMetadata } from '@/data/settingsMetadata'

export function McpSettings() {
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
        section: 'mcp' as const,
      }
    }
    return metadata
  }

  return (
    <div className="space-y-4">
      <SettingsCard title="MCP Server Settings">
        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('enableAllProjectMcpServers').label}
            description={getMetadata('enableAllProjectMcpServers').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('enableAllProjectMcpServers').description}
              />
            }
          >
            <ToggleField
              value={settings.enableAllProjectMcpServers ?? false}
              onChange={(v) => updateNestedSetting('enableAllProjectMcpServers', v)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('enabledMcpjsonServers').label}
            description={getMetadata('enabledMcpjsonServers').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('enabledMcpjsonServers').description}
                example={getMetadata('enabledMcpjsonServers').example}
              />
            }
          >
            <ArrayField
              value={settings.enabledMcpjsonServers || []}
              onChange={(v) => updateNestedSetting('enabledMcpjsonServers', v)}
              placeholder="Add enabled MCP server name"
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('disabledMcpjsonServers').label}
            description={getMetadata('disabledMcpjsonServers').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('disabledMcpjsonServers').description}
                example={getMetadata('disabledMcpjsonServers').example}
              />
            }
          >
            <ArrayField
              value={settings.disabledMcpjsonServers || []}
              onChange={(v) => updateNestedSetting('disabledMcpjsonServers', v)}
              placeholder="Add disabled MCP server name"
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('allowedMcpServers').label}
            description={getMetadata('allowedMcpServers').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('allowedMcpServers').description}
                example={getMetadata('allowedMcpServers').example}
              />
            }
          >
            <ArrayField
              value={settings.allowedMcpServers || []}
              onChange={(v) => updateNestedSetting('allowedMcpServers', v)}
              placeholder="Add allowed MCP server name"
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('deniedMcpServers').label}
            description={getMetadata('deniedMcpServers').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('deniedMcpServers').description}
                example={getMetadata('deniedMcpServers').example}
              />
            }
          >
            <ArrayField
              value={settings.deniedMcpServers || []}
              onChange={(v) => updateNestedSetting('deniedMcpServers', v)}
              placeholder="Add denied MCP server name"
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getMetadata('strictKnownMarketplaces').label}
            description={getMetadata('strictKnownMarketplaces').description}
            helpContent={
              <HelpTooltip
                description={getMetadata('strictKnownMarketplaces').description}
                example={getMetadata('strictKnownMarketplaces').example}
              />
            }
          >
            <ArrayField
              value={settings.strictKnownMarketplaces || []}
              onChange={(v) => updateNestedSetting('strictKnownMarketplaces', v)}
              placeholder="Add marketplace URL"
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>
    </div>
  )
}
