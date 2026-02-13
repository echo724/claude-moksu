import type { ReactNode } from 'react'

interface SettingsRowProps {
  label: string
  description?: string
  helpContent?: ReactNode
  children: ReactNode
  error?: string
  stacked?: boolean
}

export function SettingsRow({ label, description, helpContent, children, error, stacked = false }: SettingsRowProps) {
  if (stacked) {
    return (
      <div className="py-3 first:pt-0 last:pb-0">
        <div className="flex items-center gap-1.5 mb-1">
          <label className="text-[13px] font-normal text-[#1d1d1f]">
            {label}
          </label>
          {helpContent}
        </div>
        {description && (
          <p className="text-[11px] text-[#6e6e73] mb-2 leading-tight">
            {description}
          </p>
        )}
        <div>
          {children}
        </div>
        {error && (
          <p className="text-[11px] text-red-500 mt-1">
            {error}
          </p>
        )}
      </div>
    )
  }

  return (
    <div className="py-3 first:pt-0 last:pb-0">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <label className="text-[13px] font-normal text-[#1d1d1f]">
              {label}
            </label>
            {helpContent}
          </div>
          {description && (
            <p className="text-[11px] text-[#6e6e73] mt-0.5 leading-tight">
              {description}
            </p>
          )}
          {error && (
            <p className="text-[11px] text-red-500 mt-1">
              {error}
            </p>
          )}
        </div>
        <div className="flex-shrink-0">
          {children}
        </div>
      </div>
    </div>
  )
}
