import { z } from 'zod'

// Valid tool names for allowed-tools field
export const SkillToolNames = [
  'Read',
  'Grep',
  'Glob',
  'Bash',
  'Bash(*)',
  'Edit',
  'Write',
  'WebFetch',
  'WebSearch',
  'Task',
  'NotebookEdit',
] as const

export type SkillToolName = typeof SkillToolNames[number]

// Valid model values
export const SkillModels = ['default', 'sonnet', 'opus', 'haiku'] as const
export type SkillModel = typeof SkillModels[number]

// Valid subagent types
export const SkillAgentTypes = ['Explore', 'Plan', 'general-purpose', 'Bash'] as const
export type SkillAgentType = typeof SkillAgentTypes[number]

// Skill frontmatter schema
export const SkillFrontmatterSchema = z.object({
  // Skill name - becomes the /slash-command
  name: z.string()
    .regex(/^[a-z0-9-]+$/, 'Name must be lowercase letters, numbers, and hyphens only')
    .max(64, 'Name must be 64 characters or less')
    .optional(),

  // Description - critical for auto-invocation by Claude
  description: z.string()
    .max(500, 'Description should be concise (500 chars max)')
    .optional(),

  // Hint shown during autocomplete
  'argument-hint': z.string()
    .max(64, 'Argument hint should be concise')
    .optional(),

  // Prevent Claude from auto-loading (user must invoke manually)
  'disable-model-invocation': z.boolean().optional(),

  // Show in / menu (when false, only Claude can trigger)
  'user-invocable': z.boolean().optional(),

  // Tools Claude can use without permission
  'allowed-tools': z.string().optional(), // Comma-separated list

  // Model to use for this skill
  model: z.string().optional(),

  // Run in subagent context
  context: z.enum(['fork']).optional(),

  // Subagent type when context=fork
  agent: z.string().optional(),

  // Skill-scoped hooks (optional, advanced)
  hooks: z.record(z.string(), z.unknown()).optional(),
})

// Full skill schema
export const SkillSchema = z.object({
  // Frontmatter fields
  frontmatter: SkillFrontmatterSchema,

  // Markdown content/instructions
  content: z.string(),
})

// Types
export type SkillFrontmatter = z.infer<typeof SkillFrontmatterSchema>
export type Skill = z.infer<typeof SkillSchema>

// Helper to validate skill
export function validateSkill(skill: Skill): { valid: boolean; errors: string[] } {
  try {
    SkillSchema.parse(skill)
    return { valid: true, errors: [] }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`)
      }
    }
    return { valid: false, errors: ['Unknown validation error'] }
  }
}

// Helper to generate SKILL.md content from skill object
export function generateSkillMarkdown(skill: Skill): string {
  const { frontmatter, content } = skill

  // Build frontmatter YAML
  const frontmatterLines: string[] = []

  if (frontmatter.name) {
    frontmatterLines.push(`name: ${frontmatter.name}`)
  }
  if (frontmatter.description) {
    // Multi-line descriptions need special handling
    if (frontmatter.description.includes('\n')) {
      frontmatterLines.push(`description: |`)
      frontmatter.description.split('\n').forEach(line => {
        frontmatterLines.push(`  ${line}`)
      })
    } else {
      frontmatterLines.push(`description: ${frontmatter.description}`)
    }
  }
  if (frontmatter['argument-hint']) {
    frontmatterLines.push(`argument-hint: ${frontmatter['argument-hint']}`)
  }
  if (frontmatter['disable-model-invocation'] !== undefined) {
    frontmatterLines.push(`disable-model-invocation: ${frontmatter['disable-model-invocation']}`)
  }
  if (frontmatter['user-invocable'] !== undefined) {
    frontmatterLines.push(`user-invocable: ${frontmatter['user-invocable']}`)
  }
  if (frontmatter['allowed-tools']) {
    frontmatterLines.push(`allowed-tools: ${frontmatter['allowed-tools']}`)
  }
  if (frontmatter.model) {
    frontmatterLines.push(`model: ${frontmatter.model}`)
  }
  if (frontmatter.context) {
    frontmatterLines.push(`context: ${frontmatter.context}`)
  }
  if (frontmatter.agent) {
    frontmatterLines.push(`agent: ${frontmatter.agent}`)
  }

  // Build final markdown
  if (frontmatterLines.length > 0) {
    return `---\n${frontmatterLines.join('\n')}\n---\n\n${content}`
  }

  return content
}

// Helper to parse SKILL.md content into skill object
export function parseSkillMarkdown(markdown: string): Skill {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n\n?([\s\S]*)$/
  const match = markdown.match(frontmatterRegex)

  if (!match) {
    return {
      frontmatter: {},
      content: markdown.trim()
    }
  }

  const [, frontmatterYaml, content] = match
  const frontmatter: SkillFrontmatter = {}

  // Simple YAML parsing (handles basic key: value pairs)
  const lines = frontmatterYaml.split('\n')
  let currentKey = ''
  let multilineValue = ''
  let isMultiline = false

  for (const line of lines) {
    if (isMultiline) {
      if (line.startsWith('  ')) {
        multilineValue += (multilineValue ? '\n' : '') + line.slice(2)
        continue
      } else {
        // End of multiline
        if (currentKey && multilineValue) {
          (frontmatter as Record<string, unknown>)[currentKey] = multilineValue
        }
        isMultiline = false
        multilineValue = ''
      }
    }

    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue

    const key = line.slice(0, colonIndex).trim()
    let value = line.slice(colonIndex + 1).trim()

    if (value === '|' || value === '>') {
      isMultiline = true
      currentKey = key
      continue
    }

    // Parse boolean values
    if (value === 'true') {
      (frontmatter as Record<string, unknown>)[key] = true
    } else if (value === 'false') {
      (frontmatter as Record<string, unknown>)[key] = false
    } else {
      (frontmatter as Record<string, unknown>)[key] = value
    }
  }

  // Handle last multiline value
  if (isMultiline && currentKey && multilineValue) {
    (frontmatter as Record<string, unknown>)[currentKey] = multilineValue
  }

  return {
    frontmatter,
    content: content.trim()
  }
}
