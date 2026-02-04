import { SettingsWindow } from './components/SettingsWindow'
import { Sidebar, type SettingsCategory } from './components/Sidebar'
import { useSettingsStore } from './store'

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

function App() {
  const activeCategory = useSettingsStore((state) => state.activeCategory)
  const setActiveCategory = useSettingsStore((state) => state.setActiveCategory)
  const settings = useSettingsStore((state) => state.settings)
  const exportSettings = useSettingsStore((state) => state.exportSettings)

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
        <p className="text-sm text-[#6e6e73] mb-6">
          Settings for {categoryTitles[activeCategory].toLowerCase()} will appear here...
        </p>

        {/* Temporary JSON preview */}
        <div className="mt-auto pt-4 border-t border-[#e5e5e7]">
          <h3 className="text-sm font-medium text-[#1d1d1f] mb-2">JSON Preview</h3>
          <pre className="bg-[#f5f5f7] rounded-lg p-4 text-xs font-mono text-[#1d1d1f] overflow-auto max-h-[200px]">
            {Object.keys(settings).length > 0
              ? exportSettings()
              : '{\n  // Settings will appear here\n}'}
          </pre>
        </div>
      </div>
    </SettingsWindow>
  )
}

export default App
