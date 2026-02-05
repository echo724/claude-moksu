import { useState, useRef, useEffect } from 'react'
import { HelpCircle } from 'lucide-react'

interface HelpTooltipProps {
  description: string
  example?: string
  possibleValues?: string[]
}

export function HelpTooltip({ description, example, possibleValues }: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [position, setPosition] = useState<'top' | 'bottom'>('top')
  const tooltipRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (isVisible && tooltipRef.current && buttonRef.current) {
      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const buttonRect = buttonRef.current.getBoundingClientRect()

      // Check if tooltip would go out of viewport at the top
      if (tooltipRect.top < 0) {
        setPosition('bottom')
      } else {
        setPosition('top')
      }
    }
  }, [isVisible])

  return (
    <div className="relative inline-flex">
      <button
        ref={buttonRef}
        type="button"
        className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-label="Help"
      >
        <HelpCircle size={14} />
      </button>

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`
            absolute z-50 left-1/2 -translate-x-1/2
            w-[280px] p-3
            bg-[#1d1d1f] text-white rounded-lg shadow-lg
            text-[12px] leading-relaxed
            ${position === 'top' ? 'bottom-full mb-2' : 'top-full mt-2'}
          `}
        >
          {/* Arrow */}
          <div
            className={`absolute left-1/2 -translate-x-1/2 ${
              position === 'top' ? 'top-full -mt-px' : 'bottom-full -mb-px'
            }`}
            style={{
              width: 0,
              height: 0,
              borderLeft: '6px solid transparent',
              borderRight: '6px solid transparent',
              ...(position === 'top'
                ? { borderTop: '6px solid #1d1d1f' }
                : { borderBottom: '6px solid #1d1d1f' })
            }}
          />

          {/* Content */}
          <p className="text-[#f5f5f7]">{description}</p>

          {example && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <span className="text-[#6e6e73] text-[11px]">Example:</span>
              <code className="block mt-0.5 font-mono text-[#34C759] text-[11px]">
                {example}
              </code>
            </div>
          )}

          {possibleValues && possibleValues.length > 0 && (
            <div className="mt-2 pt-2 border-t border-white/10">
              <span className="text-[#6e6e73] text-[11px]">Possible values:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {possibleValues.map((value) => (
                  <code
                    key={value}
                    className="px-1.5 py-0.5 bg-white/10 rounded text-[11px] font-mono"
                  >
                    {value}
                  </code>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
