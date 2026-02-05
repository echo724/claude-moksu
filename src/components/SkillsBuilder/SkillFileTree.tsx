import { File, Trash2, Layout } from 'lucide-react'
import { useState } from 'react'
import { useSkillsStore, type SavedSkill } from '@/store/skillsStore'

interface SkillFileTreeProps {
  onShowTemplates: () => void
}

export function SkillFileTree({ onShowTemplates }: SkillFileTreeProps) {
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null)

  const savedSkills = useSkillsStore((state) => state.savedSkills)
  const currentSkillId = useSkillsStore((state) => state.currentSkillId)
  const loadSkill = useSkillsStore((state) => state.loadSkill)
  const deleteSkill = useSkillsStore((state) => state.deleteSkill)

  const handleDelete = (id: string) => {
    if (confirmDelete === id) {
      deleteSkill(id)
      setConfirmDelete(null)
    } else {
      setConfirmDelete(id)
      setTimeout(() => setConfirmDelete(null), 3000)
    }
  }

  // Sort by most recently updated
  const sortedSkills = [...savedSkills].sort((a, b) => b.updatedAt - a.updatedAt)

  const renderSkillItem = (skill: SavedSkill) => {
    const isActive = currentSkillId === skill.id
    const isConfirming = confirmDelete === skill.id

    return (
      <div
        key={skill.id}
        className={`
          group flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg cursor-pointer
          transition-colors duration-150
          ${isActive
            ? 'bg-[#0066CC] text-white'
            : 'text-[#1d1d1f] hover:bg-black/5'
          }
        `}
        onClick={() => loadSkill(skill.id)}
      >
        <div className="flex items-center gap-2 min-w-0">
          <File size={14} className={isActive ? 'text-white' : 'text-[#6e6e73]'} />
          <span className="text-[12px] truncate font-normal">
            {skill.name || 'Untitled'}
          </span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation()
            handleDelete(skill.id)
          }}
          className={`
            p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity
            ${isConfirming
              ? 'bg-red-500 text-white opacity-100'
              : isActive
                ? 'hover:bg-white/20 text-white'
                : 'hover:bg-[#d5d5d5] text-[#6e6e73]'
            }
          `}
          title={isConfirming ? 'Click again to confirm' : 'Delete skill'}
        >
          <Trash2 size={12} />
        </button>
      </div>
    )
  }

  return (
    <div className="p-1.5 flex flex-col h-full">
      {/* My Skills section */}
      <div className="flex-1 min-h-0">
        <p className="px-2 py-1.5 text-[10px] font-semibold text-[#9ca3af] uppercase tracking-wider">
          My Skills
        </p>
        <div className="space-y-px overflow-y-auto">
          {sortedSkills.length === 0 ? (
            <p className="text-[10px] text-[#9ca3af] px-2 py-2">
              No skills yet
            </p>
          ) : (
            sortedSkills.map(renderSkillItem)
          )}
        </div>
      </div>

      {/* Templates section */}
      <div className="border-t border-[#e5e5e7] pt-2 mt-2">
        <button
          onClick={onShowTemplates}
          className="w-full flex items-center gap-2 px-2 py-1.5 text-left hover:bg-[#e5e5e7] rounded transition-colors"
        >
          <Layout size={12} className="text-[#6e6e73]" />
          <span className="text-[11px] text-[#6e6e73]">Templates</span>
        </button>
      </div>

      {/* Help text */}
      <div className="border-t border-[#e5e5e7] pt-2 mt-2 px-2">
        <p className="text-[9px] text-[#9ca3af] leading-relaxed">
          Save to <code className="bg-[#f0f0f0] px-0.5 rounded">~/.claude/skills/</code> or <code className="bg-[#f0f0f0] px-0.5 rounded">.claude/skills/</code>
        </p>
      </div>
    </div>
  )
}
