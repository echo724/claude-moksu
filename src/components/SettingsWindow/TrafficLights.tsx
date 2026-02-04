interface TrafficLightsProps {
  className?: string
}

export function TrafficLights({ className = '' }: TrafficLightsProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <button
        type="button"
        className="w-3 h-3 rounded-full bg-[#FF5F57] hover:bg-[#FF5F57]/80 transition-colors"
        aria-label="Close"
      />
      <button
        type="button"
        className="w-3 h-3 rounded-full bg-[#FFBD2E] hover:bg-[#FFBD2E]/80 transition-colors"
        aria-label="Minimize"
      />
      <button
        type="button"
        className="w-3 h-3 rounded-full bg-[#28CA41] hover:bg-[#28CA41]/80 transition-colors"
        aria-label="Maximize"
      />
    </div>
  )
}
