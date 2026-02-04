import { X } from 'lucide-react'

interface TextFieldProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function TextField({
  value,
  onChange,
  placeholder,
  disabled = false,
  className = ''
}: TextFieldProps) {
  const handleClear = () => {
    onChange(undefined)
  }

  return (
    <div className={`relative ${className}`}>
      <input
        type="text"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-full min-w-[200px] h-[26px] px-2 pr-7
          text-[13px] text-[#1d1d1f]
          bg-white border border-[#d5d5d5] rounded-md
          focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
          disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
          placeholder:text-[#9ca3af]
        `}
      />
      {value && !disabled && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
        >
          <X size={14} />
        </button>
      )}
    </div>
  )
}
