import { useSkillsStore } from '@/store/skillsStore'
import { AlertTriangle, Check } from 'lucide-react'

export function SkillPreview() {
  const exportSkillMarkdown = useSkillsStore((state) => state.exportSkillMarkdown)
  const validationErrors = useSkillsStore((state) => state.validationErrors)
  const currentSkill = useSkillsStore((state) => state.currentSkill)

  const markdown = exportSkillMarkdown()
  const hasContent = currentSkill.frontmatter.name || currentSkill.frontmatter.description || currentSkill.content

  // Check for warnings (not errors, but things to improve)
  const warnings: string[] = []
  if (!currentSkill.frontmatter.name) {
    warnings.push('No skill name - will need to be set for the /command')
  }
  if (!currentSkill.frontmatter.description) {
    warnings.push('No description - Claude may not auto-invoke this skill')
  }
  if (!currentSkill.content) {
    warnings.push('No instructions - skill content is empty')
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header with status */}
      <div className="px-3 py-2 border-b border-[#e5e5e7] bg-white flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-medium text-[#6e6e73]">SKILL.md</span>
          {hasContent && (
            <span className="text-[9px] text-[#9ca3af]">{markdown.length} chars</span>
          )}
        </div>
        {validationErrors.length === 0 && hasContent ? (
          <span className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
            <Check size={10} />
            Valid
          </span>
        ) : validationErrors.length > 0 ? (
          <span className="flex items-center gap-1 text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
            <AlertTriangle size={10} />
            {validationErrors.length} error{validationErrors.length !== 1 ? 's' : ''}
          </span>
        ) : null}
      </div>

      {/* Validation errors / warnings - compact */}
      {(validationErrors.length > 0 || (warnings.length > 0 && validationErrors.length === 0)) && (
        <div className={`px-3 py-2 text-[10px] border-b ${
          validationErrors.length > 0
            ? 'bg-red-50 border-red-100 text-red-600'
            : 'bg-amber-50 border-amber-100 text-amber-600'
        }`}>
          {(validationErrors.length > 0 ? validationErrors : warnings).map((msg, i) => (
            <div key={i}>• {msg}</div>
          ))}
        </div>
      )}

      {/* Preview content */}
      <div className="flex-1 overflow-y-auto">
        {hasContent ? (
          <pre className="p-3 text-[11px] font-mono text-[#1d1d1f] leading-relaxed whitespace-pre-wrap break-words">
            {markdown}
          </pre>
        ) : (
          <div className="flex items-center justify-center h-full text-[11px] text-[#9ca3af]">
            Start editing to see preview
          </div>
        )}
      </div>

      {/* File location hint - minimal */}
      <div className="px-3 py-2 border-t border-[#e5e5e7] bg-white">
        <p className="text-[9px] text-[#9ca3af]">
          Save to: <code className="bg-[#f0f0f0] px-1 rounded">~/.claude/skills/{currentSkill.frontmatter.name || 'name'}/SKILL.md</code>
        </p>
      </div>
    </div>
  )
}
