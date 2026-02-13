import { useState } from 'react'
import { Plus, X, ChevronDown, ChevronRight } from 'lucide-react'
import type { HookHandler, HookMatcherGroup } from '@/schemas/settings.schema'

export type { HookHandler, HookMatcherGroup }

type HookValue = HookMatcherGroup[] | undefined

function normalizeHookValue(value: HookValue): HookMatcherGroup[] {
  if (!value) return []
  if (!Array.isArray(value)) return []
  return value
}

interface HookCommandsFieldProps {
  value: HookValue
  onChange: (value: HookMatcherGroup[] | undefined) => void
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
  const [showAddGroupForm, setShowAddGroupForm] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set())
  const [expandedHooks, setExpandedHooks] = useState<Set<string>>(new Set())

  // Form state for new matcher group
  const [newMatcher, setNewMatcher] = useState('')

  // Form state for adding hook to a group
  const [addingHookToGroup, setAddingHookToGroup] = useState<number | null>(null)
  const [inputType, setInputType] = useState<'command' | 'prompt' | 'agent'>('command')
  const [inputCommand, setInputCommand] = useState('')
  const [inputPrompt, setInputPrompt] = useState('')
  const [inputModel, setInputModel] = useState('')
  const [inputTimeout, setInputTimeout] = useState('')
  const [inputStatusMessage, setInputStatusMessage] = useState('')
  const [inputAsync, setInputAsync] = useState(false)

  const matcherGroups = normalizeHookValue(value)

  const resetHookForm = () => {
    setInputCommand('')
    setInputPrompt('')
    setInputModel('')
    setInputTimeout('')
    setInputStatusMessage('')
    setInputAsync(false)
    setInputType('command')
  }

  const toggleGroupExpand = (index: number) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  const toggleHookExpand = (groupIndex: number, hookIndex: number) => {
    const key = `${groupIndex}-${hookIndex}`
    setExpandedHooks(prev => {
      const next = new Set(prev)
      if (next.has(key)) {
        next.delete(key)
      } else {
        next.add(key)
      }
      return next
    })
  }

  const handleAddGroup = () => {
    const newGroup: HookMatcherGroup = {
      hooks: []
    }
    if (newMatcher.trim()) {
      newGroup.matcher = newMatcher.trim()
    }
    const newGroups = [...matcherGroups, newGroup]
    onChange(newGroups)
    setNewMatcher('')
    setShowAddGroupForm(false)
    // Auto-expand the new group
    setExpandedGroups(prev => new Set([...prev, newGroups.length - 1]))
    // Open the add hook form for the new group
    setAddingHookToGroup(newGroups.length - 1)
  }

  const handleRemoveGroup = (index: number) => {
    const newGroups = matcherGroups.filter((_, i) => i !== index)
    onChange(newGroups.length > 0 ? newGroups : undefined)
    setExpandedGroups(prev => {
      const next = new Set(prev)
      next.delete(index)
      return next
    })
  }

  const handleUpdateGroupMatcher = (index: number, matcher: string) => {
    const newGroups = [...matcherGroups]
    if (matcher.trim()) {
      newGroups[index] = { ...newGroups[index], matcher: matcher.trim() }
    } else {
      const { matcher: _, ...rest } = newGroups[index]
      newGroups[index] = rest as HookMatcherGroup
    }
    onChange(newGroups)
  }

  const handleAddHook = (groupIndex: number) => {
    let newHook: HookHandler

    if (inputType === 'command') {
      const trimmedCommand = inputCommand.trim()
      if (!trimmedCommand) return

      newHook = {
        type: 'command',
        command: trimmedCommand
      }

      if (inputAsync) newHook.async = true
      if (inputTimeout.trim() && !isNaN(Number(inputTimeout))) {
        newHook.timeout = Number(inputTimeout)
      }
      if (inputStatusMessage.trim()) {
        newHook.statusMessage = inputStatusMessage.trim()
      }
    } else {
      const trimmedPrompt = inputPrompt.trim()
      if (!trimmedPrompt) return

      newHook = {
        type: inputType, // 'prompt' or 'agent'
        prompt: trimmedPrompt
      } as Extract<HookHandler, { type: 'prompt' | 'agent' }>

      if (inputModel.trim()) newHook.model = inputModel.trim()
      if (inputTimeout.trim() && !isNaN(Number(inputTimeout))) {
        newHook.timeout = Number(inputTimeout)
      }
      if (inputStatusMessage.trim()) {
        newHook.statusMessage = inputStatusMessage.trim()
      }
    }

    const newGroups = [...matcherGroups]
    newGroups[groupIndex] = {
      ...newGroups[groupIndex],
      hooks: [...newGroups[groupIndex].hooks, newHook]
    }
    onChange(newGroups)

    resetHookForm()
    setAddingHookToGroup(null)
  }

  const handleRemoveHook = (groupIndex: number, hookIndex: number) => {
    const newGroups = [...matcherGroups]
    newGroups[groupIndex] = {
      ...newGroups[groupIndex],
      hooks: newGroups[groupIndex].hooks.filter((_, i) => i !== hookIndex)
    }
    // Remove group if it has no hooks
    if (newGroups[groupIndex].hooks.length === 0) {
      newGroups.splice(groupIndex, 1)
    }
    onChange(newGroups.length > 0 ? newGroups : undefined)
  }

  const handleUpdateHook = (groupIndex: number, hookIndex: number, updated: HookHandler) => {
    const newGroups = [...matcherGroups]
    const newHooks = [...newGroups[groupIndex].hooks]
    newHooks[hookIndex] = updated
    newGroups[groupIndex] = { ...newGroups[groupIndex], hooks: newHooks }
    onChange(newGroups)
  }

  const getDisplayText = (hook: HookHandler) => {
    if (hook.type === 'command') {
      return hook.command || 'No command'
    }
    return hook.prompt || 'No prompt'
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'command': return 'Command'
      case 'prompt': return 'Prompt'
      case 'agent': return 'Agent'
      default: return type
    }
  }

  return (
    <div className={`w-full ${className}`}>
      {/* Matcher groups list */}
      {matcherGroups.length > 0 && (
        <div className="space-y-2 mb-3">
          {matcherGroups.map((group, groupIndex) => {
            const isGroupExpanded = expandedGroups.has(groupIndex)
            return (
              <div
                key={groupIndex}
                className="bg-white border border-[#d5d5d5] rounded-md overflow-hidden"
              >
                {/* Group header */}
                <div className="flex items-center gap-2 p-2 bg-[#f5f5f7]">
                  <button
                    type="button"
                    onClick={() => toggleGroupExpand(groupIndex)}
                    className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors flex-shrink-0"
                  >
                    {isGroupExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#6e6e73] uppercase tracking-wide">
                        Matcher:
                      </span>
                      <code className="text-[12px] font-mono text-[#1d1d1f]">
                        {group.matcher || '*'}
                      </code>
                      <span className="text-[11px] text-[#6e6e73]">
                        ({group.hooks.length} hook{group.hooks.length !== 1 ? 's' : ''})
                      </span>
                    </div>
                  </div>

                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => handleRemoveGroup(groupIndex)}
                      className="text-[#6e6e73] hover:text-[#ff3b30] transition-colors flex-shrink-0"
                      title="Remove matcher group"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>

                {/* Group content (expanded) */}
                {isGroupExpanded && (
                  <div className="p-2 space-y-2 border-t border-[#e5e5e7]">
                    {/* Matcher input */}
                    <div>
                      <label className="block text-[11px] text-[#6e6e73] uppercase tracking-wide mb-1">
                        Matcher Pattern (regex, optional)
                      </label>
                      <input
                        type="text"
                        value={group.matcher || ''}
                        onChange={(e) => handleUpdateGroupMatcher(groupIndex, e.target.value)}
                        placeholder="e.g., Bash, Edit|Write, mcp__.*"
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
                      <p className="text-[10px] text-[#6e6e73] mt-0.5">
                        Leave empty to match all. Use | for OR, .* for wildcards.
                      </p>
                    </div>

                    {/* Hooks list */}
                    {group.hooks.length > 0 && (
                      <div className="space-y-1.5">
                        <label className="block text-[11px] text-[#6e6e73] uppercase tracking-wide">
                          Hooks
                        </label>
                        {group.hooks.map((hook, hookIndex) => {
                          const hookKey = `${groupIndex}-${hookIndex}`
                          const isHookExpanded = expandedHooks.has(hookKey)
                          return (
                            <div
                              key={hookIndex}
                              className="bg-[#fafafa] border border-[#e5e5e7] rounded"
                            >
                              <div className="flex items-center gap-2 p-2">
                                <button
                                  type="button"
                                  onClick={() => toggleHookExpand(groupIndex, hookIndex)}
                                  className="text-[#6e6e73] hover:text-[#1d1d1f] transition-colors flex-shrink-0"
                                >
                                  {isHookExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                                </button>

                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className={`
                                      px-1.5 py-0.5 text-[10px] uppercase tracking-wide rounded
                                      ${hook.type === 'command' ? 'bg-blue-100 text-blue-700' :
                                        hook.type === 'prompt' ? 'bg-purple-100 text-purple-700' :
                                        'bg-green-100 text-green-700'}
                                    `}>
                                      {getTypeLabel(hook.type)}
                                    </span>
                                    {hook.type === 'command' && hook.async && (
                                      <span className="px-1.5 py-0.5 text-[10px] bg-orange-100 text-orange-700 uppercase tracking-wide rounded">
                                        Async
                                      </span>
                                    )}
                                  </div>
                                  <code className="text-[11px] font-mono text-[#1d1d1f] truncate block mt-0.5">
                                    {getDisplayText(hook)}
                                  </code>
                                </div>

                                {!disabled && (
                                  <button
                                    type="button"
                                    onClick={() => handleRemoveHook(groupIndex, hookIndex)}
                                    className="text-[#6e6e73] hover:text-[#ff3b30] transition-colors flex-shrink-0"
                                    title="Remove hook"
                                  >
                                    <X size={12} />
                                  </button>
                                )}
                              </div>

                              {/* Hook details (expanded) */}
                              {isHookExpanded && (
                                <div className="px-2 pb-2 space-y-2 border-t border-[#e5e5e7] pt-2">
                                  {/* Type selector */}
                                  <div>
                                    <label className="block text-[10px] text-[#6e6e73] uppercase tracking-wide mb-1">
                                      Hook Type
                                    </label>
                                    <select
                                      value={hook.type}
                                      onChange={(e) => {
                                        const newType = e.target.value as 'command' | 'prompt' | 'agent'
                                        let updated: HookHandler

                                        // Reconstruct hook based on new type
                                        if (newType === 'command') {
                                          updated = {
                                            type: 'command',
                                            command: hook.type === 'command' ? hook.command : (hook.prompt || '')
                                          }
                                        } else {
                                          updated = {
                                            type: newType,
                                            prompt: hook.type === 'command' ? (hook.command || '') : hook.prompt
                                          }
                                        }

                                        // Preserve common fields
                                        if (hook.timeout) updated.timeout = hook.timeout
                                        if (hook.statusMessage) updated.statusMessage = hook.statusMessage

                                        handleUpdateHook(groupIndex, hookIndex, updated)
                                      }}
                                      disabled={disabled}
                                      className={`
                                        w-full h-[24px] px-2
                                        text-[12px] text-[#1d1d1f]
                                        bg-white border border-[#d5d5d5] rounded-md
                                        focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
                                        disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
                                      `}
                                    >
                                      <option value="command">Command</option>
                                      <option value="prompt">Prompt</option>
                                      <option value="agent">Agent</option>
                                    </select>
                                  </div>

                                  {/* Command or Prompt field */}
                                  {hook.type === 'command' ? (
                                    <div>
                                      <label className="block text-[10px] text-[#6e6e73] uppercase tracking-wide mb-1">
                                        Command <span className="text-red-500">*</span>
                                      </label>
                                      <textarea
                                        value={hook.command}
                                        onChange={(e) => handleUpdateHook(groupIndex, hookIndex, { ...hook, command: e.target.value })}
                                        disabled={disabled}
                                        rows={2}
                                        className={`
                                          w-full px-2 py-1
                                          text-[12px] text-[#1d1d1f] font-mono
                                          bg-white border border-[#d5d5d5] rounded-md
                                          focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
                                          disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
                                          resize-y
                                        `}
                                      />
                                    </div>
                                  ) : (
                                    <div>
                                      <label className="block text-[10px] text-[#6e6e73] uppercase tracking-wide mb-1">
                                        Prompt <span className="text-red-500">*</span>
                                      </label>
                                      <textarea
                                        value={hook.prompt}
                                        onChange={(e) => handleUpdateHook(groupIndex, hookIndex, { ...hook, prompt: e.target.value })}
                                        disabled={disabled}
                                        rows={2}
                                        className={`
                                          w-full px-2 py-1
                                          text-[12px] text-[#1d1d1f]
                                          bg-white border border-[#d5d5d5] rounded-md
                                          focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
                                          disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
                                          resize-y
                                        `}
                                      />
                                    </div>
                                  )}

                                  {/* Model field - only for prompt/agent */}
                                  {(hook.type === 'prompt' || hook.type === 'agent') && (
                                    <div>
                                      <label className="block text-[10px] text-[#6e6e73] uppercase tracking-wide mb-1">
                                        Model (optional)
                                      </label>
                                      <input
                                        type="text"
                                        value={hook.model || ''}
                                        onChange={(e) => handleUpdateHook(groupIndex, hookIndex, { ...hook, model: e.target.value || undefined })}
                                        disabled={disabled}
                                        placeholder="e.g., sonnet, haiku"
                                        className={`
                                          w-full h-[24px] px-2
                                          text-[12px] text-[#1d1d1f]
                                          bg-white border border-[#d5d5d5] rounded-md
                                          focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
                                          disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
                                          placeholder:text-[#9ca3af]
                                        `}
                                      />
                                    </div>
                                  )}

                                  {/* Async checkbox - only for command type */}
                                  {hook.type === 'command' && (
                                    <label className="flex items-center gap-2">
                                      <input
                                        type="checkbox"
                                        checked={hook.async || false}
                                        onChange={(e) => handleUpdateHook(groupIndex, hookIndex, { ...hook, async: e.target.checked || undefined })}
                                        disabled={disabled}
                                        className="w-3.5 h-3.5 text-[#0066CC] bg-white border-[#d5d5d5] rounded focus:ring-[#0066CC]/30"
                                      />
                                      <span className="text-[12px] text-[#1d1d1f]">Run asynchronously</span>
                                    </label>
                                  )}

                                  {/* Timeout */}
                                  <div>
                                    <label className="block text-[10px] text-[#6e6e73] uppercase tracking-wide mb-1">
                                      Timeout (seconds)
                                    </label>
                                    <input
                                      type="number"
                                      value={hook.timeout?.toString() || ''}
                                      onChange={(e) => handleUpdateHook(groupIndex, hookIndex, { ...hook, timeout: e.target.value ? Number(e.target.value) : undefined })}
                                      disabled={disabled}
                                      placeholder="Default varies by type"
                                      className={`
                                        w-full h-[24px] px-2
                                        text-[12px] text-[#1d1d1f]
                                        bg-white border border-[#d5d5d5] rounded-md
                                        focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
                                        disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
                                        placeholder:text-[#9ca3af]
                                      `}
                                    />
                                  </div>

                                  {/* Status message */}
                                  <div>
                                    <label className="block text-[10px] text-[#6e6e73] uppercase tracking-wide mb-1">
                                      Status Message (optional)
                                    </label>
                                    <input
                                      type="text"
                                      value={hook.statusMessage || ''}
                                      onChange={(e) => handleUpdateHook(groupIndex, hookIndex, { ...hook, statusMessage: e.target.value || undefined })}
                                      disabled={disabled}
                                      placeholder="Custom spinner message"
                                      className={`
                                        w-full h-[24px] px-2
                                        text-[12px] text-[#1d1d1f]
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

                    {/* Add hook to this group */}
                    {addingHookToGroup === groupIndex ? (
                      <div className="space-y-2 p-2 bg-[#fafafa] border border-[#0066CC] rounded">
                        {/* Type selector */}
                        <div>
                          <label className="block text-[10px] text-[#6e6e73] uppercase tracking-wide mb-1">
                            Hook Type
                          </label>
                          <select
                            value={inputType}
                            onChange={(e) => setInputType(e.target.value as 'command' | 'prompt' | 'agent')}
                            disabled={disabled}
                            className={`
                              w-full h-[24px] px-2
                              text-[12px] text-[#1d1d1f]
                              bg-white border border-[#d5d5d5] rounded-md
                              focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
                              disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
                            `}
                          >
                            <option value="command">Command (shell script)</option>
                            <option value="prompt">Prompt (LLM evaluation)</option>
                            <option value="agent">Agent (subagent with tools)</option>
                          </select>
                        </div>

                        {/* Main input field */}
                        <div>
                          <label className="block text-[10px] text-[#6e6e73] uppercase tracking-wide mb-1">
                            {inputType === 'command' ? 'Command' : 'Prompt'} <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            value={inputType === 'command' ? inputCommand : inputPrompt}
                            onChange={(e) => inputType === 'command' ? setInputCommand(e.target.value) : setInputPrompt(e.target.value)}
                            placeholder={inputType === 'command' ? placeholder : 'Enter prompt (use $ARGUMENTS for hook input)'}
                            disabled={disabled}
                            rows={2}
                            className={`
                              w-full px-2 py-1
                              text-[12px] text-[#1d1d1f] ${inputType === 'command' ? 'font-mono' : ''}
                              bg-white border border-[#d5d5d5] rounded-md
                              focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
                              disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
                              placeholder:text-[#9ca3af]
                              resize-y
                            `}
                          />
                        </div>

                        {/* Model field - only for prompt/agent */}
                        {(inputType === 'prompt' || inputType === 'agent') && (
                          <div>
                            <label className="block text-[10px] text-[#6e6e73] uppercase tracking-wide mb-1">
                              Model (optional)
                            </label>
                            <input
                              type="text"
                              value={inputModel}
                              onChange={(e) => setInputModel(e.target.value)}
                              placeholder="e.g., sonnet, haiku"
                              disabled={disabled}
                              className={`
                                w-full h-[24px] px-2
                                text-[12px] text-[#1d1d1f]
                                bg-white border border-[#d5d5d5] rounded-md
                                focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
                                disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
                                placeholder:text-[#9ca3af]
                              `}
                            />
                          </div>
                        )}

                        {/* Async checkbox - only for command type */}
                        {inputType === 'command' && (
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={inputAsync}
                              onChange={(e) => setInputAsync(e.target.checked)}
                              disabled={disabled}
                              className="w-3.5 h-3.5 text-[#0066CC] bg-white border-[#d5d5d5] rounded focus:ring-[#0066CC]/30"
                            />
                            <span className="text-[12px] text-[#1d1d1f]">Run asynchronously</span>
                          </label>
                        )}

                        {/* Advanced options */}
                        <details className="text-[12px]">
                          <summary className="cursor-pointer text-[#6e6e73] hover:text-[#1d1d1f] select-none">
                            Advanced options
                          </summary>
                          <div className="mt-2 space-y-2">
                            <div>
                              <label className="block text-[10px] text-[#6e6e73] uppercase tracking-wide mb-1">
                                Timeout (seconds)
                              </label>
                              <input
                                type="number"
                                value={inputTimeout}
                                onChange={(e) => setInputTimeout(e.target.value)}
                                placeholder="Default: 600 (command), 30 (prompt), 60 (agent)"
                                disabled={disabled}
                                className={`
                                  w-full h-[24px] px-2
                                  text-[12px] text-[#1d1d1f]
                                  bg-white border border-[#d5d5d5] rounded-md
                                  focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
                                  disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
                                  placeholder:text-[#9ca3af]
                                `}
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-[#6e6e73] uppercase tracking-wide mb-1">
                                Status Message (optional)
                              </label>
                              <input
                                type="text"
                                value={inputStatusMessage}
                                onChange={(e) => setInputStatusMessage(e.target.value)}
                                placeholder="Custom spinner message"
                                disabled={disabled}
                                className={`
                                  w-full h-[24px] px-2
                                  text-[12px] text-[#1d1d1f]
                                  bg-white border border-[#d5d5d5] rounded-md
                                  focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30
                                  disabled:bg-[#f5f5f7] disabled:text-[#6e6e73]
                                  placeholder:text-[#9ca3af]
                                `}
                              />
                            </div>
                          </div>
                        </details>

                        {/* Action buttons */}
                        <div className="flex gap-2 pt-1">
                          <button
                            type="button"
                            onClick={() => handleAddHook(groupIndex)}
                            disabled={disabled || (inputType === 'command' ? !inputCommand.trim() : !inputPrompt.trim())}
                            className={`
                              flex-1 h-[26px] px-3 flex items-center justify-center gap-1
                              text-[11px] font-medium text-white
                              bg-[#0066CC] border border-[#0066CC] rounded-md
                              hover:bg-[#0055aa]
                              disabled:opacity-50 disabled:cursor-not-allowed
                              transition-colors
                            `}
                          >
                            <Plus size={12} />
                            Add Hook
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              resetHookForm()
                              setAddingHookToGroup(null)
                            }}
                            disabled={disabled}
                            className={`
                              h-[26px] px-3
                              text-[11px] font-medium text-[#6e6e73]
                              bg-white border border-[#d5d5d5] rounded-md
                              hover:bg-[#f5f5f7]
                              disabled:opacity-50 disabled:cursor-not-allowed
                              transition-colors
                            `}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          resetHookForm()
                          setAddingHookToGroup(groupIndex)
                        }}
                        disabled={disabled}
                        className={`
                          w-full h-[28px] px-3 flex items-center justify-center gap-2
                          text-[12px] font-medium text-[#0066CC]
                          bg-white border border-dashed border-[#d5d5d5] rounded-md
                          hover:bg-[#f5f5f7] hover:border-[#0066CC]
                          disabled:opacity-50 disabled:cursor-not-allowed
                          transition-colors
                        `}
                      >
                        <Plus size={14} />
                        Add Hook
                      </button>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Add matcher group button or form */}
      {!showAddGroupForm ? (
        <button
          type="button"
          onClick={() => setShowAddGroupForm(true)}
          disabled={disabled}
          className={`
            w-full h-[32px] px-3 flex items-center justify-center gap-2
            text-[13px] font-medium text-[#0066CC]
            bg-[#f5f5f7] border border-[#d5d5d5] rounded-md
            hover:bg-[#e5e5e7]
            disabled:opacity-50 disabled:cursor-not-allowed
            transition-colors
          `}
        >
          <Plus size={16} />
          Add Matcher Group
        </button>
      ) : (
        <div className="space-y-2 p-3 bg-[#f5f5f7] border border-[#0066CC] rounded-md">
          <div>
            <label className="block text-[11px] text-[#6e6e73] uppercase tracking-wide mb-1">
              Matcher Pattern (regex, optional)
            </label>
            <input
              type="text"
              value={newMatcher}
              onChange={(e) => setNewMatcher(e.target.value)}
              placeholder="e.g., Bash, Edit|Write, permission_prompt|idle_prompt"
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
            <p className="text-[10px] text-[#6e6e73] mt-0.5">
              Leave empty to match all occurrences of this event.
            </p>
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleAddGroup}
              disabled={disabled}
              className={`
                flex-1 h-[28px] px-3 flex items-center justify-center gap-1
                text-[12px] font-medium text-white
                bg-[#0066CC] border border-[#0066CC] rounded-md
                hover:bg-[#0055aa]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
            >
              <Plus size={14} />
              Add Group
            </button>
            <button
              type="button"
              onClick={() => {
                setNewMatcher('')
                setShowAddGroupForm(false)
              }}
              disabled={disabled}
              className={`
                h-[28px] px-3
                text-[12px] font-medium text-[#6e6e73]
                bg-white border border-[#d5d5d5] rounded-md
                hover:bg-[#f5f5f7]
                disabled:opacity-50 disabled:cursor-not-allowed
                transition-colors
              `}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
