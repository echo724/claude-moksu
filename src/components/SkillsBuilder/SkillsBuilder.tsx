import { useState } from 'react'
import { ArrowLeft, Plus, Eye, EyeOff, Download, Copy, Check } from 'lucide-react'
import { SkillEditor } from './SkillEditor'
import { SkillPreview } from './SkillPreview'
import { SkillFileTree } from './SkillFileTree'
import { SkillTemplates } from './SkillTemplates'
import { useSkillsStore } from '@/store/skillsStore'

interface SkillsBuilderProps {
  onBack: () => void
}

export function SkillsBuilder({ onBack }: SkillsBuilderProps) {
  const [showTemplates, setShowTemplates] = useState(false)
  const [copied, setCopied] = useState(false)

  const showPreview = useSkillsStore((state) => state.showPreview)
  const setShowPreview = useSkillsStore((state) => state.setShowPreview)
  const currentSkillId = useSkillsStore((state) => state.currentSkillId)
  const currentSkill = useSkillsStore((state) => state.currentSkill)
  const resetCurrentSkill = useSkillsStore((state) => state.resetCurrentSkill)
  const saveSkill = useSkillsStore((state) => state.saveSkill)
  const exportSkillMarkdown = useSkillsStore((state) => state.exportSkillMarkdown)
  const validationErrors = useSkillsStore((state) => state.validationErrors)
  const validateCurrentSkill = useSkillsStore((state) => state.validateCurrentSkill)

  const handleNewSkill = () => {
    resetCurrentSkill()
    setShowTemplates(false)
  }

  const handleSave = () => {
    if (validateCurrentSkill()) {
      saveSkill()
    }
  }

  const handleCopy = async () => {
    const markdown = exportSkillMarkdown()
    await navigator.clipboard.writeText(markdown)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const markdown = exportSkillMarkdown()
    const blob = new Blob([markdown], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    // Use skill name for folder context, actual file should be SKILL.md
    const skillName = currentSkill.frontmatter.name || 'my-skill'
    a.download = `${skillName}-SKILL.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const skillTitle = currentSkill.frontmatter.name
    ? `/${currentSkill.frontmatter.name}`
    : currentSkillId
      ? 'Editing Skill'
      : 'New Skill'

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#e5e5e7] bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-[12px] text-[#6e6e73] hover:text-[#1d1d1f] transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </button>
          <span className="text-[#e5e5e7]">|</span>
          <h1 className="text-[14px] font-semibold text-[#1d1d1f]">Skills Builder</h1>
        </div>
        <button
          onClick={() => setShowPreview(!showPreview)}
          className={`
            flex items-center gap-1 px-2.5 py-1
            text-[11px] font-medium rounded-md
            border transition-colors
            ${showPreview
              ? 'bg-[#0066CC] text-white border-[#0066CC] hover:bg-[#0052a3]'
              : 'bg-white text-[#6e6e73] border-[#e5e5e7] hover:bg-[#f5f5f7] hover:text-[#1d1d1f]'
            }
          `}
        >
          {showPreview ? <Eye size={12} /> : <EyeOff size={12} />}
          Preview
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left sidebar - file tree */}
        <div className="w-52 border-r border-[#e5e5e7] bg-[#fafafa] flex flex-col">
          <div className="p-2 border-b border-[#e5e5e7]">
            <button
              onClick={handleNewSkill}
              className="w-full flex items-center justify-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-[#0066CC] bg-white border border-[#d5d5d5] rounded-md hover:bg-[#f5f5f7] transition-colors"
            >
              <Plus size={12} />
              New Skill
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">
            <SkillFileTree onShowTemplates={() => setShowTemplates(true)} />
          </div>
        </div>

        {/* Main editor area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {showTemplates ? (
            <SkillTemplates onClose={() => setShowTemplates(false)} />
          ) : (
            <>
              {/* Skill title bar */}
              <div className="px-4 py-2 border-b border-[#e5e5e7] bg-[#fafafa] flex items-center justify-between">
                <h2 className="text-[13px] font-medium text-[#1d1d1f]">{skillTitle}</h2>
                {validationErrors.length > 0 && (
                  <span className="text-[10px] text-red-500 bg-red-50 px-1.5 py-0.5 rounded">
                    {validationErrors.length} error{validationErrors.length > 1 ? 's' : ''}
                  </span>
                )}
              </div>

              {/* Editor + Preview */}
              <div className="flex-1 flex overflow-hidden">
                {/* Editor */}
                <div className={`flex-1 overflow-y-auto ${showPreview ? 'border-r border-[#e5e5e7]' : ''}`}>
                  <SkillEditor />
                </div>

                {/* Preview panel */}
                {showPreview && (
                  <div className="w-80 overflow-y-auto bg-[#fafafa]">
                    <SkillPreview />
                  </div>
                )}
              </div>

              {/* Action bar */}
              <div className="px-4 py-2 border-t border-[#e5e5e7] bg-[#fafafa]">
                <div className="flex items-center justify-between">
                  <button
                    onClick={handleSave}
                    className="px-3 py-1.5 text-[12px] font-medium text-white bg-[#0066CC] rounded-md hover:bg-[#0052a3] transition-colors"
                  >
                    Save Draft
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-[#6e6e73] bg-white border border-[#e5e5e7] rounded-md hover:bg-[#f5f5f7] hover:text-[#1d1d1f] transition-colors"
                    >
                      {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} />}
                      {copied ? 'Copied' : 'Copy'}
                    </button>
                    <button
                      onClick={handleDownload}
                      className="flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-medium text-[#6e6e73] bg-white border border-[#e5e5e7] rounded-md hover:bg-[#f5f5f7] hover:text-[#1d1d1f] transition-colors"
                    >
                      <Download size={12} />
                      Download
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
