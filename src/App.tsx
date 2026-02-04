import { useState } from 'react'
import { SettingsWindow } from './components/SettingsWindow'
import { Sidebar, type SettingsCategory } from './components/Sidebar'

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
  const [activeCategory, setActiveCategory] = useState<SettingsCategory>('general')

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
      <div className="p-6">
        <h2 className="text-xl font-semibold text-[#1d1d1f] mb-4">
          {categoryTitles[activeCategory]}
        </h2>
        <p className="text-sm text-[#6e6e73]">
          Settings for {categoryTitles[activeCategory].toLowerCase()} will appear here...
        </p>
      </div>
    </SettingsWindow>
  )
}

export default App
