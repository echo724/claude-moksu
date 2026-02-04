import type { ReactNode } from 'react'

interface SidebarItemProps {
  icon: ReactNode
  label: string
  isActive?: boolean
  onClick?: () => void
}

export function SidebarItem({ icon, label, isActive = false, onClick }: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left
        transition-colors duration-150
        ${isActive
          ? 'bg-[#0066CC] text-white'
          : 'text-[#1d1d1f] hover:bg-black/5'
        }
      `}
    >
      <span className={`w-5 h-5 flex items-center justify-center ${isActive ? 'text-white' : 'text-[#6e6e73]'}`}>
        {icon}
      </span>
      <span className="text-[13px] font-normal">
        {label}
      </span>
    </button>
  )
}
