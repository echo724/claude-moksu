import {
  Settings,
  Shield,
  Box,
  Plug,
  Webhook,
  BarChart3,
  FileText,
  Key,
  Code
} from 'lucide-react'
import { SidebarItem } from './SidebarItem'

export type SettingsCategory =
  | 'general'
  | 'permissions'
  | 'sandbox'
  | 'mcp'
  | 'hooks'
  | 'statusLine'
  | 'attribution'
  | 'auth'

interface SidebarProps {
  activeCategory: SettingsCategory
  onCategoryChange: (category: SettingsCategory) => void
}

const categories: Array<{
  id: SettingsCategory
  label: string
  icon: React.ReactNode
}> = [
  { id: 'general', label: 'General', icon: <Settings size={18} /> },
  { id: 'permissions', label: 'Permissions', icon: <Shield size={18} /> },
  { id: 'sandbox', label: 'Sandbox', icon: <Box size={18} /> },
  { id: 'mcp', label: 'MCP Servers', icon: <Plug size={18} /> },
  { id: 'hooks', label: 'Hooks', icon: <Webhook size={18} /> },
  { id: 'statusLine', label: 'Status Line', icon: <BarChart3 size={18} /> },
  { id: 'attribution', label: 'Attribution', icon: <FileText size={18} /> },
  { id: 'auth', label: 'Authentication', icon: <Key size={18} /> },
]

export function Sidebar({ activeCategory, onCategoryChange }: SidebarProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-3 flex flex-col gap-0.5">
        {categories.map((category) => (
          <SidebarItem
            key={category.id}
            icon={category.icon}
            label={category.label}
            isActive={activeCategory === category.id}
            onClick={() => onCategoryChange(category.id)}
          />
        ))}
      </div>

      {/* JSON Preview link at bottom */}
      <div className="mt-auto border-t border-[#d5d5d5] p-3">
        <SidebarItem
          icon={<Code size={18} />}
          label="JSON Preview"
          isActive={false}
          onClick={() => {
            // Scroll to JSON preview section
            const preview = document.getElementById('json-preview')
            preview?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
      </div>
    </div>
  )
}
