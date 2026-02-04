import { z } from 'zod'

// Permission modes enum
export const PermissionModeSchema = z.enum([
  'default',
  'acceptEdits',
  'plan',
  'dontAsk',
  'bypassPermissions'
])

// Permission rules - array of strings following Tool(specifier) format
const PermissionRuleSchema = z.array(z.string())

// Permissions object
export const PermissionsSchema = z.object({
  allow: PermissionRuleSchema.optional(),
  ask: PermissionRuleSchema.optional(),
  deny: PermissionRuleSchema.optional(),
  additionalDirectories: z.array(z.string()).optional(),
  defaultMode: PermissionModeSchema.optional(),
  disableBypassPermissionsMode: z.literal('disable').optional()
})

// Sandbox network settings
export const SandboxNetworkSchema = z.object({
  allowUnixSockets: z.array(z.string()).optional(),
  allowAllUnixSockets: z.boolean().optional(),
  allowLocalBinding: z.boolean().optional(),
  allowedDomains: z.array(z.string()).optional(),
  httpProxyPort: z.number().int().min(1).max(65535).optional(),
  socksProxyPort: z.number().int().min(1).max(65535).optional()
})

// Sandbox settings
export const SandboxSchema = z.object({
  enabled: z.boolean().optional(),
  autoAllowBashIfSandboxed: z.boolean().optional(),
  excludedCommands: z.array(z.string()).optional(),
  allowUnsandboxedCommands: z.boolean().optional(),
  enableWeakerNestedSandbox: z.boolean().optional(),
  network: SandboxNetworkSchema.optional()
})

// Status line settings
export const StatusLineSchema = z.object({
  type: z.literal('command').optional(),
  command: z.string().optional(),
  padding: z.number().int().min(0).optional()
})

// Attribution settings
export const AttributionSchema = z.object({
  commit: z.string().optional(),
  pr: z.string().optional()
})

// Spinner verbs settings
export const SpinnerVerbsSchema = z.object({
  mode: z.enum(['replace', 'append']).optional(),
  verbs: z.array(z.string()).optional()
})

// Complete settings schema
export const ClaudeSettingsSchema = z.object({
  // General settings
  apiKeyHelper: z.string().optional(),
  cleanupPeriodDays: z.number().int().min(0).optional(),
  companyAnnouncements: z.array(z.string()).optional(),
  env: z.record(z.string(), z.string()).optional(),
  model: z.string().optional(),
  language: z.string().optional(),
  autoUpdatesChannel: z.enum(['stable', 'latest']).optional(),
  showTurnDuration: z.boolean().optional(),
  spinnerTipsEnabled: z.boolean().optional(),
  terminalProgressBarEnabled: z.boolean().optional(),
  alwaysThinkingEnabled: z.boolean().optional(),
  plansDirectory: z.string().optional(),
  outputStyle: z.string().optional(),
  respectGitignore: z.boolean().optional(),
  spinnerVerbs: SpinnerVerbsSchema.optional(),
  otelHeadersHelper: z.string().optional(),

  // Attribution settings
  attribution: AttributionSchema.optional(),

  // Permissions settings
  permissions: PermissionsSchema.optional(),

  // Sandbox settings
  sandbox: SandboxSchema.optional(),

  // MCP settings
  enableAllProjectMcpServers: z.boolean().optional(),
  enabledMcpjsonServers: z.array(z.string()).optional(),
  disabledMcpjsonServers: z.array(z.string()).optional(),

  // Hooks settings
  hooks: z.record(z.string(), z.unknown()).optional(),
  disableAllHooks: z.boolean().optional(),

  // Status line settings
  statusLine: StatusLineSchema.optional(),

  // Auth settings
  forceLoginMethod: z.enum(['claudeai', 'console']).optional(),
  forceLoginOrgUUID: z.string().optional(),

  // File suggestion settings
  fileSuggestion: z.object({
    type: z.literal('command').optional(),
    command: z.string().optional()
  }).optional()
})

export type ClaudeSettings = z.infer<typeof ClaudeSettingsSchema>
export type Permissions = z.infer<typeof PermissionsSchema>
export type Sandbox = z.infer<typeof SandboxSchema>
export type SandboxNetwork = z.infer<typeof SandboxNetworkSchema>
export type StatusLine = z.infer<typeof StatusLineSchema>
export type Attribution = z.infer<typeof AttributionSchema>
export type PermissionMode = z.infer<typeof PermissionModeSchema>
