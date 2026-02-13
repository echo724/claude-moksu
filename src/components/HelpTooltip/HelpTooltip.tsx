import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { HelpCircle } from 'lucide-react'

interface HelpTooltipProps {
  description: string
  example?: string
  possibleValues?: string[]
  docLink?: string
}

export function HelpTooltip({ description, example, possibleValues, docLink }: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
  const [arrowPosition, setArrowPosition] = useState<'top' | 'bottom'>('top')
  const buttonRef = useRef<HTMLButtonElement>(null)
  const hideTimeoutRef = useRef<number | null>(null)

  const handleShow = () => {
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current)
      hideTimeoutRef.current = null
    }
    setIsVisible(true)
  }

  const handleHide = () => {
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 100)
  }

  useEffect(() => {
    if (isVisible && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const tooltipWidth = 280
      const tooltipHeight = 150 // Approximate height
      const spacing = 8

      let top = buttonRect.top - tooltipHeight - spacing
      let left = buttonRect.left + buttonRect.width / 2 - tooltipWidth / 2
      let position: 'top' | 'bottom' = 'top'

      // Check if tooltip goes above viewport
      if (top < 10) {
        // Position below button instead
        top = buttonRect.bottom + spacing
        position = 'bottom'
      }

      // Check if tooltip goes out of viewport on the left
      if (left < 10) {
        left = 10
      }

      // Check if tooltip goes out of viewport on the right
      if (left + tooltipWidth > window.innerWidth - 10) {
        left = window.innerWidth - tooltipWidth - 10
      }

      setTooltipPosition({ top, left })
      setArrowPosition(position)
    }
  }, [isVisible])

  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current)
      }
    }
  }, [])

  const tooltipContent = isVisible && (
    <div
      className="fixed z-[9999] w-[280px] p-3 bg-[#1d1d1f] text-white rounded-lg shadow-lg text-[12px] leading-relaxed"
      style={{
        top: `${tooltipPosition.top}px`,
        left: `${tooltipPosition.left}px`,
      }}
      onMouseEnter={handleShow}
      onMouseLeave={handleHide}
    >
      {/* Arrow */}
      {buttonRef.current && (
        <div
          className="absolute"
          style={{
            left: `${buttonRef.current.getBoundingClientRect().left + buttonRef.current.getBoundingClientRect().width / 2 - tooltipPosition.left}px`,
            [arrowPosition === 'top' ? 'bottom' : 'top']: '-6px',
            width: 0,
            height: 0,
            borderLeft: '6px solid transparent',
            borderRight: '6px solid transparent',
            ...(arrowPosition === 'top'
              ? { borderTop: '6px solid #1d1d1f' }
              : { borderBottom: '6px solid #1d1d1f' })
          }}
        />
      )}

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

      {docLink && (
        <div className="mt-2 pt-2 border-t border-white/10">
          <a
            href={docLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:text-blue-300 text-[11px] transition-colors inline-flex items-center gap-1"
          >
            Learn more →
          </a>
        </div>
      )}
    </div>
  )

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
        onMouseEnter={handleShow}
        onMouseLeave={handleHide}
        onFocus={handleShow}
        onBlur={handleHide}
        aria-label="Help"
      >
        <HelpCircle size={14} />
      </button>

      {/* Render tooltip in a portal at document body level */}
      {tooltipContent && createPortal(tooltipContent, document.body)}
    </>
  )
}
