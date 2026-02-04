import { useState } from 'react'
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline'

interface JsonPreviewProps {
  json: string
  validationErrors?: string[]
}

export function JsonPreview({ json, validationErrors = [] }: JsonPreviewProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const hasErrors = validationErrors.length > 0

  return (
    <div className="border-t border-[#e5e5e7] bg-white">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-6 py-3 flex items-center justify-between hover:bg-[#f5f5f7] transition-colors"
      >
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-[#1d1d1f]">
            JSON Preview
          </h3>
          {hasErrors && (
            <span className="px-2 py-0.5 text-xs font-medium bg-red-100 text-red-700 rounded">
              {validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronDownIcon className="w-5 h-5 text-[#6e6e73]" />
        ) : (
          <ChevronUpIcon className="w-5 h-5 text-[#6e6e73]" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-4">
          {hasErrors && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="text-sm font-medium text-red-900 mb-2">Validation Errors:</h4>
              <ul className="text-xs text-red-700 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-500 mt-0.5">•</span>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <pre className="bg-[#f5f5f7] rounded-lg p-4 text-xs font-mono text-[#1d1d1f] overflow-auto max-h-[400px] border border-[#e5e5e7]">
            {json || '{\n  // Settings will appear here\n}'}
          </pre>
        </div>
      )}
    </div>
  )
}
