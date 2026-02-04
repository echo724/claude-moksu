import { useState } from 'react'
import { Plus, X } from 'lucide-react'

interface KeyValueFieldProps {
  value: Record<string, string> | undefined
  onChange: (value: Record<string, string> | undefined) => void
  keyPlaceholder?: string
  valuePlaceholder?: string
  disabled?: boolean
  className?: string
}

export function KeyValueField({
  value = {},
  onChange,
  keyPlaceholder = 'Key',
  valuePlaceholder = 'Value',
  disabled = false,
  className = ''
}: KeyValueFieldProps) {
  const [newKey, setNewKey] = useState('')
  const [newValue, setNewValue] = useState('')

  const entries = Object.entries(value || {})

  const handleAdd = () => {
    const trimmedKey = newKey.trim()
    const trimmedValue = newValue.trim()
    if (!trimmedKey) return

    const newObj = { ...(value || {}), [trimmedKey]: trimmedValue }
    onChange(Object.keys(newObj).length > 0 ? newObj : undefined)
    setNewKey('')
    setNewValue('')
  }

  const handleRemove = (key: string) => {
    const newObj = { ...(value || {}) }
    delete newObj[key]
    onChange(Object.keys(newObj).length > 0 ? newObj : undefined)
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
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={keyPlaceholder}
          disabled={disabled}
          className={`
            w-[120px] h-[26px] px-2
            text-[13px] text-[#1d1d1f] font-mono
            bg-white border border-[#d5d5d5] rounded-md
            focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
            disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
            placeholder:text-[#9ca3af]
          `}
        />
        <span className="text-[#6e6e73]">=</span>
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={valuePlaceholder}
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
          disabled={disabled || !newKey.trim()}
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
      {entries.length > 0 && (
        <div className="flex flex-col gap-1.5">
          {entries.map(([key, val]) => (
            <div
              key={key}
              className={`
                flex items-center gap-2 px-2 py-1
                text-[12px] text-[#1d1d1f]
                bg-[#f5f5f7] border border-[#d5d5d5] rounded-md
              `}
            >
              <code className="font-mono font-medium">{key}</code>
              <span className="text-[#6e6e73]">=</span>
              <code className="font-mono flex-1 truncate">{val}</code>
              {!disabled && (
                <button
                  type="button"
                  onClick={() => handleRemove(key)}
                  className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
