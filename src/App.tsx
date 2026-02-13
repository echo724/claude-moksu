import { SettingsWindow } from './components/SettingsWindow'
import { Sidebar, type SettingsCategory } from './components/Sidebar'
import { JsonPreview } from './components/JsonPreview'
import { ActionBar } from './components/ActionBar'
import { SkillsBuilder } from './components/SkillsBuilder'
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
  PluginsSettings,
} from './components/SettingsSections'
import { useEffect, useState } from 'react'

type AppMode = 'settings' | 'skills'

const categoryTitles: Record<SettingsCategory, string> = {
  general: 'General',
  permissions: 'Permissions',
  sandbox: 'Sandbox',
  mcp: 'MCP Servers',
  plugins: 'Plugins',
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
  plugins: PluginsSettings,
  hooks: HooksSettings,
  statusLine: StatusLineSettings,
  attribution: AttributionSettings,
  auth: AuthSettings,
}

function App() {
  const [appMode, setAppMode] = useState<AppMode>('settings')
  const [showJsonPreview, setShowJsonPreview] = useState(true)

  const activeCategory = useSettingsStore((state) => state.activeCategory)
  const setActiveCategory = useSettingsStore((state) => state.setActiveCategory)
  const settings = useSettingsStore((state) => state.settings)
  const exportSettings = useSettingsStore((state) => state.exportSettings)
  const importSettings = useSettingsStore((state) => state.importSettings)
  const resetSettings = useSettingsStore((state) => state.resetSettings)
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

  const handleReset = () => {
    resetSettings()
  }

  const handleToggleJsonPreview = () => {
    setShowJsonPreview(!showJsonPreview)
  }

  const handleOpenSkillsBuilder = () => {
    setAppMode('skills')
  }

  const handleBackToSettings = () => {
    setAppMode('settings')
  }

  const hasErrors = validationErrors.length > 0
  const errorMessages = validationErrors.map(
    (err) => `${err.path}: ${err.message}`
  )

  const jsonOutput = exportSettings()

  // Render Skills Builder mode
  if (appMode === 'skills') {
    return (
      <SettingsWindow title="Claude Moksu - Skills Builder">
        <SkillsBuilder onBack={handleBackToSettings} />
      </SettingsWindow>
    )
  }

  // Render Settings mode
  return (
    <SettingsWindow
      title="Claude Moksu"
      sidebar={
        <Sidebar
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
          showJsonPreview={showJsonPreview}
          onToggleJsonPreview={handleToggleJsonPreview}
          onOpenSkillsBuilder={handleOpenSkillsBuilder}
        />
      }
    >
      {/* Main content area with fixed layout */}
      <div className="flex flex-col h-full">
        {/* Settings section - scrollable */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4">
              {categoryTitles[activeCategory]}
            </h2>

            {/* Render active section component */}
            {(() => {
              const SectionComponent = sectionComponents[activeCategory]
              return <SectionComponent />
            })()}
          </div>
        </div>

        {/* JSON Preview Panel - fixed at bottom (conditionally rendered) */}
        {showJsonPreview && (
          <JsonPreview
            json={jsonOutput}
            validationErrors={errorMessages}
          />
        )}

        {/* Action Bar - fixed at bottom */}
        <ActionBar
          onDownload={handleDownload}
          onCopy={handleCopy}
          onImport={importSettings}
          onReset={handleReset}
          hasErrors={hasErrors}
        />
      </div>
    </SettingsWindow>
  )
}

export default App
