import type { ReactNode } from 'react'

interface SettingsContentProps {
  title: string
  description?: string
  children: ReactNode
}

export function SettingsContent({ title, description, children }: SettingsContentProps) {
  return (
    <div className="p-6 h-full overflow-y-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#1d1d1f]">{title}</h2>
        {description && (
          <p className="text-[13px] text-[#6e6e73] mt-1">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-4">
        {children}
      </div>
    </div>
  )
}
