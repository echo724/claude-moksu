import { SettingsWindow } from './components/SettingsWindow'

function App() {
  return (
    <SettingsWindow
      title="Claude Code Settings"
      sidebar={
        <div className="p-4">
          <p className="text-sm text-gray-500">Sidebar coming soon...</p>
        </div>
      }
    >
      <div className="p-6">
        <h2 className="text-xl font-semibold text-[#1d1d1f] mb-2">General</h2>
        <p className="text-sm text-gray-500">Content coming soon...</p>
      </div>
    </SettingsWindow>
  )
}

export default App
