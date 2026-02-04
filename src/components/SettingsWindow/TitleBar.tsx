import { TrafficLights } from './TrafficLights'

interface TitleBarProps {
  title: string
}

export function TitleBar({ title }: TitleBarProps) {
  return (
    <div className="h-[52px] bg-[#f6f6f6] border-b border-[#d5d5d5] flex items-center px-4 select-none">
      <TrafficLights />
      <div className="flex-1 text-center">
        <h1 className="text-[13px] font-medium text-[#1d1d1f]">{title}</h1>
      </div>
      {/* Spacer to balance the traffic lights */}
      <div className="w-[52px]" />
    </div>
  )
}
