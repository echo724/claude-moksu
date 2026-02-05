import { SettingsWindow } from './components/SettingsWindow'
import { Sidebar, type SettingsCategory } from './components/Sidebar'
import { JsonPreview } from './components/JsonPreview'
import { ActionBar } from './components/ActionBar'
import { useSettingsStore } from './store'
import {
  GeneralSettings,
  PermissionSettings,
  SandboxSettings,
  McpSettings,
  HooksSettings,
  StatusLineSettings,
  AttributionSettings,
  AuthSettings,
} from './components/SettingsSections'
import { useEffect } from 'react'

const categoryTitles: Record<SettingsCategory, string> = {
  general: 'General',
  permissions: 'Permissions',
  sandbox: 'Sandbox',
  mcp: 'MCP Servers',
  hooks: 'Hooks',
  statusLine: 'Status Line',
  attribution: 'Attribution',
  auth: 'Authentication',
}

const sectionComponents: Record<SettingsCategory, React.ComponentType> = {
  general: GeneralSettings,
  permissions: PermissionSettings,
  sandbox: SandboxSettings,
  mcp: McpSettings,
  hooks: HooksSettings,
  statusLine: StatusLineSettings,
  attribution: AttributionSettings,
  auth: AuthSettings,
}

function App() {
  const activeCategory = useSettingsStore((state) => state.activeCategory)
  const setActiveCategory = useSettingsStore((state) => state.setActiveCategory)
  const settings = useSettingsStore((state) => state.settings)
  const exportSettings = useSettingsStore((state) => state.exportSettings)
  const importSettings = useSettingsStore((state) => state.importSettings)
  const validateSettings = useSettingsStore((state) => state.validateSettings)
  const validationErrors = useSettingsStore((state) => state.validationErrors)

  // Validate settings whenever they change
  useEffect(() => {
    validateSettings()
  }, [settings, validateSettings])

  const handleDownload = () => {
    const json = exportSettings()
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'settings.json'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleCopy = async () => {
    const json = exportSettings()
    await navigator.clipboard.writeText(json)
  }

  const hasErrors = validationErrors.length > 0
  const errorMessages = validationErrors.map(
    (err) => `${err.path}: ${err.message}`
  )

  // Debug: log the exported JSON
  const jsonOutput = exportSettings()
  console.log('JSON Output:', jsonOutput)
  console.log('JSON Output length:', jsonOutput?.length)

  return (
    <SettingsWindow
      title="Claude Code Settings"
      sidebar={
        <Sidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />
      }
    >
      <div className="p-6 flex flex-col h-full">
        <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4">
          {categoryTitles[activeCategory]}
        </h2>

        {/* Render active section component */}
        <div className="flex-1 overflow-y-auto pb-4">
          {(() => {
            const SectionComponent = sectionComponents[activeCategory]
            return <SectionComponent />
          })()}
        </div>
      </div>

      {/* JSON Preview Panel */}
      <JsonPreview
        json={jsonOutput}
        validationErrors={errorMessages}
      />

      {/* Action Bar */}
      <ActionBar
        onDownload={handleDownload}
        onCopy={handleCopy}
        onImport={importSettings}
        hasErrors={hasErrors}
      />
    </SettingsWindow>
  )
}

export default App
