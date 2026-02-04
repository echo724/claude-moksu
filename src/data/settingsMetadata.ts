export type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'enum'

export interface SettingMetadata {
  key: string
  label: string
  description: string
  type: FieldType
  enumValues?: string[]
  defaultValue?: unknown
  example?: string
  placeholder?: string
  section: 'general' | 'permissions' | 'sandbox' | 'mcp' | 'hooks' | 'statusLine' | 'attribution' | 'auth'
  advanced?: boolean
  managedOnly?: boolean
}

export const settingsMetadata: SettingMetadata[] = [
  // ==================== GENERAL SETTINGS ====================
  {
    key: 'model',
    label: 'Model',
    description: 'The Claude model to use. Can be an alias (default, sonnet, opus, haiku, opusplan) or a full model name.',
    type: 'string',
    section: 'general',
    example: 'opus',
    placeholder: 'e.g., opus, sonnet, haiku'
  },
  {
    key: 'language',
    label: 'Response Language',
    description: 'Configure Claude\'s preferred response language. Claude will respond in this language by default.',
    type: 'string',
    section: 'general',
    example: 'japanese',
    placeholder: 'e.g., japanese, spanish, french'
  },
  {
    key: 'autoUpdatesChannel',
    label: 'Auto Updates Channel',
    description: 'Release channel for updates. "stable" for tested versions (typically about one week old), "latest" for most recent.',
    type: 'enum',
    enumValues: ['stable', 'latest'],
    defaultValue: 'latest',
    section: 'general'
  },
  {
    key: 'cleanupPeriodDays',
    label: 'Cleanup Period (Days)',
    description: 'Sessions inactive for longer than this period are deleted at startup. Setting to 0 immediately deletes all sessions.',
    type: 'number',
    defaultValue: 30,
    section: 'general',
    example: '30'
  },
  {
    key: 'showTurnDuration',
    label: 'Show Turn Duration',
    description: 'Show turn duration messages after responses (e.g., "Cooked for 1m 6s").',
    type: 'boolean',
    defaultValue: true,
    section: 'general'
  },
  {
    key: 'spinnerTipsEnabled',
    label: 'Spinner Tips',
    description: 'Show tips in the spinner while Claude is working.',
    type: 'boolean',
    defaultValue: true,
    section: 'general'
  },
  {
    key: 'terminalProgressBarEnabled',
    label: 'Terminal Progress Bar',
    description: 'Enable the terminal progress bar that shows progress in supported terminals like Windows Terminal and iTerm2.',
    type: 'boolean',
    defaultValue: true,
    section: 'general'
  },
  {
    key: 'alwaysThinkingEnabled',
    label: 'Extended Thinking',
    description: 'Enable extended thinking by default for all sessions.',
    type: 'boolean',
    defaultValue: false,
    section: 'general'
  },
  {
    key: 'plansDirectory',
    label: 'Plans Directory',
    description: 'Customize where plan files are stored. Path is relative to project root.',
    type: 'string',
    defaultValue: '~/.claude/plans',
    section: 'general',
    placeholder: './plans'
  },
  {
    key: 'outputStyle',
    label: 'Output Style',
    description: 'Configure an output style to adjust the system prompt.',
    type: 'string',
    section: 'general',
    example: 'Explanatory',
    placeholder: 'e.g., Explanatory, Concise'
  },
  {
    key: 'respectGitignore',
    label: 'Respect Gitignore',
    description: 'Control whether the @ file picker respects .gitignore patterns. When true, files matching .gitignore patterns are excluded.',
    type: 'boolean',
    defaultValue: true,
    section: 'general'
  },
  {
    key: 'apiKeyHelper',
    label: 'API Key Helper',
    description: 'Custom script to generate an auth value. This value will be sent as X-Api-Key and Authorization headers.',
    type: 'string',
    section: 'general',
    example: '/bin/generate_temp_api_key.sh',
    advanced: true
  },
  {
    key: 'companyAnnouncements',
    label: 'Company Announcements',
    description: 'Announcements to display to users at startup. Multiple announcements are cycled through randomly.',
    type: 'array',
    section: 'general',
    example: '["Welcome to Acme Corp!"]',
    advanced: true
  },
  {
    key: 'env',
    label: 'Environment Variables',
    description: 'Environment variables that will be applied to every session.',
    type: 'object',
    section: 'general',
    example: '{"FOO": "bar"}',
    advanced: true
  },

  // ==================== PERMISSION SETTINGS ====================
  {
    key: 'permissions.defaultMode',
    label: 'Default Mode',
    description: 'Default permission mode when opening Claude Code. Controls how tools are approved.',
    type: 'enum',
    enumValues: ['default', 'acceptEdits', 'plan', 'dontAsk', 'bypassPermissions'],
    section: 'permissions'
  },
  {
    key: 'permissions.allow',
    label: 'Allow Rules',
    description: 'Array of permission rules to allow tool use without prompting. Format: Tool or Tool(specifier).',
    type: 'array',
    section: 'permissions',
    example: 'Bash(npm run *), Bash(git commit *)'
  },
  {
    key: 'permissions.ask',
    label: 'Ask Rules',
    description: 'Array of permission rules that prompt for confirmation upon tool use.',
    type: 'array',
    section: 'permissions',
    example: 'Bash(git push *)'
  },
  {
    key: 'permissions.deny',
    label: 'Deny Rules',
    description: 'Array of permission rules to deny tool use. Use this to exclude sensitive files from Claude Code access.',
    type: 'array',
    section: 'permissions',
    example: 'Read(./.env), WebFetch'
  },
  {
    key: 'permissions.additionalDirectories',
    label: 'Additional Directories',
    description: 'Additional working directories that Claude has access to.',
    type: 'array',
    section: 'permissions',
    example: '../docs/, /shared/libs'
  },
  {
    key: 'permissions.disableBypassPermissionsMode',
    label: 'Disable Bypass Permissions',
    description: 'Set to "disable" to prevent bypassPermissions mode from being activated.',
    type: 'enum',
    enumValues: ['disable'],
    section: 'permissions',
    managedOnly: true
  },

  // ==================== SANDBOX SETTINGS ====================
  {
    key: 'sandbox.enabled',
    label: 'Enable Sandbox',
    description: 'Enable bash sandboxing for filesystem and network isolation.',
    type: 'boolean',
    defaultValue: false,
    section: 'sandbox'
  },
  {
    key: 'sandbox.autoAllowBashIfSandboxed',
    label: 'Auto-allow Bash in Sandbox',
    description: 'Auto-approve bash commands when sandboxed.',
    type: 'boolean',
    defaultValue: true,
    section: 'sandbox'
  },
  {
    key: 'sandbox.excludedCommands',
    label: 'Excluded Commands',
    description: 'Commands that should run outside of the sandbox.',
    type: 'array',
    section: 'sandbox',
    example: 'git, docker'
  },
  {
    key: 'sandbox.allowUnsandboxedCommands',
    label: 'Allow Unsandboxed Commands',
    description: 'Allow commands to run outside the sandbox via the dangerouslyDisableSandbox parameter.',
    type: 'boolean',
    defaultValue: true,
    section: 'sandbox'
  },
  {
    key: 'sandbox.enableWeakerNestedSandbox',
    label: 'Weaker Nested Sandbox',
    description: 'Enable weaker sandbox for unprivileged Docker environments (Linux/WSL2 only). Reduces security.',
    type: 'boolean',
    defaultValue: false,
    section: 'sandbox',
    advanced: true
  },
  {
    key: 'sandbox.network.allowedDomains',
    label: 'Allowed Domains',
    description: 'Array of domains to allow for outbound network traffic. Supports wildcards (e.g., *.example.com).',
    type: 'array',
    section: 'sandbox',
    example: 'github.com, *.npmjs.org'
  },
  {
    key: 'sandbox.network.httpProxyPort',
    label: 'HTTP Proxy Port',
    description: 'HTTP proxy port used if you wish to bring your own proxy.',
    type: 'number',
    section: 'sandbox',
    example: '8080'
  },
  {
    key: 'sandbox.network.socksProxyPort',
    label: 'SOCKS5 Proxy Port',
    description: 'SOCKS5 proxy port used if you wish to bring your own proxy.',
    type: 'number',
    section: 'sandbox',
    example: '8081'
  },
  {
    key: 'sandbox.network.allowUnixSockets',
    label: 'Allowed Unix Sockets',
    description: 'Unix socket paths accessible in sandbox (for SSH agents, etc.).',
    type: 'array',
    section: 'sandbox',
    example: '~/.ssh/agent-socket',
    advanced: true
  },
  {
    key: 'sandbox.network.allowAllUnixSockets',
    label: 'Allow All Unix Sockets',
    description: 'Allow all Unix socket connections in sandbox.',
    type: 'boolean',
    defaultValue: false,
    section: 'sandbox',
    advanced: true
  },
  {
    key: 'sandbox.network.allowLocalBinding',
    label: 'Allow Local Binding',
    description: 'Allow binding to localhost ports (macOS only).',
    type: 'boolean',
    defaultValue: false,
    section: 'sandbox',
    advanced: true
  },

  // ==================== MCP SETTINGS ====================
  {
    key: 'enableAllProjectMcpServers',
    label: 'Enable All Project MCP Servers',
    description: 'Automatically approve all MCP servers defined in project .mcp.json files.',
    type: 'boolean',
    defaultValue: false,
    section: 'mcp'
  },
  {
    key: 'enabledMcpjsonServers',
    label: 'Enabled MCP Servers',
    description: 'List of specific MCP servers from .mcp.json files to approve.',
    type: 'array',
    section: 'mcp',
    example: 'memory, github'
  },
  {
    key: 'disabledMcpjsonServers',
    label: 'Disabled MCP Servers',
    description: 'List of specific MCP servers from .mcp.json files to reject.',
    type: 'array',
    section: 'mcp',
    example: 'filesystem'
  },

  // ==================== HOOKS SETTINGS ====================
  {
    key: 'hooks',
    label: 'Hooks Configuration',
    description: 'Configure custom commands to run at lifecycle events. See hooks documentation for format.',
    type: 'object',
    section: 'hooks',
    advanced: true
  },
  {
    key: 'disableAllHooks',
    label: 'Disable All Hooks',
    description: 'Disable all hooks.',
    type: 'boolean',
    defaultValue: false,
    section: 'hooks'
  },

  // ==================== STATUS LINE SETTINGS ====================
  {
    key: 'statusLine.type',
    label: 'Status Line Type',
    description: 'The type of status line. Currently only "command" is supported.',
    type: 'enum',
    enumValues: ['command'],
    section: 'statusLine'
  },
  {
    key: 'statusLine.command',
    label: 'Status Line Command',
    description: 'Command/script path to execute for generating the status line.',
    type: 'string',
    section: 'statusLine',
    example: '~/.claude/statusline.sh'
  },
  {
    key: 'statusLine.padding',
    label: 'Status Line Padding',
    description: 'Padding value. Set to 0 to let status line go to edge.',
    type: 'number',
    defaultValue: 0,
    section: 'statusLine',
    example: '0'
  },

  // ==================== ATTRIBUTION SETTINGS ====================
  {
    key: 'attribution.commit',
    label: 'Commit Attribution',
    description: 'Attribution text for git commits. Empty string hides commit attribution.',
    type: 'string',
    section: 'attribution',
    example: 'Generated with Claude Code'
  },
  {
    key: 'attribution.pr',
    label: 'PR Attribution',
    description: 'Attribution text for pull request descriptions. Empty string hides PR attribution.',
    type: 'string',
    section: 'attribution',
    example: 'Generated with Claude Code'
  },

  // ==================== AUTH SETTINGS ====================
  {
    key: 'forceLoginMethod',
    label: 'Force Login Method',
    description: 'Restrict login to specific account types. "claudeai" for Claude.ai accounts, "console" for Claude Console (API billing) accounts.',
    type: 'enum',
    enumValues: ['claudeai', 'console'],
    section: 'auth'
  },
  {
    key: 'forceLoginOrgUUID',
    label: 'Force Login Org UUID',
    description: 'Specify the UUID of an organization to automatically select during login. Requires forceLoginMethod to be set.',
    type: 'string',
    section: 'auth',
    placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'
  }
]

// Helper to get metadata by key
export function getSettingMetadata(key: string): SettingMetadata | undefined {
  return settingsMetadata.find(m => m.key === key)
}

// Helper to get all settings for a section
export function getSettingsForSection(section: SettingMetadata['section']): SettingMetadata[] {
  return settingsMetadata.filter(m => m.section === section)
}
