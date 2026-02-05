import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string
  label: string
}

interface SelectFieldProps {
  value: string | undefined
  onChange: (value: string | undefined) => void
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
  className?: string
  allowEmpty?: boolean
}

export function SelectField({
  value,
  onChange,
  options,
  placeholder = 'Select...',
  disabled = false,
  className = '',
  allowEmpty = true
}: SelectFieldProps) {
  return (
    <div className={`relative ${className}`}>
      <select
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value || undefined)}
        disabled={disabled}
        className={`
          w-full min-w-[160px] h-[26px] px-2 pr-7
          text-[13px] text-[#1d1d1f]
          bg-white border border-[#d5d5d5] rounded-md
          focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
          disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
          appearance-none cursor-pointer
        `}
      >
        {allowEmpty && (
          <option key="empty" value="">{placeholder}</option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={14}
        className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6e6e73] pointer-events-none"
      />
    </div>
  )
}
