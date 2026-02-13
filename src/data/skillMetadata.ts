import { SkillToolNames, SkillModels, SkillAgentTypes } from '@/schemas/skill.schema'

export type SkillFieldType = 'string' | 'textarea' | 'boolean' | 'select' | 'multiselect'

export interface SkillFieldMetadata {
  key: string
  label: string
  description: string
  type: SkillFieldType
  options?: string[]
  placeholder?: string
  example?: string
  docLink?: string
  advanced?: boolean
}

export const skillFieldMetadata: SkillFieldMetadata[] = [
  {
    key: 'name',
    label: 'Skill Name',
    description: 'The skill name becomes the /slash-command. Must be lowercase letters, numbers, and hyphens only. Max 64 characters.',
    type: 'string',
    placeholder: 'my-skill-name',
    example: 'code-reviewer',
    docLink: 'https://docs.anthropic.com/en/docs/claude-code/skills'
  },
  {
    key: 'description',
    label: 'Description',
    description: 'What the skill does and when to use it. This is critical for auto-invocation by Claude - be specific about triggers.',
    type: 'textarea',
    placeholder: 'Describe what this skill does and when Claude should use it...',
    example: 'Reviews code for style, bugs, and security issues. Use when asked to review a PR or code changes.',
    docLink: 'https://docs.anthropic.com/en/docs/claude-code/skills'
  },
  {
    key: 'argument-hint',
    label: 'Argument Hint',
    description: 'Hint shown during autocomplete to indicate expected arguments.',
    type: 'string',
    placeholder: '[issue-number]',
    example: '[file-path]'
  },
  {
    key: 'disable-model-invocation',
    label: 'Disable Model Invocation',
    description: 'When enabled, Claude cannot auto-load this skill - only users can invoke it via /command.',
    type: 'boolean'
  },
  {
    key: 'user-invocable',
    label: 'User Invocable',
    description: 'When disabled, this skill is hidden from the / menu and only Claude can trigger it.',
    type: 'boolean'
  },
  {
    key: 'allowed-tools',
    label: 'Allowed Tools',
    description: 'Tools Claude can use without permission prompts when executing this skill.',
    type: 'multiselect',
    options: [...SkillToolNames],
    example: 'Read, Grep, Glob'
  },
  {
    key: 'model',
    label: 'Model',
    description: 'Specify which Claude model to use for this skill.',
    type: 'select',
    options: ['', ...SkillModels],
    placeholder: 'Use default model'
  },
  {
    key: 'context',
    label: 'Execution Context',
    description: 'Set to "fork" to run this skill in a subagent with isolated context.',
    type: 'select',
    options: ['', 'fork'],
    advanced: true
  },
  {
    key: 'agent',
    label: 'Subagent Type',
    description: 'When context is "fork", specify which subagent type to use.',
    type: 'select',
    options: ['', ...SkillAgentTypes],
    advanced: true
  }
]

// Helper to get metadata by key
export function getSkillFieldMetadata(key: string): SkillFieldMetadata | undefined {
  return skillFieldMetadata.find(m => m.key === key)
}

// Get all basic (non-advanced) fields
export function getBasicSkillFields(): SkillFieldMetadata[] {
  return skillFieldMetadata.filter(m => !m.advanced)
}

// Get all advanced fields
export function getAdvancedSkillFields(): SkillFieldMetadata[] {
  return skillFieldMetadata.filter(m => m.advanced)
}
