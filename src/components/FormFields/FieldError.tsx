import { ExclamationCircleIcon } from '@heroicons/react/20/solid'

interface FieldErrorProps {
  error?: string
}

export function FieldError({ error }: FieldErrorProps) {
  if (!error) return null

  return (
    <div className="flex items-start gap-1.5 mt-1.5">
      <ExclamationCircleIcon className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
      <p className="text-xs text-red-600">{error}</p>
    </div>
  )
}
