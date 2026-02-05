import { SettingsCard, SettingsCardItem } from '../SettingsContent'
import { SettingsRow } from '../SettingsRow'
import { HelpTooltip } from '../HelpTooltip'
import { TextField, ToggleField, SelectField } from '../FormFields'
import { useSkillsStore } from '@/store/skillsStore'
import { getSkillFieldMetadata } from '@/data/skillMetadata'
import { SkillToolNames } from '@/schemas/skill.schema'
import { useState } from 'react'
import { ChevronDown, ChevronRight } from 'lucide-react'

export function SkillEditor() {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const currentSkill = useSkillsStore((state) => state.currentSkill)
  const updateFrontmatter = useSkillsStore((state) => state.updateFrontmatter)
  const updateContent = useSkillsStore((state) => state.updateContent)
  const validationErrors = useSkillsStore((state) => state.validationErrors)

  const getFieldError = (key: string): string | undefined => {
    return validationErrors.find(e => e.includes(key))
  }

  const getAllowedToolsArray = (): string[] => {
    const tools = currentSkill.frontmatter['allowed-tools']
    if (!tools) return []
    return tools.split(',').map(t => t.trim()).filter(Boolean)
  }

  const toggleTool = (tool: string) => {
    const current = getAllowedToolsArray()
    const updated = current.includes(tool)
      ? current.filter(t => t !== tool)
      : [...current, tool]
    updateFrontmatter('allowed-tools', updated.length > 0 ? updated.join(', ') : undefined)
  }

  const selectedTools = getAllowedToolsArray()

  return (
    <div className="p-4 space-y-3">
      {/* Basic Info */}
      <SettingsCard title="Skill Info">
        <SettingsCardItem>
          <SettingsRow
            label={getSkillFieldMetadata('name')?.label || 'Name'}
            description={getSkillFieldMetadata('name')?.description}
            helpContent={
              <HelpTooltip
                description={getSkillFieldMetadata('name')?.description || ''}
                example={getSkillFieldMetadata('name')?.example}
              />
            }
            error={getFieldError('name')}
          >
            <TextField
              value={currentSkill.frontmatter.name || ''}
              onChange={(v) => updateFrontmatter('name', v)}
              placeholder="my-skill"
              error={getFieldError('name')}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getSkillFieldMetadata('description')?.label || 'Description'}
            description={getSkillFieldMetadata('description')?.description}
            stacked
            helpContent={
              <HelpTooltip
                description={getSkillFieldMetadata('description')?.description || ''}
                example={getSkillFieldMetadata('description')?.example}
              />
            }
          >
            <textarea
              value={currentSkill.frontmatter.description || ''}
              onChange={(e) => updateFrontmatter('description', e.target.value || undefined)}
              placeholder="When to use this skill..."
              rows={2}
              className="w-full px-3 py-2 text-[13px] text-[#1d1d1f] bg-white border border-[#d5d5d5] rounded-md focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30 resize-none placeholder:text-[#9ca3af]"
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getSkillFieldMetadata('argument-hint')?.label || 'Argument Hint'}
            description={getSkillFieldMetadata('argument-hint')?.description}
            helpContent={
              <HelpTooltip
                description={getSkillFieldMetadata('argument-hint')?.description || ''}
                example={getSkillFieldMetadata('argument-hint')?.example}
              />
            }
          >
            <TextField
              value={currentSkill.frontmatter['argument-hint'] || ''}
              onChange={(v) => updateFrontmatter('argument-hint', v)}
              placeholder="[file-path]"
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>

      {/* Behavior & Model - Combined */}
      <SettingsCard title="Behavior">
        <SettingsCardItem>
          <SettingsRow
            label="User Invocable"
            description="Allow users to trigger with /command"
          >
            <ToggleField
              value={currentSkill.frontmatter['user-invocable'] ?? true}
              onChange={(v) => updateFrontmatter('user-invocable', v)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label="Model Auto-invoke"
            description="Let Claude trigger this skill automatically"
          >
            <ToggleField
              value={!(currentSkill.frontmatter['disable-model-invocation'] ?? false)}
              onChange={(v) => updateFrontmatter('disable-model-invocation', !v)}
            />
          </SettingsRow>
        </SettingsCardItem>

        <SettingsCardItem>
          <SettingsRow
            label={getSkillFieldMetadata('model')?.label || 'Model'}
            description={getSkillFieldMetadata('model')?.description}
          >
            <SelectField
              value={currentSkill.frontmatter.model || ''}
              onChange={(v) => updateFrontmatter('model', v)}
              options={[
                { value: '', label: 'Default' },
                { value: 'sonnet', label: 'Sonnet' },
                { value: 'opus', label: 'Opus' },
                { value: 'haiku', label: 'Haiku' },
              ]}
              allowEmpty={false}
            />
          </SettingsRow>
        </SettingsCardItem>
      </SettingsCard>

      {/* Tools - Compact grid */}
      <SettingsCard title="Allowed Tools">
        <SettingsCardItem>
          <div className="space-y-2">
            <p className="text-[11px] text-[#6e6e73]">
              Restrict which tools this skill can use. Leave empty for no restrictions.
            </p>
            <div className="grid grid-cols-4 gap-1.5">
              {SkillToolNames.map((tool) => {
                const isSelected = selectedTools.includes(tool)
                return (
                  <button
                    key={tool}
                    onClick={() => toggleTool(tool)}
                    className={`
                      px-2 py-1.5 text-[11px] rounded-md border transition-all
                      ${isSelected
                        ? 'bg-[#0066CC] text-white border-[#0066CC] font-medium'
                        : 'bg-white text-[#6e6e73] border-[#e5e5e7] hover:border-[#d5d5d5] hover:text-[#1d1d1f]'
                      }
                    `}
                  >
                    {tool}
                  </button>
                )
              })}
            </div>
            {selectedTools.length > 0 && (
              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] text-[#6e6e73]">
                  {selectedTools.length} tool{selectedTools.length !== 1 ? 's' : ''} selected
                </span>
                <button
                  onClick={() => updateFrontmatter('allowed-tools', undefined)}
                  className="text-[11px] text-[#0066CC] hover:underline"
                >
                  Clear all
                </button>
              </div>
            )}
          </div>
        </SettingsCardItem>
      </SettingsCard>

      {/* Advanced Settings - Collapsible */}
      <div className="bg-white border border-[#e5e5e7] rounded-lg overflow-hidden">
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="w-full flex items-center justify-between px-4 py-2.5 bg-[#fafafa] border-b border-[#e5e5e7] text-left hover:bg-[#f5f5f7] transition-colors"
        >
          <span className="text-[13px] font-medium text-[#1d1d1f]">Advanced</span>
          {showAdvanced ? <ChevronDown size={14} className="text-[#6e6e73]" /> : <ChevronRight size={14} className="text-[#6e6e73]" />}
        </button>
        {showAdvanced && (
          <div className="divide-y divide-[#e5e5e7]">
            <SettingsCardItem>
              <SettingsRow
                label="Execution Context"
                description="Run inline or fork to a subagent"
              >
                <SelectField
                  value={currentSkill.frontmatter.context || ''}
                  onChange={(v) => updateFrontmatter('context', v as 'fork' | undefined)}
                  options={[
                    { value: '', label: 'Inline' },
                    { value: 'fork', label: 'Fork (subagent)' },
                  ]}
                  allowEmpty={false}
                />
              </SettingsRow>
            </SettingsCardItem>

            {currentSkill.frontmatter.context === 'fork' && (
              <SettingsCardItem>
                <SettingsRow
                  label="Subagent Type"
                  description="Specialized agent for this skill"
                >
                  <SelectField
                    value={currentSkill.frontmatter.agent || ''}
                    onChange={(v) => updateFrontmatter('agent', v)}
                    options={[
                      { value: '', label: 'General Purpose' },
                      { value: 'Explore', label: 'Explore' },
                      { value: 'Plan', label: 'Plan' },
                      { value: 'Bash', label: 'Bash' },
                    ]}
                    allowEmpty={false}
                  />
                </SettingsRow>
              </SettingsCardItem>
            )}
          </div>
        )}
      </div>

      {/* Instructions */}
      <SettingsCard title="Instructions">
        <SettingsCardItem>
          <div className="space-y-2">
            <textarea
              value={currentSkill.content}
              onChange={(e) => updateContent(e.target.value)}
              placeholder="Write instructions for Claude in Markdown...

Use $ARGUMENTS for user input.
Use `command` for dynamic context injection."
              className="w-full h-44 px-3 py-2 text-[12px] font-mono text-[#1d1d1f] bg-[#fafafa] border border-[#e5e5e7] rounded-md focus:outline-none focus:border-[#0066CC] focus:ring-1 focus:ring-[#0066CC]/30 focus:bg-white resize-y placeholder:text-[#9ca3af] leading-relaxed"
            />
            <div className="flex items-center gap-3 text-[10px] text-[#9ca3af]">
              <span>Markdown</span>
              <span className="text-[#e5e5e7]">|</span>
              <code className="bg-[#f5f5f7] px-1 rounded">$ARGUMENTS</code>
              <code className="bg-[#f5f5f7] px-1 rounded">$0, $1...</code>
              <code className="bg-[#f5f5f7] px-1 rounded">`command`</code>
            </div>
          </div>
        </SettingsCardItem>
      </SettingsCard>
    </div>
  )
}
