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
  disableBypassPermissionsMode: z.literal('disable').optional(),
  allowManagedHooksOnly: z.boolean().optional(),
  allowManagedPermissionRulesOnly: z.boolean().optional()
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

// Hook handler schema - discriminated union based on type
const CommandHookSchema = z.object({
  type: z.literal('command'),
  command: z.string(),
  timeout: z.number().int().min(1).optional(),
  statusMessage: z.string().optional(),
  once: z.boolean().optional(),
  async: z.boolean().optional()
})

const PromptHookSchema = z.object({
  type: z.literal('prompt'),
  prompt: z.string(),
  timeout: z.number().int().min(1).optional(),
  statusMessage: z.string().optional(),
  once: z.boolean().optional(),
  model: z.string().optional()
})

const AgentHookSchema = z.object({
  type: z.literal('agent'),
  prompt: z.string(),
  timeout: z.number().int().min(1).optional(),
  statusMessage: z.string().optional(),
  once: z.boolean().optional(),
  model: z.string().optional()
})

export const HookHandlerSchema = z.discriminatedUnion('type', [
  CommandHookSchema,
  PromptHookSchema,
  AgentHookSchema
])

// Matcher group schema - contains matcher pattern and array of hook handlers
export const HookMatcherGroupSchema = z.object({
  matcher: z.string().optional(), // Regex pattern to filter when hooks fire
  hooks: z.array(HookHandlerSchema)
})

// Valid hook event names
export const HookEventNames = [
  'SessionStart',
  'UserPromptSubmit',
  'PreToolUse',
  'PermissionRequest',
  'PostToolUse',
  'PostToolUseFailure',
  'Notification',
  'SubagentStart',
  'SubagentStop',
  'Stop',
  'PreCompact',
  'SessionEnd'
] as const

export type HookEventName = typeof HookEventNames[number]

// Hooks schema - each event is optional, maps to array of matcher groups
const HookEventArraySchema = z.array(HookMatcherGroupSchema).optional()

export const HooksSchema = z.object({
  SessionStart: HookEventArraySchema,
  UserPromptSubmit: HookEventArraySchema,
  PreToolUse: HookEventArraySchema,
  PermissionRequest: HookEventArraySchema,
  PostToolUse: HookEventArraySchema,
  PostToolUseFailure: HookEventArraySchema,
  Notification: HookEventArraySchema,
  SubagentStart: HookEventArraySchema,
  SubagentStop: HookEventArraySchema,
  Stop: HookEventArraySchema,
  PreCompact: HookEventArraySchema,
  SessionEnd: HookEventArraySchema
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
  prefersReducedMotion: z.boolean().optional(),
  teammateMode: z.enum(['auto', 'in-process', 'tmux']).optional(),

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
  allowedMcpServers: z.array(z.string()).optional(),
  deniedMcpServers: z.array(z.string()).optional(),
  strictKnownMarketplaces: z.array(z.string()).optional(),

  // Hooks settings
  hooks: HooksSchema.optional(),
  disableAllHooks: z.boolean().optional(),

  // Status line settings
  statusLine: StatusLineSchema.optional(),

  // Auth settings
  forceLoginMethod: z.enum(['claudeai', 'console']).optional(),
  forceLoginOrgUUID: z.string().optional(),
  awsAuthRefresh: z.string().optional(),
  awsCredentialExport: z.string().optional(),

  // Plugins settings
  enabledPlugins: z.record(z.string(), z.boolean()).optional(),
  extraKnownMarketplaces: z.record(z.string(), z.string()).optional(),

  // File suggestion settings
  fileSuggestion: z.object({
    type: z.literal('command').optional(),
    command: z.string().optional()
  }).optional(),

  // Schema reference
  $schema: z.string().optional()
})

export type ClaudeSettings = z.infer<typeof ClaudeSettingsSchema>
export type Permissions = z.infer<typeof PermissionsSchema>
export type Sandbox = z.infer<typeof SandboxSchema>
export type SandboxNetwork = z.infer<typeof SandboxNetworkSchema>
export type StatusLine = z.infer<typeof StatusLineSchema>
export type Attribution = z.infer<typeof AttributionSchema>
export type PermissionMode = z.infer<typeof PermissionModeSchema>
export type HookHandler = z.infer<typeof HookHandlerSchema>
export type HookMatcherGroup = z.infer<typeof HookMatcherGroupSchema>
export type Hooks = z.infer<typeof HooksSchema>
