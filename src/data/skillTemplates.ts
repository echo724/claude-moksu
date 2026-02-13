import type { Skill } from '@/schemas/skill.schema'

export interface SkillTemplate {
  id: string
  name: string
  description: string
  category: 'code' | 'git' | 'docs' | 'testing' | 'automation' | 'research'
  skill: Skill
}

export const skillTemplates: SkillTemplate[] = [
  {
    id: 'code-reviewer',
    name: 'Code Reviewer',
    description: 'Review code for style, bugs, security issues, and best practices',
    category: 'code',
    skill: {
      frontmatter: {
        name: 'code-reviewer',
        description: 'Reviews code for style consistency, potential bugs, security vulnerabilities, and best practices. Use when asked to review code changes, a PR, or specific files.',
        'argument-hint': '[file-path or PR number]',
        'allowed-tools': 'Read, Grep, Glob',
        'user-invocable': true,
      },
      content: `# Code Review Instructions

When reviewing code, analyze the following aspects:

## 1. Security
- Check for injection vulnerabilities (SQL, XSS, command injection)
- Look for hardcoded secrets or credentials
- Verify proper input validation and sanitization
- Review authentication and authorization logic

## 2. Code Quality
- Check for code duplication
- Verify proper error handling
- Look for potential null/undefined issues
- Review naming conventions and readability

## 3. Performance
- Identify potential performance bottlenecks
- Check for unnecessary loops or computations
- Look for memory leaks or resource management issues

## 4. Best Practices
- Verify adherence to project conventions
- Check for proper typing (if TypeScript)
- Review test coverage if applicable

Provide feedback in a constructive manner, explaining the "why" behind each suggestion.`
    }
  },
  {
    id: 'commit-helper',
    name: 'Commit Helper',
    description: 'Generate commit messages following project conventions',
    category: 'git',
    skill: {
      frontmatter: {
        name: 'commit',
        description: 'Generates conventional commit messages based on staged changes. Use when asked to commit, create a commit, or write a commit message.',
        'allowed-tools': 'Bash(*)',
        'user-invocable': true,
      },
      content: `# Commit Message Generator

Generate a commit message for the staged changes following these conventions:

## Format
\`\`\`
<type>(<scope>): <subject>

<body>

<footer>
\`\`\`

## Types
- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, no logic change)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks

## Rules
1. Subject line max 72 characters
2. Use imperative mood ("add" not "added")
3. Don't end subject with period
4. Separate subject from body with blank line
5. Body should explain "what" and "why"

First run \`git diff --staged\` to see what's being committed, then generate an appropriate message.`
    }
  },
  {
    id: 'test-writer',
    name: 'Test Writer',
    description: 'Write unit tests for code files',
    category: 'testing',
    skill: {
      frontmatter: {
        name: 'write-tests',
        description: 'Writes comprehensive unit tests for the specified code. Use when asked to add tests, write tests, or improve test coverage.',
        'argument-hint': '[file-path]',
        'allowed-tools': 'Read, Write, Grep, Glob',
        'user-invocable': true,
      },
      content: `# Test Writing Instructions

When writing tests for the specified file:

## Process
1. Read and understand the code being tested
2. Identify all public functions/methods to test
3. Determine edge cases and error scenarios
4. Write comprehensive test cases

## Test Structure
- Group related tests using describe blocks
- Use clear, descriptive test names
- Follow AAA pattern: Arrange, Act, Assert
- Test both happy path and error cases

## Coverage Goals
- Test all public API methods
- Cover edge cases (empty inputs, null values, boundaries)
- Test error handling and exceptions
- Verify async behavior if applicable

## Naming Convention
\`\`\`
describe('FunctionName', () => {
  it('should return X when given Y', () => {
    // test
  })
})
\`\`\`

Match the testing framework and patterns used in the project.`
    }
  },
  {
    id: 'api-generator',
    name: 'API Generator',
    description: 'Generate REST API endpoints with boilerplate',
    category: 'code',
    skill: {
      frontmatter: {
        name: 'api-gen',
        description: 'Generates REST API endpoint boilerplate including route handlers, validation, and types. Use when asked to create a new API endpoint or route.',
        'argument-hint': '[resource-name]',
        'allowed-tools': 'Read, Write, Grep, Glob',
        'user-invocable': true,
      },
      content: `# API Generator

Generate a complete REST API endpoint for the specified resource.

## Output Structure
1. Route handler file
2. Request/Response types
3. Validation schema
4. Basic error handling

## REST Conventions
- GET /resources - List all
- GET /resources/:id - Get one
- POST /resources - Create
- PUT /resources/:id - Update
- DELETE /resources/:id - Delete

## Include
- Input validation
- Error responses (400, 404, 500)
- TypeScript types
- JSDoc comments

Match the existing patterns in the codebase for consistency.`
    }
  },
  {
    id: 'documentation',
    name: 'Documentation',
    description: 'Generate documentation for code',
    category: 'docs',
    skill: {
      frontmatter: {
        name: 'docs',
        description: 'Generates documentation for code including README sections, API docs, and inline comments. Use when asked to document code or create documentation.',
        'argument-hint': '[file-path or topic]',
        'allowed-tools': 'Read, Write, Grep, Glob',
        'user-invocable': true,
      },
      content: `# Documentation Generator

Generate clear, comprehensive documentation for the specified code or topic.

## Documentation Types
- **README**: Project overview, setup, usage
- **API Docs**: Endpoint descriptions, parameters, responses
- **Inline**: JSDoc/TSDoc comments
- **Guides**: How-to tutorials

## Format Guidelines
- Use clear, concise language
- Include code examples
- Add table of contents for long docs
- Use proper markdown formatting

## Structure
1. Overview/Introduction
2. Installation/Setup (if applicable)
3. Usage examples
4. API reference
5. Troubleshooting (if applicable)

Read the code thoroughly to understand its purpose before documenting.`
    }
  },
  {
    id: 'issue-fixer',
    name: 'Issue Fixer',
    description: 'Fix a GitHub issue by number',
    category: 'git',
    skill: {
      frontmatter: {
        name: 'fix-issue',
        description: 'Analyzes and fixes a GitHub issue. Use when asked to fix issue #N or resolve a specific issue.',
        'argument-hint': '[issue-number]',
        'allowed-tools': 'Read, Write, Edit, Grep, Glob, Bash(*)',
        'user-invocable': true,
      },
      content: `# Issue Fixer

Fix the specified GitHub issue.

## Process
1. Fetch issue details: \`gh issue view $ARGUMENTS\`
2. Understand the problem from description and comments
3. Find relevant code files
4. Implement the fix
5. Write tests if applicable
6. Summarize the changes made

## Guidelines
- Read the issue carefully including all comments
- Understand root cause before fixing
- Make minimal, focused changes
- Test the fix manually if possible
- Consider edge cases mentioned in the issue`
    }
  },
  {
    id: 'deploy-script',
    name: 'Deploy Script',
    description: 'Run deployment steps for the project',
    category: 'automation',
    skill: {
      frontmatter: {
        name: 'deploy',
        description: 'Runs the deployment process for the project. Use when asked to deploy or push to production.',
        'argument-hint': '[environment: staging|production]',
        'allowed-tools': 'Bash(*)',
        'user-invocable': true,
        'disable-model-invocation': true,
      },
      content: `# Deployment Helper

Execute deployment steps for the specified environment.

## Pre-deployment Checks
1. Ensure all tests pass
2. Check for uncommitted changes
3. Verify on correct branch

## Deployment Steps
Customize these steps for your project:

1. \`npm run build\` - Build the project
2. \`npm run test\` - Run tests
3. Deploy to target environment

## Safety
- Always confirm environment before deploying
- Check for breaking changes
- Have rollback plan ready

**Note:** This is a template - customize the commands for your specific deployment process.`
    }
  },
  {
    id: 'research',
    name: 'Research',
    description: 'Deep dive research into a codebase topic',
    category: 'research',
    skill: {
      frontmatter: {
        name: 'research',
        description: 'Performs deep research into a codebase topic, architecture, or implementation detail. Use when asked to investigate, explore, or understand how something works.',
        'argument-hint': '[topic or question]',
        'allowed-tools': 'Read, Grep, Glob',
        context: 'fork',
        agent: 'Explore',
        'user-invocable': true,
      },
      content: `# Codebase Research

Investigate the specified topic thoroughly.

## Research Process
1. Search for relevant files and code
2. Trace code paths and dependencies
3. Document findings
4. Provide architecture overview if applicable

## Output
Provide a comprehensive summary including:
- How the feature/system works
- Key files and their purposes
- Important patterns or conventions used
- Potential areas for improvement (if asked)

Be thorough but concise. Use code references with file paths and line numbers.`
    }
  }
]

// Get template by ID
export function getSkillTemplate(id: string): SkillTemplate | undefined {
  return skillTemplates.find(t => t.id === id)
}

// Get templates by category
export function getTemplatesByCategory(category: SkillTemplate['category']): SkillTemplate[] {
  return skillTemplates.filter(t => t.category === category)
}

// Get all unique categories
export function getTemplateCategories(): SkillTemplate['category'][] {
  return [...new Set(skillTemplates.map(t => t.category))]
}
