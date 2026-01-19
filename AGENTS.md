# AGENTS.md - AI Agent Instructions

This file provides instructions for AI agents (GitHub Copilot, Cursor, Claude, etc.) working on this codebase.

## Project Summary

This is a **cross-platform app template** with a shared codebase for web and React Native. It includes a Fastify API backend with Zod validation.

## Architecture

- **Monorepo**: Turborepo + pnpm workspaces
- **API**: Fastify + Zod (port 3001) at `apps/api/`
- **App**: React + Rspack (port 3000) at `apps/app/` - shared code for web and native
- **Native**: React Native entry point at `apps/native/` - uses code from `apps/app/`
- **Shared**: Common types at `packages/shared/`

## Frontend Architecture (apps/app/)

The frontend uses a **modules-based architecture** for code sharing between web and React Native:

```
apps/app/src/
├── entrypoints/           # Platform bootstrapping
│   ├── web/App.tsx        # Web entry (react-router-dom)
│   └── native/App.tsx     # Native entry (@react-navigation)
├── modules/               # Feature slices (vertical slices)
│   ├── routing/           # Routes + platform-specific routers
│   │   ├── routes.tsx     # Shared route definitions
│   │   ├── types.tsx      # Route param types
│   │   ├── web/Router.tsx
│   │   └── native/Router.tsx
│   ├── home/              # Example feature module
│   │   ├── types.tsx      # Shared types
│   │   ├── store.tsx      # Zustand store (uses store module)
│   │   ├── services/      # API client
│   │   ├── hooks/         # Shared React hooks
│   │   ├── components/    # Reusable components
│   │   │   ├── web/       # Web-specific components
│   │   │   └── native/    # Native-specific components
│   │   ├── web/           # Web page/screen
│   │   └── native/        # Native page/screen
│   ├── store/             # Store infrastructure
│   │   ├── createStore.tsx    # Factory functions
│   │   ├── registry.tsx       # Initializer registration
│   │   └── useStoreInit.tsx   # Init hook
│   └── storage/           # Platform-agnostic storage
│       ├── storage.tsx        # Web (localStorage)
│       └── storage.native.tsx # Native (AsyncStorage)
├── config/                # Environment configuration
│   ├── env.tsx            # Web env
│   └── env.native.tsx     # Native env
├── design/                # Design system
│   ├── theme.tsx          # Colors, spacing, typography
│   ├── types.tsx          # Variant type definitions
│   └── components/        # Text, Heading components
└── styles/                # Global CSS variables
```

### Module Pattern

Each feature module follows this structure:
- **Root level**: Shared logic (store, types, services)
- **web/ folder**: Web-specific React components
- **native/ folder**: React Native components

### Code Conventions

- **All TypeScript files use .tsx extension** (even without JSX)
- **No barrel files** (index.ts) - use direct imports
- **Path aliases**: Use `@/` prefix for imports from `apps/app/src/`:
  ```typescript
  import { useCounterStore } from '@/modules/home/store';
  import { Text } from '@/design/components/Text/web/Text';
  ```
- **Platform extensions**: `.web.tsx` and `.native.tsx` for platform-specific code

## Key Files

| When working on... | Look at these files |
|-------------------|---------------------|
| API routes | `apps/api/src/routes/items.ts` |
| Frontend routing | `apps/app/src/modules/routing/` |
| State management | `apps/app/src/modules/store/` |
| Example feature | `apps/app/src/modules/home/` |
| Design system | `apps/app/src/design/` |
| Full context | `llm-context/PROJECT-CONTEXT.md` |
| iOS Simulator automation | `llm-context/IOS-SIMULATOR-AUTOMATION.md` |

## TypeScript & ESLint Conventions

- Project uses `exactOptionalPropertyTypes: true`
- Optional properties must be typed as `field?: T | undefined`
- All API responses validated with Zod schemas
- **ESLint enforces strict boolean expressions** - run `pnpm lint` to check
- **Explicit null checks**: Use ternary `? :` instead of `&&` short-circuiting
  ```typescript
  // ❌ Wrong - implicit boolean conversion
  {error && <ErrorMessage>{error}</ErrorMessage>}
  
  // ❌ Wrong - still using && short-circuit
  {error !== null && <ErrorMessage>{error}</ErrorMessage>}
  
  // ✅ Correct - explicit ternary with null
  {error !== null ? <ErrorMessage>{error}</ErrorMessage> : null}
  
  // ✅ Correct - loose equality catches both null and undefined
  {value != null ? <Component value={value} /> : null}
  ```

## API Patterns

- Use Fastify with Zod type provider
- Return proper HTTP status codes (200, 201, 204, 404, 500)
- Define Zod schemas for request body, params, and response

