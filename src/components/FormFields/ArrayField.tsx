import { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface ArrayFieldProps {
  value: string[] | undefined
  onChange: (value: string[] | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function ArrayField({
  value = [],
  onChange,
  placeholder = 'Add item...',
  disabled = false,
  className = ''
}: ArrayFieldProps) {
  const [inputValue, setInputValue] = useState('')

  const handleAdd = () => {
    const trimmed = inputValue.trim()
    if (!trimmed) return
    const newValue = [...(value || []), trimmed]
    onChange(newValue.length > 0 ? newValue : undefined)
    setInputValue('')
  }

  const handleRemove = (index: number) => {
    const newValue = (value || []).filter((_, i) => i !== index)
    onChange(newValue.length > 0 ? newValue : undefined)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Input row */}
      <div className="flex items-center gap-2 mb-2">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            flex-1 h-[26px] px-2
            text-[13px] text-[#1d1d1f]
            bg-white border border-[#d5d5d5] rounded-md
            focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
            disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
            placeholder:text-[#9ca3af]
          `}
        />
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled || !inputValue.trim()}
          className={`
            h-[26px] px-2 flex items-center gap-1
            text-[12px] font-medium text-[#0066CC]
            bg-[#f5f5f7] border border-[#d5d5d5] rounded-md
            hover:bg-[#e5e5e7]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          `}
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {/* Items list */}
      {value && value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((item, index) => (
            <span
              key={index}
              className={`
                inline-flex items-center gap-1 px-2 py-0.5
                text-[12px] text-[#1d1d1f]
                bg-[#f5f5f7] border border-[#d5d5d5] rounded-md
              `}
            >
              <code className="font-mono">{item}</code>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                >
                  <X size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
