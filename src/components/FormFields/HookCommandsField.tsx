import { useState } from 'react'
import { Plus, X, ChevronDown, ChevronRight } from 'lucide-react'

export interface HookCommand {
  type: 'command' | 'prompt' | 'agent'
  command?: string  // For type: "command"
  prompt?: string   // For type: "prompt" or "agent"
  model?: string    // For type: "prompt" or "agent"
  timeout?: number
  statusMessage?: string
  async?: boolean   // For type: "command" only
  enabled?: boolean
  description?: string  // User-added description (not part of official schema)
}

type HookValue = string | HookCommand | (string | HookCommand)[]

function normalizeHookValue(value: HookValue | undefined): HookCommand[] {
  if (!value) return []

  if (typeof value === 'string') {
    return [{ type: 'command', command: value, enabled: true }]
  }

  if (Array.isArray(value)) {
    return value.map(item => {
      if (typeof item === 'string') {
        return { type: 'command' as const, command: item, enabled: true }
      }
      // Infer type from fields if not specified
      const type = item.type || (item.command ? 'command' : item.prompt ? 'prompt' : 'command')
      return { type, ...item, enabled: item.enabled ?? true }
    })
  }

  // Single object
  const type = value.type || (value.command ? 'command' : value.prompt ? 'prompt' : 'command')
  return [{ type, ...value, enabled: value.enabled ?? true }]
}

interface HookCommandsFieldProps {
  value: HookValue | undefined
  onChange: (value: HookCommand[] | undefined) => void
  placeholder?: string
  disabled?: boolean
  className?: string
}

export function HookCommandsField({
  value,
  onChange,
  placeholder = 'Enter command...',
  disabled = false,
  className = ''
}: HookCommandsFieldProps) {
  const [inputCommand, setInputCommand] = useState('')
  const [inputDescription, setInputDescription] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const commands = normalizeHookValue(value)

  const handleAdd = () => {
    const trimmedCommand = inputCommand.trim()
    if (!trimmedCommand) return

    const newCommand: HookCommand = {
      command: trimmedCommand,
      description: inputDescription.trim() || undefined,
      enabled: true
    }

    const newCommands = [...commands, newCommand]
    onChange(newCommands.length > 0 ? newCommands : undefined)
    setInputCommand('')
    setInputDescription('')
  }

  const handleRemove = (index: number) => {
    const newCommands = commands.filter((_, i) => i !== index)
    onChange(newCommands.length > 0 ? newCommands : undefined)
    setExpandedItems(prev => {
      const next = new Set(prev)
      next.delete(index)
      return next
    })
  }

  const handleUpdate = (index: number, updated: HookCommand) => {
    const newCommands = [...commands]
    newCommands[index] = updated
    onChange(newCommands)
  }

  const toggleExpand = (index: number) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleAdd()
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Add command section */}
      <div className="space-y-2 mb-3 p-3 bg-[#f5f5f7] border border-[#d5d5d5] rounded-md">
        <div className="flex items-start gap-2">
          <div className="flex-1 space-y-2">
            <input
              type="text"
              value={inputCommand}
              onChange={(e) => setInputCommand(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled}
              className={`
                w-full h-[26px] px-2
                text-[13px] text-[#1d1d1f] font-mono
                bg-white border border-[#d5d5d5] rounded-md
                focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
                disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
                placeholder:text-[#9ca3af]
              `}
            />
            <input
              type="text"
              value={inputDescription}
              onChange={(e) => setInputDescription(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Description (optional)"
              disabled={disabled}
              className={`
                w-full h-[26px] px-2
                text-[13px] text-[#1d1d1f]
                bg-white border border-[#d5d5d5] rounded-md
                focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
                disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
                placeholder:text-[#9ca3af]
              `}
            />
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={disabled || !inputCommand.trim()}
            className={`
              h-[26px] px-2 flex items-center gap-1
              text-[12px] font-medium text-[#0066CC]
              bg-white border border-[#d5d5d5] rounded-md
              hover:bg-[#e5e5e7]
              disabled:opacity-50 disabled:cursor-not-allowed
              transition-colors
            `}
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {/* Commands list */}
      {commands.length > 0 && (
        <div className="space-y-1.5">
          {commands.map((cmd, index) => {
            const isExpanded = expandedItems.has(index)
            return (
              <div
                key={index}
                className="bg-white border border-[#d5d5d5] rounded-md overflow-hidden"
              >
                <div className="flex items-center gap-2 p-2">
                  <button
                    type="button"
                    onClick={() => toggleExpand(index)}
                    className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors flex-shrink-0"
                  >
                    {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  <label className="flex items-center gap-2 flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={cmd.enabled ?? true}
                      onChange={(e) => handleUpdate(index, { ...cmd, enabled: e.target.checked })}
                      disabled={disabled}
                      className="w-4 h-4 text-[#0066CC] bg-white border-[#d5d5d5] rounded focus:ring-[#0066CC]/30"
                    />
                    <span className="text-[11px] text-[#6e6e73] uppercase tracking-wide">
                      {cmd.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </label>

                  <div className="flex-1 min-w-0">
                    <code className="text-[12px] font-mono text-[#1d1d1f] truncate block">
                      {cmd.command}
                    </code>
                    {!isExpanded && cmd.description && (
                      <div className="text-[11px] text-[#6e6e73] truncate">
                        {cmd.description}
                      </div>
                    )}
                  </div>

                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="text-[#6e6e73] hover:text-[#ff3b30] transition-colors flex-shrink-0"
                      title="Remove command"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {isExpanded && (
                  <div className="px-2 pb-2 space-y-2 border-t border-[#e5e5e7] pt-2 bg-[#fafafa]">
                    <div>
                      <label className="block text-[11px] text-[#6e6e73] uppercase tracking-wide mb-1">
                        Command
                      </label>
                      <input
                        type="text"
                        value={cmd.command}
                        onChange={(e) => handleUpdate(index, { ...cmd, command: e.target.value })}
                        disabled={disabled}
                        className={`
                          w-full h-[26px] px-2
                          text-[13px] text-[#1d1d1f] font-mono
                          bg-white border border-[#d5d5d5] rounded-md
                          focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
                          disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
                        `}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] text-[#6e6e73] uppercase tracking-wide mb-1">
                        Description (optional)
                      </label>
                      <input
                        type="text"
                        value={cmd.description || ''}
                        onChange={(e) => handleUpdate(index, { ...cmd, description: e.target.value || undefined })}
                        disabled={disabled}
                        placeholder="What does this command do?"
                        className={`
                          w-full h-[26px] px-2
                          text-[13px] text-[#1d1d1f]
                          bg-white border border-[#d5d5d5] rounded-md
                          focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
                          disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
                          placeholder:text-[#9ca3af]
                        `}
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {commands.length === 0 && (
        <div className="text-[12px] text-[#6e6e73] italic py-2">
          No commands configured
        </div>
      )}
    </div>
  )
}