Example route structure:
```typescript
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

export const myRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get('/', {
    schema: {
      response: { 200: MyResponseSchema },
    },
  }, async () => {
    return { /* typed response */ };
  });
};
```

## Store Pattern

Use the store module's factory functions instead of Zustand directly:

```typescript
import { createStore, createPersistentStore } from '../store/createStore';

// Simple store
export const useMyStore = createStore<MyState>()(() => ({
  value: 0,
}));

// Persistent store (survives app restart)
export const useMyStore = createPersistentStore<MyState>()(
  () => ({ value: 0 }),
  { name: 'my-store-key' }
);

// Actions as separate functions
export function increment(): void {
  useMyStore.setState((s) => ({ value: s.value + 1 }));
}
```

## Common Tasks

### Adding a new API route
1. Create route file in `apps/api/src/routes/{name}.ts`
2. Define Zod schemas for request/response
3. Register in `apps/api/src/index.ts`

### Adding a new frontend feature
1. Create module folder in `apps/app/src/modules/{feature}/`
2. Add shared logic (store, types, services) at module root
3. Add platform-specific UI in `web/` and `native/` subfolders
4. Add route in `modules/routing/routes.tsx`
5. Wire up in platform-specific routers

### Adding a new store
1. Create store in your module: `modules/{feature}/store.tsx`
2. Use `createStore` or `createPersistentStore` from `modules/store/createStore`
3. If store needs async initialization, register in `modules/store/stores.tsx`

## After Making Changes

**ALWAYS run these checks after completing any task:**

```bash
# Check for TypeScript errors
pnpm typecheck

# Check for ESLint errors
pnpm lint
```

Fix any errors before considering the task complete. The linter enforces strict boolean expressions and other code quality rules.

## Testing Changes

All commands run from repo root:

```bash
# Start API (port 3001)
pnpm api

# Start web app (port 3000)
pnpm app

# Test API
curl "http://localhost:3001/items" | jq
```

## Cross-Platform Testing Requirements

**CRITICAL**: This is a web + React Native app. Any frontend changes MUST be tested on BOTH platforms.

### When to test both platforms
- Any change to `apps/app/src/modules/*/` (shared code)
- Any change to `apps/app/src/design/` (UI components)
- Any change to routing, navigation, or screens

### When single-platform testing is OK
- API-only changes (`apps/api/`)
- Web-specific changes (`modules/*/web/`)
- Native-specific changes (`modules/*/native/`)

### How to test (all commands from repo root)

**Web testing:**

```bash
# Terminal 1: Start API
pnpm api

# Terminal 2: Start web app
pnpm app
# Test at http://localhost:3000
```

**React Native testing:**

```bash
# Terminal 1: Start API (if not already running)
pnpm api

# Terminal 2: Start React Native JS server (Metro/Expo)
pnpm native

# Terminal 3: Build and launch iOS app (first time or after native changes)
pnpm ios
```

**Note:** `pnpm native` starts the Metro bundler that serves JS to the app. Keep it running while testing. `pnpm ios` builds the native app and installs it on the simulator - you only need to run this once unless native code changes.

For iOS Simulator automation (clicking, screenshots), see `llm-context/IOS-SIMULATOR-AUTOMATION.md`.

### Verification checklist

1. Feature works on web (browser)
2. Feature works on iOS Simulator
3. No TypeScript errors in either platform
4. UI looks correct on both platforms

## Design System

Use the design system components for consistent typography:

```typescript
// Web
import { Text } from '@/design/components/Text/web/Text';
import { Heading } from '@/design/components/Heading/web/Heading';

// Native
import { Text } from '@/design/components/Text/native/Text';
import { Heading } from '@/design/components/Heading/native/Heading';

// Usage
<Text variant="text-md/normal">Body text</Text>
<Text variant="text-sm/medium" color="text-muted">Muted label</Text>
<Heading level={1}>Page Title</Heading>
<Heading level={2} variant="header-md/semibold">Section</Heading>
```

Variant format: `{type}-{size}/{weight}` or `code`
- Text sizes: xs, sm, md, lg, xl
- Header sizes: sm, md, lg, xl, 2xl
- Weights: normal, medium, semibold, bold
- Colors: text-primary, text-secondary, text-muted, accent, success, warning, error

## Git Commits

When making changes:
- **Suggest commits** at logical checkpoints (after completing a feature, fix, or refactor)
- **Propose the commit message** with a clear, conventional format (e.g., `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`)
- **Ask for confirmation** before actually creating the commit
- Don't batch unrelated changes into a single commit

## Do NOT

- Don't create barrel files (index.ts) - use direct imports
- Don't use .ts extension - all TypeScript files should be .tsx
- Don't import Zustand directly - use the store module factories
- Don't duplicate theme files - native components import from `design/theme.tsx`
- Don't use relative imports with `../` - use `@/` path aliases instead
