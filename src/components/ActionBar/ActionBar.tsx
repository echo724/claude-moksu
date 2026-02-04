import { ArrowDownTrayIcon, ClipboardDocumentIcon, CheckCircleIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { useState, useRef } from 'react'

interface ActionBarProps {
  onDownload: () => void
  onCopy: () => void
  onImport: (json: string) => boolean
  hasErrors: boolean
}

export function ActionBar({ onDownload, onCopy, onImport, hasErrors }: ActionBarProps) {
  const [copySuccess, setCopySuccess] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleCopy = async () => {
    await onCopy()
    setCopySuccess(true)
    setTimeout(() => setCopySuccess(false), 2000)
  }

  const handleImportClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const text = await file.text()
      const success = onImport(text)
      if (success) {
        setImportError(null)
      } else {
        setImportError('Invalid JSON file')
        setTimeout(() => setImportError(null), 3000)
      }
    } catch (error) {
      setImportError('Failed to read file')
      setTimeout(() => setImportError(null), 3000)
    }

    // Reset input
    e.target.value = ''
  }

  return (
    <div className="border-t border-[#e5e5e7] bg-[#f5f5f7] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {hasErrors ? (
          <>
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-sm text-red-700 font-medium">
              Settings have validation errors
            </span>
          </>
        ) : (
          <>
            <CheckCircleIcon className="w-5 h-5 text-green-600" />
            <span className="text-sm text-green-700 font-medium">
              Settings are valid
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleImportClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1d1d1f] bg-white border border-[#d2d2d7] rounded-lg hover:bg-[#f5f5f7] transition-colors"
        >
          {importError ? (
            <>
              <span className="text-red-600">{importError}</span>
            </>
          ) : (
            <>
              <ArrowUpTrayIcon className="w-4 h-4" />
              <span>Import JSON</span>
            </>
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileChange}
          className="hidden"
          aria-label="Import settings file"
        />

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#1d1d1f] bg-white border border-[#d2d2d7] rounded-lg hover:bg-[#f5f5f7] transition-colors"
        >
          {copySuccess ? (
            <>
              <CheckCircleIcon className="w-4 h-4 text-green-600" />
              <span className="text-green-700">Copied!</span>
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="w-4 h-4" />
              <span>Copy JSON</span>
            </>
          )}
        </button>

        <button
          onClick={onDownload}
          disabled={hasErrors}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            hasErrors
              ? 'bg-[#d2d2d7] text-[#86868b] cursor-not-allowed'
              : 'bg-[#007aff] text-white hover:bg-[#0051d5]'
          }`}
        >
          <ArrowDownTrayIcon className="w-4 h-4" />
          <span>Download settings.json</span>
        </button>
      </div>
    </div>
  )
}
