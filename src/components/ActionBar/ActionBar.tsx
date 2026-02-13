import { ArrowDownTrayIcon, ClipboardDocumentIcon, CheckCircleIcon, ArrowUpTrayIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { ExclamationTriangleIcon } from '@heroicons/react/24/solid'
import { useState, useRef } from 'react'

interface ActionBarProps {
  onDownload: () => void
  onCopy: () => void
  onImport: (json: string) => boolean
  onReset: () => void
  hasErrors: boolean
}

export function ActionBar({ onDownload, onCopy, onImport, onReset, hasErrors }: ActionBarProps) {
  const [copySuccess, setCopySuccess] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)
  const [showResetConfirm, setShowResetConfirm] = useState(false)
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

  const handleResetClick = () => {
    setShowResetConfirm(true)
  }

  const handleConfirmReset = () => {
    onReset()
    setShowResetConfirm(false)
  }

  const handleCancelReset = () => {
    setShowResetConfirm(false)
  }

  return (
    <>
      <div className="border-t border-[#e5e5e7] bg-[#f5f5f7] px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Reset button on the left */}
          <button
            onClick={handleResetClick}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#ff3b30] bg-white border border-[#d2d2d7] rounded-md hover:bg-[#fff5f5] transition-colors"
          >
            <ArrowPathIcon className="w-3.5 h-3.5" />
            <span>Reset All</span>
          </button>

          {/* Only show validation errors when they exist */}
          {hasErrors && (
            <div className="flex items-center gap-1.5">
              <ExclamationTriangleIcon className="w-4 h-4 text-amber-500" />
              <span className="text-xs text-amber-700">
                Settings have validation errors
              </span>
            </div>
          )}
        </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleImportClick}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1d1d1f] bg-white border border-[#d2d2d7] rounded-md hover:bg-[#f5f5f7] transition-colors"
        >
          {importError ? (
            <>
              <span className="text-red-600">{importError}</span>
            </>
          ) : (
            <>
              <ArrowUpTrayIcon className="w-3.5 h-3.5" />
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
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#1d1d1f] bg-white border border-[#d2d2d7] rounded-md hover:bg-[#f5f5f7] transition-colors"
        >
          {copySuccess ? (
            <>
              <CheckCircleIcon className="w-3.5 h-3.5 text-green-600" />
              <span className="text-green-700">Copied!</span>
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="w-3.5 h-3.5" />
              <span>Copy JSON</span>
            </>
          )}
        </button>

        <button
          onClick={onDownload}
          disabled={hasErrors}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
            hasErrors
              ? 'bg-[#d2d2d7] text-[#86868b] cursor-not-allowed'
              : 'bg-[#007aff] text-white hover:bg-[#0051d5]'
          }`}
        >
          <ArrowDownTrayIcon className="w-3.5 h-3.5" />
          <span>Download settings.json</span>
        </button>
      </div>
    </div>

    {/* Confirmation Modal */}
    {showResetConfirm && (
      <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
        <div className="bg-white rounded-xl shadow-2xl w-[420px] overflow-hidden">
          <div className="px-6 pt-6 pb-4">
            <h3 className="text-base font-semibold text-[#1d1d1f] mb-2">
              Reset All Settings?
            </h3>
            <p className="text-xs text-[#6e6e73] leading-relaxed">
              This will clear all your custom settings and restore everything to default values. This action cannot be undone.
            </p>
          </div>
          <div className="px-6 pb-6 flex gap-2 justify-end">
            <button
              onClick={handleCancelReset}
              className="px-3 py-1.5 text-xs font-medium text-[#1d1d1f] bg-white border border-[#d2d2d7] rounded-md hover:bg-[#f5f5f7] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmReset}
              className="px-3 py-1.5 text-xs font-medium text-white bg-[#ff3b30] rounded-md hover:bg-[#ff2d20] transition-colors"
            >
              Reset All Settings
            </button>
          </div>
        </div>
      </div>
    )}
  </>
  )
}
