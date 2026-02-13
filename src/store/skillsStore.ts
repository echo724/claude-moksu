import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Skill, SkillFrontmatter } from '@/schemas/skill.schema'
import { validateSkill, generateSkillMarkdown } from '@/schemas/skill.schema'

// Represents a saved skill with metadata
export interface SavedSkill {
  id: string
  name: string
  skill: Skill
  createdAt: number
  updatedAt: number
}

interface SkillsState {
  // List of saved skills (for demo purposes - in real app would read from filesystem)
  savedSkills: SavedSkill[]

  // Currently editing skill
  currentSkill: Skill

  // Current skill ID (null for new skill)
  currentSkillId: string | null

  // Validation errors for current skill
  validationErrors: string[]

  // Show preview panel
  showPreview: boolean

  // Actions
  setCurrentSkill: (skill: Skill) => void
  updateFrontmatter: <K extends keyof SkillFrontmatter>(key: K, value: SkillFrontmatter[K]) => void
  updateContent: (content: string) => void
  validateCurrentSkill: () => boolean
  resetCurrentSkill: () => void
  loadSkill: (id: string) => void
  saveSkill: () => string
  deleteSkill: (id: string) => void
  setShowPreview: (show: boolean) => void
  exportSkillMarkdown: () => string
}

// Default empty skill
const defaultSkill: Skill = {
  frontmatter: {
    'user-invocable': true,
  },
  content: ''
}

// Generate unique ID
function generateId(): string {
  return `skill-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useSkillsStore = create<SkillsState>()(
  persist(
    (set, get) => ({
      savedSkills: [],
      currentSkill: { ...defaultSkill },
      currentSkillId: null,
      validationErrors: [],
      showPreview: true,

      setCurrentSkill: (skill) => {
        set({ currentSkill: skill, validationErrors: [] })
      },

      updateFrontmatter: (key, value) => {
        set((state) => ({
          currentSkill: {
            ...state.currentSkill,
            frontmatter: {
              ...state.currentSkill.frontmatter,
              [key]: value
            }
          }
        }))
      },

      updateContent: (content) => {
        set((state) => ({
          currentSkill: {
            ...state.currentSkill,
            content
          }
        }))
      },

      validateCurrentSkill: () => {
        const { currentSkill } = get()
        const result = validateSkill(currentSkill)
        set({ validationErrors: result.errors })
        return result.valid
      },

      resetCurrentSkill: () => {
        set({
          currentSkill: { ...defaultSkill },
          currentSkillId: null,
          validationErrors: []
        })
      },

      loadSkill: (id) => {
        const { savedSkills } = get()
        const saved = savedSkills.find(s => s.id === id)
        if (saved) {
          set({
            currentSkill: saved.skill,
            currentSkillId: id,
            validationErrors: []
          })
        }
      },

      saveSkill: () => {
        const { currentSkill, currentSkillId, savedSkills } = get()
        const now = Date.now()

        if (currentSkillId) {
          // Update existing skill
          const updated = savedSkills.map(s =>
            s.id === currentSkillId
              ? {
                  ...s,
                  name: currentSkill.frontmatter.name || 'Untitled',
                  skill: currentSkill,
                  updatedAt: now
                }
              : s
          )
          set({ savedSkills: updated })
          return currentSkillId
        } else {
          // Create new skill
          const id = generateId()
          const newSkill: SavedSkill = {
            id,
            name: currentSkill.frontmatter.name || 'Untitled',
            skill: currentSkill,
            createdAt: now,
            updatedAt: now
          }
          set({
            savedSkills: [...savedSkills, newSkill],
            currentSkillId: id
          })
          return id
        }
      },

      deleteSkill: (id) => {
        const { savedSkills, currentSkillId } = get()
        set({
          savedSkills: savedSkills.filter(s => s.id !== id),
          ...(currentSkillId === id ? {
            currentSkillId: null,
            currentSkill: { ...defaultSkill }
          } : {})
        })
      },

      setShowPreview: (show) => {
        set({ showPreview: show })
      },

      exportSkillMarkdown: () => {
        const { currentSkill } = get()
        return generateSkillMarkdown(currentSkill)
      }
    }),
    {
      name: 'claude-moksu-skills',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        savedSkills: state.savedSkills,
        showPreview: state.showPreview
      }),
      version: 1,
    }
  )
)

// Selector hooks
export const useCurrentSkill = () => useSkillsStore((state) => state.currentSkill)
export const useSavedSkills = () => useSkillsStore((state) => state.savedSkills)
export const useSkillValidationErrors = () => useSkillsStore((state) => state.validationErrors)
