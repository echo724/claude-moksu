import {
  Settings,
  Shield,
  Box,
  Plug,
  Webhook,
  BarChart3,
  FileText,
  Key,
  Code,
  Wand2,
  Package
} from 'lucide-react'
import { SidebarItem } from './SidebarItem'
import { useEffect, useRef } from 'react'

export type SettingsCategory =
  | 'general'
  | 'permissions'
  | 'sandbox'
  | 'mcp'
  | 'hooks'
  | 'statusLine'
  | 'attribution'
  | 'auth'
  | 'plugins'

interface SidebarProps {
  activeCategory: SettingsCategory
  onCategoryChange: (category: SettingsCategory) => void
  showJsonPreview: boolean
  onToggleJsonPreview: () => void
  onOpenSkillsBuilder?: () => void
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
  { id: 'plugins', label: 'Plugins', icon: <Package size={18} /> },
  { id: 'hooks', label: 'Hooks', icon: <Webhook size={18} /> },
  { id: 'statusLine', label: 'Status Line', icon: <BarChart3 size={18} /> },
  { id: 'attribution', label: 'Attribution', icon: <FileText size={18} /> },
  { id: 'auth', label: 'Authentication', icon: <Key size={18} /> },
]

export function Sidebar({ activeCategory, onCategoryChange, showJsonPreview, onToggleJsonPreview, onOpenSkillsBuilder }: SidebarProps) {
  const navRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = categories.findIndex(c => c.id === activeCategory)

      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const nextIndex = (currentIndex + 1) % categories.length
        onCategoryChange(categories[nextIndex].id)
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prevIndex = currentIndex === 0 ? categories.length - 1 : currentIndex - 1
        onCategoryChange(categories[prevIndex].id)
      }
    }

    const nav = navRef.current
    nav?.addEventListener('keydown', handleKeyDown)
    return () => nav?.removeEventListener('keydown', handleKeyDown)
  }, [activeCategory, onCategoryChange])

  return (
    <div className="flex flex-col h-full">
      <nav
        ref={navRef}
        className="p-3 flex flex-col gap-0.5"
        role="navigation"
        aria-label="Settings categories"
      >
        {categories.map((category) => (
          <SidebarItem
            key={category.id}
            icon={category.icon}
            label={category.label}
            isActive={activeCategory === category.id}
            onClick={() => onCategoryChange(category.id)}
          />
        ))}
      </nav>

      {/* Bottom section */}
      <div className="mt-auto border-t border-[#d5d5d5] p-3 space-y-0.5">
        {/* Skills Builder */}
        {onOpenSkillsBuilder && (
          <SidebarItem
            icon={<Wand2 size={18} />}
            label="Skills Builder"
            isActive={false}
            onClick={onOpenSkillsBuilder}
          />
        )}

        {/* JSON Preview toggle */}
        <SidebarItem
          icon={<Code size={18} />}
          label="JSON Preview"
          isActive={showJsonPreview}
          onClick={onToggleJsonPreview}
        />
      </div>
    </div>
  )
}
