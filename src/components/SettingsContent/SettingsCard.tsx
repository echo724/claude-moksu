import type { ReactNode } from 'react'

interface SettingsCardProps {
  title?: string
  description?: string
  children: ReactNode
}

export function SettingsCard({ title, description, children }: SettingsCardProps) {
  return (
    <div className="bg-white border border-[#e5e5e7] rounded-lg overflow-hidden">
      {(title || description) && (
        <div className="px-4 py-3 bg-[#fafafa] border-b border-[#e5e5e7]">
          {title && (
            <h3 className="text-[13px] font-medium text-[#1d1d1f]">{title}</h3>
          )}
          {description && (
            <p className="text-[11px] text-[#6e6e73] mt-0.5">{description}</p>
          )}
        </div>
      )}
      <div className="divide-y divide-[#e5e5e7]">
        {children}
      </div>
    </div>
  )
}

// Wrapper for individual settings within a card
interface SettingsCardItemProps {
  children: ReactNode
}

export function SettingsCardItem({ children }: SettingsCardItemProps) {
  return (
    <div className="px-4 py-3">
      {children}
    </div>
  )
}
