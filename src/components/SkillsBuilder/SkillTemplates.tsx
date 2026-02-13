import { X, Code, GitBranch, FileText, TestTube, Zap, Search } from 'lucide-react'
import { skillTemplates, type SkillTemplate } from '@/data/skillTemplates'
import { useSkillsStore } from '@/store/skillsStore'

interface SkillTemplatesProps {
  onClose: () => void
}

const categoryIcons: Record<SkillTemplate['category'], React.ReactNode> = {
  code: <Code size={16} />,
  git: <GitBranch size={16} />,
  docs: <FileText size={16} />,
  testing: <TestTube size={16} />,
  automation: <Zap size={16} />,
  research: <Search size={16} />,
}

const categoryLabels: Record<SkillTemplate['category'], string> = {
  code: 'Code',
  git: 'Git',
  docs: 'Documentation',
  testing: 'Testing',
  automation: 'Automation',
  research: 'Research',
}

const categoryColors: Record<SkillTemplate['category'], string> = {
  code: 'bg-blue-100 text-blue-700 border-blue-200',
  git: 'bg-orange-100 text-orange-700 border-orange-200',
  docs: 'bg-green-100 text-green-700 border-green-200',
  testing: 'bg-purple-100 text-purple-700 border-purple-200',
  automation: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  research: 'bg-pink-100 text-pink-700 border-pink-200',
}

export function SkillTemplates({ onClose }: SkillTemplatesProps) {
  const setCurrentSkill = useSkillsStore((state) => state.setCurrentSkill)

  const handleSelectTemplate = (template: SkillTemplate) => {
    setCurrentSkill(template.skill)
    onClose()
  }

  // Group templates by category
  const templatesByCategory = skillTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = []
    }
    acc[template.category].push(template)
    return acc
  }, {} as Record<SkillTemplate['category'], SkillTemplate[]>)

  const categories = Object.keys(templatesByCategory) as SkillTemplate['category'][]

  return (
    <div className="flex flex-col h-full bg-[#fafafa]">
      {/* Header */}
      <div className="px-6 py-4 border-b border-[#e5e5e7] bg-white flex items-center justify-between">
        <div>
          <h2 className="text-[15px] font-semibold text-[#1d1d1f]">Skill Templates</h2>
          <p className="text-[12px] text-[#6e6e73] mt-0.5">
            Choose a template to get started quickly
          </p>
        </div>
        <button
          onClick={onClose}
          className="p-2 text-[#6e6e73] hover:text-[#1d1d1f] hover:bg-[#f5f5f7] rounded-md transition-colors"
        >
          <X size={18} />
        </button>
      </div>

      {/* Templates grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          {categories.map((category) => (
            <div key={category}>
              <div className="flex items-center gap-2 mb-3">
                <span className={`p-1.5 rounded-md ${categoryColors[category].split(' ')[0]} ${categoryColors[category].split(' ')[1]}`}>
                  {categoryIcons[category]}
                </span>
                <h3 className="text-[13px] font-medium text-[#1d1d1f]">
                  {categoryLabels[category]}
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {templatesByCategory[category].map((template) => (
                  <button
                    key={template.id}
                    onClick={() => handleSelectTemplate(template)}
                    className="text-left p-4 bg-white border border-[#e5e5e7] rounded-lg hover:border-[#0066CC] hover:shadow-sm transition-all group"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="text-[13px] font-medium text-[#1d1d1f] group-hover:text-[#0066CC]">
                            {template.name}
                          </h4>
                          {template.skill.frontmatter.name && (
                            <code className="text-[10px] text-[#6e6e73] bg-[#f5f5f7] px-1.5 py-0.5 rounded">
                              /{template.skill.frontmatter.name}
                            </code>
                          )}
                        </div>
                        <p className="text-[11px] text-[#6e6e73] mt-1 line-clamp-2">
                          {template.description}
                        </p>
                      </div>
                      <span className={`flex-shrink-0 text-[10px] px-2 py-0.5 rounded-full border ${categoryColors[template.category]}`}>
                        {categoryLabels[template.category]}
                      </span>
                    </div>

                    {/* Template preview hints */}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {template.skill.frontmatter['allowed-tools'] && (
                        <span className="text-[10px] text-[#9ca3af] bg-[#f5f5f7] px-2 py-0.5 rounded">
                          Tools: {template.skill.frontmatter['allowed-tools']}
                        </span>
                      )}
                      {template.skill.frontmatter.context === 'fork' && (
                        <span className="text-[10px] text-[#9ca3af] bg-[#f5f5f7] px-2 py-0.5 rounded">
                          Runs in subagent
                        </span>
                      )}
                      {template.skill.frontmatter['disable-model-invocation'] && (
                        <span className="text-[10px] text-[#9ca3af] bg-[#f5f5f7] px-2 py-0.5 rounded">
                          User-only trigger
                        </span>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-[#e5e5e7] bg-white">
        <p className="text-[11px] text-[#6e6e73]">
          Templates provide a starting point - customize them to fit your workflow.
          <a
            href="https://docs.anthropic.com/en/docs/claude-code/skills"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0066CC] hover:underline ml-1"
          >
            Learn more about skills →
          </a>
        </p>
      </div>
    </div>
  )
}
