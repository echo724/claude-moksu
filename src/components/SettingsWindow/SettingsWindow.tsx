import type { ReactNode } from 'react'
import { TitleBar } from './TitleBar'

export interface SettingsWindowProps {
  title: string
  sidebar?: ReactNode
  children: ReactNode
}

export function SettingsWindow({ title, sidebar, children }: SettingsWindowProps) {
  return (
    <div className="w-full min-h-screen flex items-center justify-center p-8 bg-[#e8e8ed]">
      <div
        className="w-full max-w-[960px] h-[720px] bg-white rounded-[10px] overflow-hidden flex flex-col"
        style={{
          boxShadow: `
            0 0 0 1px rgba(0, 0, 0, 0.1),
            0 10px 40px rgba(0, 0, 0, 0.15),
            0 25px 80px rgba(0, 0, 0, 0.1)
          `
        }}
      >
        <TitleBar title={title} />
        <div className="flex-1 flex overflow-hidden">
          {/* Sidebar (optional) */}
          {sidebar && (
            <div className="w-[220px] bg-[#f5f5f7] border-r border-[#d5d5d5] overflow-y-auto">
              {sidebar}
            </div>
          )}
          {/* Content */}
          <div className="flex-1 bg-white overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
