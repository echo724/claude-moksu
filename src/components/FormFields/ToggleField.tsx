interface ToggleFieldProps {
  value: boolean | undefined
  onChange: (value: boolean) => void
  disabled?: boolean
}

export function ToggleField({ value, onChange, disabled = false }: ToggleFieldProps) {
  const isOn = value === true

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isOn}
      onClick={() => onChange(!isOn)}
      disabled={disabled}
      className={`
        relative inline-flex h-[22px] w-[40px] items-center rounded-full
        transition-colors duration-200 ease-in-out
        focus:outline-none focus:ring-2 focus:ring-[#0066CC]/30 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        ${isOn ? 'bg-[#34C759]' : 'bg-[#e5e5e7]'}
      `}
    >
      <span
        className={`
          inline-block h-[18px] w-[18px] transform rounded-full
          bg-white shadow-sm
          transition-transform duration-200 ease-in-out
          ${isOn ? 'translate-x-[20px]' : 'translate-x-[2px]'}
        `}
      />
    </button>
  )
}
