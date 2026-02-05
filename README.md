# Claude Code Settings Builder

A modern, macOS-style GUI application for building and editing Claude Code settings.json files. Built with React, TypeScript, and Tailwind CSS.

## Features

- **macOS System Settings UI** - Familiar interface with sidebar navigation and clean form fields
- **All 43 Settings** - Complete coverage of Claude Code configuration options
- **Real-time Validation** - Zod-powered schema validation with instant feedback
- **Import/Export** - Load existing settings.json files and download new ones
- **Type-Safe** - Full TypeScript support with auto-generated types from schemas
- **Accessible** - ARIA labels, keyboard navigation, and focus management
- **Tested** - 37 passing unit and integration tests

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

Open http://localhost:5173 in your browser.

## Settings Categories

### General
- Model & Language
- Updates & Behavior
- Display Options
- Paths & Output
- Advanced settings

### Permissions
- Permission mode configuration
- Allow/Ask/Deny rules
- Additional directories

### Sandbox
- Sandbox basics
- Command exclusions
- Network settings
- Unix sockets

### MCP Servers
- Enable/disable project MCP servers
- Server allowlists/denylists

### Hooks
- Global hook toggle
- Individual hook commands (onProjectChange, onToolCall, etc.)

### Status Line
- Status line type (none/git/command)
- Custom command
- Padding configuration

### Attribution
- Git commit attribution
- Pull request attribution

### Authentication
- Force login method
- Organization UUID

## Usage

### Building a New Settings File

1. Navigate through categories using the sidebar
2. Fill in the settings you want to configure
3. Watch the JSON preview update in real-time
4. Click "Download settings.json" when ready

### Importing Existing Settings

1. Click "Import JSON" in the action bar
2. Select your existing settings.json file
3. Edit the imported settings
4. Download the updated configuration

### Validation

- Real-time validation shows errors immediately
- Download button is disabled when validation fails
- Expand the JSON Preview panel to see detailed error messages

## Architecture

```
src/
├── components/          # React components
│   ├── ActionBar/      # Import/Export controls
│   ├── FormFields/     # Reusable form inputs
│   ├── JsonPreview/    # Collapsible JSON viewer
│   ├── SettingsContent/# Card layouts
│   ├── SettingsSections/# Individual setting pages
│   ├── SettingsWindow/ # Main window shell
│   └── Sidebar/        # Navigation
├── data/               # Settings metadata
├── schemas/            # Zod validation schemas
├── store/              # Zustand state management
└── utils/              # Helper functions
```

## Technology Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Zod** - Schema validation
- **Zustand** - State management
- **Vite** - Build tool
- **Vitest** - Testing framework
- **Happy DOM** - Test environment

## Development

### Project Structure

- `/src/components` - React components organized by feature
- `/src/schemas` - Zod schemas matching Claude Code's settings
- `/src/data` - Settings metadata (labels, descriptions, examples)
- `/src/store` - Zustand store for global state
- `/tests` - Test files colocated with source

### Adding a New Setting

1. Add the schema to `/src/schemas/settings.schema.ts`
2. Add metadata to `/src/data/settingsMetadata.ts`
3. Add the form field to the appropriate section in `/src/components/SettingsSections`
4. Add tests if needed

### Running Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Building for Production

```bash
npm run build
```

The built files will be in the `/dist` directory.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes with tests
4. Ensure all tests pass
5. Submit a pull request

## License

MIT

## Related

- [Claude Code Documentation](https://github.com/anthropics/claude-code)
- [Claude Code Settings Reference](https://docs.anthropic.com/claude-code/settings)

---

Built with ❤️ for the Claude Code community
