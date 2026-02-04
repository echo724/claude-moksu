import { Minus, Plus } from 'lucide-react'

interface NumberFieldProps {
  value: number | undefined
  onChange: (value: number | undefined) => void
  min?: number
  max?: number
  step?: number
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function NumberField({
  value,
  onChange,
  min,
  max,
  step = 1,
  placeholder,
  disabled = false,
  className = ''
}: NumberFieldProps) {
  const handleIncrement = () => {
    const newValue = (value ?? min ?? 0) + step
    if (max !== undefined && newValue > max) return
    onChange(newValue)
  }

  const handleDecrement = () => {
    const newValue = (value ?? min ?? 0) - step
    if (min !== undefined && newValue < min) return
    onChange(newValue)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (inputValue === '') {
      onChange(undefined)
      return
    }
    const numValue = parseFloat(inputValue)
    if (!isNaN(numValue)) {
      onChange(numValue)
    }
  }

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <button
        type="button"
        onClick={handleDecrement}
        disabled={disabled || (min !== undefined && (value ?? 0) <= min)}
        className={`
          w-[26px] h-[26px] flex items-center justify-center
          bg-[#f5f5f7] border border-[#d5d5d5] rounded-md
          text-[#6e6e73] hover:bg-[#e5e5e7] hover:text-[#1d1d1f]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        `}
      >
        <Minus size={14} />
      </button>
      <input
        type="number"
        value={value ?? ''}
        onChange={handleChange}
        min={min}
        max={max}
        step={step}
        placeholder={placeholder}
        disabled={disabled}
        className={`
          w-[80px] h-[26px] px-2 text-center
          text-[13px] text-[#1d1d1f]
          bg-white border border-[#d5d5d5] rounded-md
          focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
          disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
          placeholder:text-[#9ca3af]
          [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none
        `}
      />
      <button
        type="button"
        onClick={handleIncrement}
        disabled={disabled || (max !== undefined && (value ?? 0) >= max)}
        className={`
          w-[26px] h-[26px] flex items-center justify-center
          bg-[#f5f5f7] border border-[#d5d5d5] rounded-md
          text-[#6e6e73] hover:bg-[#e5e5e7] hover:text-[#1d1d1f]
          disabled:opacity-50 disabled:cursor-not-allowed
          transition-colors
        `}
      >
        <Plus size={14} />
      </button>
    </div>
  )
}
