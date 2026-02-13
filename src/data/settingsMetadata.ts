export type FieldType = 'string' | 'number' | 'boolean' | 'array' | 'object' | 'enum' | 'hookEvent'

export interface SettingMetadata {
  key: string
  label: string
  description: string
  type: FieldType
  enumValues?: string[]
  defaultValue?: unknown
  example?: string
  placeholder?: string
  section: 'general' | 'permissions' | 'sandbox' | 'mcp' | 'hooks' | 'statusLine' | 'attribution' | 'auth' | 'plugins'
  advanced?: boolean
  managedOnly?: boolean
  docLink?: string  // Link to Claude Code documentation
}

export const settingsMetadata: SettingMetadata[] = [
  // ==================== GENERAL SETTINGS ====================
  {
    key: 'model',
    label: 'Model',
    description: 'The Claude model to use. Can be an alias (default, sonnet, opus, haiku, opusplan) or a full model name.',
    type: 'enum',
    enumValues: ['default', 'sonnet', 'opus', 'haiku', 'sonnet[1m]', 'opusplan'],
    section: 'general',
    example: 'opus',
    docLink: 'https://docs.anthropic.com/en/docs/claude-code/model'
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
    placeholder: 'e.g., Explanatory, Concise',
    docLink: 'https://docs.anthropic.com/en/docs/claude-code/output-styles'
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
  {
    key: 'otelHeadersHelper',
    label: 'OpenTelemetry Headers Helper',
    description: 'Script to generate OpenTelemetry headers for tracing and observability.',
    type: 'string',
    section: 'general',
    example: '/bin/generate_otel_headers.sh',
    placeholder: 'e.g., ~/.claude/otel-headers.sh',
    advanced: true
  },
  {
    key: 'fileSuggestion.type',
    label: 'File Suggestion Type',
    description: 'Type of file autocomplete. Currently only "command" is supported.',
    type: 'enum',
    enumValues: ['command'],
    section: 'general',
    advanced: true
  },
  {
    key: 'fileSuggestion.command',
    label: 'File Suggestion Command',
    description: 'Custom script for file autocomplete in the @ file picker.',
    type: 'string',
    section: 'general',
    example: '~/.claude/file-suggest.sh',
    placeholder: 'e.g., ./scripts/file-autocomplete.sh',
    advanced: true
  },
  {
    key: 'spinnerVerbs.mode',
    label: 'Spinner Verbs Mode',
    description: 'How to combine custom verbs with defaults. "replace" replaces defaults, "append" adds to them.',
    type: 'enum',
    enumValues: ['replace', 'append'],
    section: 'general',
    advanced: true
  },
  {
    key: 'spinnerVerbs.verbs',
    label: 'Spinner Verbs',
    description: 'Custom verbs to display in the spinner while Claude is working.',
    type: 'array',
    section: 'general',
    example: 'Analyzing, Processing, Computing',
    advanced: true
  },
  {
    key: 'prefersReducedMotion',
    label: 'Reduced Motion',
    description: 'Reduce UI animations for accessibility.',
    type: 'boolean',
    defaultValue: false,
    section: 'general'
  },
  {
    key: 'teammateMode',
    label: 'Teammate Mode',
    description: 'Controls how agent teams are displayed. "auto" detects tmux/screen, "in-process" shows inline, "tmux" uses tmux panes.',
    type: 'enum',
    enumValues: ['auto', 'in-process', 'tmux'],
    section: 'general',
    advanced: true
  },
  {
    key: '$schema',
    label: 'JSON Schema URL',
    description: 'URL to the JSON schema for settings validation.',
    type: 'string',
    section: 'general',
    example: 'https://code.claude.com/schemas/settings.json',
    placeholder: 'e.g., https://code.claude.com/schemas/settings.json',
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
  {
    key: 'permissions.allowManagedHooksOnly',
    label: 'Allow Managed Hooks Only',
    description: 'Restrict hooks to only those defined in managed settings (typically set by IT/admins).',
    type: 'boolean',
    defaultValue: false,
    section: 'permissions',
    managedOnly: true
  },
  {
    key: 'permissions.allowManagedPermissionRulesOnly',
    label: 'Allow Managed Permission Rules Only',
    description: 'Restrict permission rules to only those defined in managed settings (typically set by IT/admins).',
    type: 'boolean',
    defaultValue: false,
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
  {
    key: 'allowedMcpServers',
    label: 'Allowed MCP Servers',
    description: 'Allowlist of MCP server names that are permitted to run. Only these servers will be allowed.',
    type: 'array',
    section: 'mcp',
    example: 'brave-search, github, memory',
    managedOnly: true
  },
  {
    key: 'deniedMcpServers',
    label: 'Denied MCP Servers',
    description: 'Denylist of MCP server names that are prohibited from running.',
    type: 'array',
    section: 'mcp',
    example: 'filesystem, exec',
    managedOnly: true
  },
  {
    key: 'strictKnownMarketplaces',
    label: 'Strict Known Marketplaces',
    description: 'Restrict plugin installations to specific marketplace URLs only.',
    type: 'array',
    section: 'mcp',
    example: 'https://claude.com/marketplace',
    managedOnly: true,
    advanced: true
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
    section: 'hooks',
    docLink: 'https://docs.anthropic.com/en/docs/claude-code/hooks'
  },
  {
    key: 'hooks.SessionStart',
    label: 'Session Start',
    description: 'Runs when Claude Code starts a new session or resumes an existing session. Useful for loading development context or setting up environment variables.',
    type: 'hookEvent',
    section: 'hooks',
    example: 'echo "export NODE_ENV=production" >> "$CLAUDE_ENV_FILE"',
    placeholder: 'e.g., source .env',
    docLink: 'https://code.claude.com/docs/en/hooks#sessionstart'
  },
  {
    key: 'hooks.UserPromptSubmit',
    label: 'User Prompt Submit',
    description: 'Runs when you submit a prompt, before Claude processes it. Allows you to add context, validate prompts, or block certain types of prompts.',
    type: 'hookEvent',
    section: 'hooks',
    example: 'echo "[$(date)] $PROMPT" >> ~/claude-history.txt',
    placeholder: 'e.g., validate-prompt.sh',
    docLink: 'https://code.claude.com/docs/en/hooks#userpromptsubmit'
  },
  {
    key: 'hooks.PreToolUse',
    label: 'Pre Tool Use',
    description: 'Runs before a tool call executes. Can block, allow, or modify tool calls. Matches on tool name: Bash, Edit, Write, Read, Glob, Grep, Task, WebFetch, WebSearch, and MCP tools.',
    type: 'hookEvent',
    section: 'hooks',
    example: '.claude/hooks/validate-bash.sh',
    placeholder: 'e.g., block-rm.sh',
    docLink: 'https://code.claude.com/docs/en/hooks#pretooluse'
  },
  {
    key: 'hooks.PermissionRequest',
    label: 'Permission Request',
    description: 'Runs when a permission dialog appears. Can allow or deny on behalf of the user.',
    type: 'hookEvent',
    section: 'hooks',
    example: '.claude/hooks/auto-approve.sh',
    placeholder: 'e.g., permission-handler.sh',
    docLink: 'https://code.claude.com/docs/en/hooks#permissionrequest'
  },
  {
    key: 'hooks.PostToolUse',
    label: 'Post Tool Use',
    description: 'Runs immediately after a tool completes successfully. Useful for running linters, formatters, or logging after file changes.',
    type: 'hookEvent',
    section: 'hooks',
    example: '.claude/hooks/run-lint.sh',
    placeholder: 'e.g., format-code.sh',
    docLink: 'https://code.claude.com/docs/en/hooks#posttooluse'
  },
  {
    key: 'hooks.PostToolUseFailure',
    label: 'Post Tool Use Failure',
    description: 'Runs when a tool execution fails. Use this to log failures, send alerts, or provide corrective feedback to Claude.',
    type: 'hookEvent',
    section: 'hooks',
    example: 'notify-send "Tool failed: $TOOL_NAME"',
    placeholder: 'e.g., log-failure.sh',
    docLink: 'https://code.claude.com/docs/en/hooks#posttoolusefailure'
  },
  {
    key: 'hooks.Notification',
    label: 'Notification',
    description: 'Runs when Claude Code sends notifications. Matches on type: permission_prompt, idle_prompt, auth_success, elicitation_dialog.',
    type: 'hookEvent',
    section: 'hooks',
    example: 'osascript -e \'display notification "$MESSAGE"\'',
    placeholder: 'e.g., notify.sh',
    docLink: 'https://code.claude.com/docs/en/hooks#notification'
  },
  {
    key: 'hooks.SubagentStart',
    label: 'Subagent Start',
    description: 'Runs when a subagent is spawned via the Task tool. Matches on agent type: Bash, Explore, Plan, or custom agent names.',
    type: 'hookEvent',
    section: 'hooks',
    example: 'echo "Subagent started: $AGENT_TYPE"',
    placeholder: 'e.g., track-agents.sh',
    docLink: 'https://code.claude.com/docs/en/hooks#subagentstart'
  },
  {
    key: 'hooks.SubagentStop',
    label: 'Subagent Stop',
    description: 'Runs when a subagent finishes. Can control whether the subagent should continue or stop.',
    type: 'hookEvent',
    section: 'hooks',
    example: 'echo "Subagent completed: $AGENT_TYPE"',
    placeholder: 'e.g., cleanup-agent.sh',
    docLink: 'https://code.claude.com/docs/en/hooks#subagentstop'
  },
  {
    key: 'hooks.Stop',
    label: 'Stop',
    description: 'Runs when Claude finishes responding. Can prevent Claude from stopping and force it to continue working.',
    type: 'hookEvent',
    section: 'hooks',
    example: '.claude/hooks/verify-complete.sh',
    placeholder: 'e.g., check-tasks.sh',
    docLink: 'https://code.claude.com/docs/en/hooks#stop'
  },
  {
    key: 'hooks.PreCompact',
    label: 'Pre Compact',
    description: 'Runs before context compaction. Matches on trigger: manual (from /compact) or auto (when context window is full).',
    type: 'hookEvent',
    section: 'hooks',
    example: 'echo "Context compacting..."',
    placeholder: 'e.g., backup-context.sh',
    docLink: 'https://code.claude.com/docs/en/hooks#precompact'
  },
  {
    key: 'hooks.SessionEnd',
    label: 'Session End',
    description: 'Runs when a Claude Code session ends. Useful for cleanup tasks, logging session statistics, or saving session state.',
    type: 'hookEvent',
    section: 'hooks',
    example: 'echo "Session ended at $(date)"',
    placeholder: 'e.g., cleanup.sh',
    docLink: 'https://code.claude.com/docs/en/hooks#sessionend'
  },

  // ==================== STATUS LINE SETTINGS ====================
  {
    key: 'statusLine.type',
    label: 'Status Line Type',
    description: 'The type of status line. Currently only "command" is supported.',
    type: 'enum',
    enumValues: ['command'],
    section: 'statusLine',
    docLink: 'https://docs.anthropic.com/en/docs/claude-code/statusline'
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
  },
  {
    key: 'awsAuthRefresh',
    label: 'AWS Auth Refresh',
    description: 'Script to refresh AWS credentials for authentication.',
    type: 'string',
    section: 'auth',
    example: '~/.aws/refresh-credentials.sh',
    placeholder: 'e.g., /usr/local/bin/aws-refresh.sh',
    advanced: true
  },
  {
    key: 'awsCredentialExport',
    label: 'AWS Credential Export',
    description: 'Script to export AWS credentials to environment variables.',
    type: 'string',
    section: 'auth',
    example: '~/.aws/export-credentials.sh',
    placeholder: 'e.g., /usr/local/bin/aws-export.sh',
    advanced: true
  },

  // ==================== PLUGINS SETTINGS ====================
  {
    key: 'enabledPlugins',
    label: 'Enabled Plugins',
    description: 'Map of plugin names to boolean values controlling which plugins are enabled or disabled.',
    type: 'object',
    section: 'plugins',
    example: '{"plugin-name": true, "other-plugin": false}'
  },
  {
    key: 'extraKnownMarketplaces',
    label: 'Extra Marketplaces',
    description: 'Additional plugin marketplaces. Maps marketplace URLs to display names.',
    type: 'object',
    section: 'plugins',
    example: '{"https://example.com/marketplace": "Example Marketplace"}'
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
