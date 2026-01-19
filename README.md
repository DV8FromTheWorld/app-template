# App Template

A cross-platform monorepo template for building web and React Native apps with shared code.

## Features

- **Monorepo**: Turborepo + pnpm workspaces
- **Web**: React 18 + Rspack + react-router-dom
- **Native**: React Native + Expo + @react-navigation
- **API**: Fastify 5 + Zod validation
- **Shared**: TypeScript types and Zod schemas
- **State**: Zustand with cross-platform persistence
- **Design System**: Themed components for web and native

## Project Structure

```
app-template/
├── apps/
│   ├── api/           # Fastify API server (port 3001)
│   ├── app/           # React + React Native shared code
│   └── native/        # React Native entry point
├── packages/
│   └── shared/        # Shared Zod schemas & types
├── llm-context/       # Documentation for AI assistants
└── turbo.json         # Turborepo config
```

## Getting Started

```bash
# Install dependencies
pnpm install

# Start API server (port 3001)
pnpm api

# Start web app (port 3000)
pnpm app

# Start React Native (Metro bundler)
pnpm native

# Build and run iOS app
pnpm ios

# Build and run Android app
pnpm android
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Monorepo | Turborepo + pnpm |
| Web | React 18, Rspack, CSS Modules |
| Native | React Native, Expo |
| API | Fastify 5, Zod validation |
| State | Zustand with persistence |
| Shared | TypeScript, Zod schemas |

## Code Sharing Pattern

Web and Native apps share code through the modules pattern:

```
apps/app/src/modules/{feature}/
├── types.tsx           # Shared types
├── store.tsx           # Shared state (Zustand)
├── services/           # Shared API calls
├── web/                # Web-specific UI
└── native/             # Native-specific UI
```

Platform-specific files use extensions:
- `.web.tsx` - Web only (resolved by Rspack)
- `.native.tsx` - Native only (resolved by Metro)
- `.tsx` - Shared (used by both)

## Commands

| Command | Description |
|---------|-------------|
| `pnpm api` | Start API server |
| `pnpm app` | Start web dev server |
| `pnpm native` | Start Metro bundler |
| `pnpm ios` | Build and run iOS app |
| `pnpm android` | Build and run Android app |
| `pnpm build` | Build all packages |
| `pnpm typecheck` | TypeScript check all packages |
| `pnpm lint` | Run ESLint |
| `pnpm format` | Format code with Prettier |

## Example Features

The template includes working examples of:

1. **Counter** - Zustand store with persistence
2. **Items API** - CRUD operations with Fastify + Zod
3. **Design System** - Themed Text and Heading components

## For AI Assistants

See `AGENTS.md` for detailed instructions on working with this codebase, and `llm-context/` for architecture documentation.
