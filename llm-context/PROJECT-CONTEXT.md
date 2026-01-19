# App Template - LLM Context Document

This document provides comprehensive context for LLMs working on this project.

## Project Overview

**Purpose**: A cross-platform monorepo template for building web and React Native apps with shared code.

**Key Goals**:
1. Share business logic between web and native platforms
2. Provide consistent design system across platforms
3. Type-safe API with Zod validation
4. Demonstrate best practices for monorepo development

## Architecture

### Monorepo Structure (Turborepo + pnpm)

```
app-template/
├── apps/
│   ├── api/              # Fastify API server (port 3001)
│   │   └── src/
│   │       ├── index.ts          # Entry point, CORS setup
│   │       └── routes/
│   │           └── items.ts      # Example CRUD routes
│   │
│   ├── app/              # React + Rspack (port 3000) - shared web/native code
│   │   └── src/
│   │       ├── entrypoints/      # Platform bootstrapping
│   │       │   ├── web/App.tsx
│   │       │   └── native/App.tsx
│   │       ├── modules/          # Feature slices
│   │       │   ├── routing/      # Routes + routers
│   │       │   ├── home/         # Example feature
│   │       │   ├── store/        # Store infrastructure
│   │       │   └── storage/      # Platform storage
│   │       ├── config/           # Environment config
│   │       └── design/           # Design system
│   │
│   └── native/           # React Native entry point
│       └── index.js      # Points to apps/app code
│
├── packages/
│   └── shared/           # Shared types and schemas
└── llm-context/          # This folder - LLM documentation
```

### Tech Stack

- **Backend**: Fastify + Zod (validation) + TypeScript
- **Frontend**: React + Rspack + CSS Modules
- **Native**: React Native (entry point in apps/native, code in apps/app)
- **Package Manager**: pnpm with workspaces
- **Build**: Turborepo for monorepo orchestration

## Frontend Module Architecture

The frontend uses **vertical slices** (modules) for code sharing between web and React Native:

```
modules/{feature}/
├── types.tsx           # Shared types/interfaces
├── store.tsx           # Zustand store (uses store module)
├── services/           # API client functions
│   └── {feature}Api.tsx
├── hooks/              # Shared React hooks
│   └── use{Feature}.tsx
├── components/         # Reusable components
│   ├── web/            # Web-specific components
│   └── native/         # Native-specific components
├── web/                # Web page/screen
│   ├── {Feature}Page.tsx
│   └── {Feature}Page.module.css
└── native/             # Native page/screen
    └── {Feature}Screen.tsx
```

**Key conventions:**
- All TypeScript files use `.tsx` extension (even without JSX)
- No barrel files (`index.ts`) - use direct imports
- **Path aliases**: Use `@/` prefix for imports (e.g., `@/modules/home/store`)
- **Explicit null checks**: Use ternary `value != null ? <X /> : null` instead of `value && <X />`
- Platform-agnostic logic at module root
- Platform-specific UI in `web/` or `native/` subfolders

## Key Patterns

### 1. Store Pattern

Use the store module's factory functions instead of Zustand directly:

```typescript
// modules/{feature}/store.tsx
import { createPersistentStore } from '@/modules/store/createStore';

interface CounterState {
  count: number;
}

export const useCounterStore = createPersistentStore<CounterState>()(
  () => ({ count: 0 }),
  { name: 'counter-store' }
);

// Actions as standalone functions
export function increment(): void {
  useCounterStore.setState((s) => ({ count: s.count + 1 }));
}
```

Benefits:
- Cross-platform persistence (localStorage on web, AsyncStorage on native)
- Consistent pattern across features
- Type-safe actions and selectors

### 2. Store Initialization

For stores that need async initialization:

```typescript
// modules/{feature}/store.tsx
export async function initialize(): Promise<void> {
  // Load initial data, validate session, etc.
}

// modules/store/stores.tsx
import { registerInitializer } from '@/modules/store/registry';
import { initialize } from '@/modules/{feature}/store';

registerInitializer(initialize);
```

### 3. Platform-Specific Code

Use file extensions for platform differences:

```
modules/storage/
├── storage.tsx         # Web implementation (localStorage)
└── storage.native.tsx  # Native implementation (AsyncStorage)
```

The bundler resolves the correct file:
- Rspack: prefers `.web.tsx`, falls back to `.tsx`
- Metro: prefers `.native.tsx`, falls back to `.tsx`

### 4. Environment Configuration

```typescript
// config/env.tsx (web)
export const env = {
  apiUrl: getApiUrl(), // Dynamic: uses window.location.hostname
};

// config/env.native.tsx (native)
export const env = {
  apiUrl: getApiUrl(), // Platform-aware: localhost, 10.0.2.2, or IP
};
```

### 5. API Route Pattern

```typescript
// apps/api/src/routes/items.ts
import type { FastifyPluginAsync } from 'fastify';
import type { ZodTypeProvider } from 'fastify-type-provider-zod';
import { z } from 'zod';

const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const itemRoutes: FastifyPluginAsync = async (fastify) => {
  const app = fastify.withTypeProvider<ZodTypeProvider>();

  app.get('/', {
    schema: {
      response: { 200: z.array(ItemSchema) },
    },
  }, async () => {
    return items;
  });

  app.post('/', {
    schema: {
      body: z.object({ name: z.string() }),
      response: { 201: ItemSchema },
    },
  }, async (request, reply) => {
    const item = { id: '...', name: request.body.name };
    return reply.status(201).send(item);
  });
};
```

### 6. Design System

The design system provides consistent typography across platforms:

```typescript
// Variant format: {type}-{size}/{weight}
<Text variant="text-md/normal">Body text</Text>
<Text variant="text-sm/medium" color="text-muted">Label</Text>
<Heading level={1}>Title</Heading>
```

Theme values are shared between platforms:
- Web: CSS variables in `styles/variables.css`
- Native: JS constants in `design/theme.tsx`

## TypeScript Conventions

### File Extensions

All TypeScript files use `.tsx` extension, even without JSX. This simplifies tooling and allows adding JSX later without renaming.

### exactOptionalPropertyTypes

The project uses `exactOptionalPropertyTypes: true`. This means:

```typescript
// ❌ Wrong
interface Foo {
  bar?: string;
}
const foo: Foo = { bar: undefined }; // Error!

// ✅ Correct
interface Foo {
  bar?: string | undefined;
}
```

### No Barrel Files

Don't create `index.ts` files to re-export. Use `@/` path aliases:

```typescript
// ❌ Wrong - barrel file
import { useCounterStore } from '@/modules/home';

// ❌ Wrong - relative imports
import { useCounterStore } from '../home/store';

// ✅ Correct - direct import with @/ alias
import { useCounterStore } from '@/modules/home/store';
```

## After Making Changes

**ALWAYS run these checks after completing any task:**

```bash
# Check for TypeScript errors
pnpm typecheck

# Check for ESLint errors  
pnpm lint
```

Fix any errors before considering the task complete. The linter enforces strict boolean expressions (no `value &&` patterns) and other code quality rules.

## Running the Project

All commands run from repo root:

```bash
# Install dependencies
pnpm install

# Start API (port 3001)
pnpm api

# Start web app (port 3000)
pnpm app

# Start React Native dev server (Metro/Expo)
pnpm native

# Build and run iOS app (separate terminal)
pnpm ios
```

## Cross-Platform Testing

**CRITICAL**: This is a web + React Native app. Any changes to shared frontend code MUST be tested on BOTH platforms.

### When to test both platforms
- Any change to `apps/app/src/modules/*/` (shared code)
- Any change to `apps/app/src/design/` (UI components)
- Any change to routing, navigation, or screens

### When single-platform testing is OK
- API-only changes (`apps/api/`)
- Web-specific changes (`modules/*/web/`)
- Native-specific changes (`modules/*/native/`)

### How to test

**Web testing:**
```bash
pnpm api    # Terminal 1: Start API
pnpm app    # Terminal 2: Start web app → http://localhost:3000
```

**React Native testing:**
```bash
pnpm api    # Terminal 1: Start API (if not already running)
pnpm native # Terminal 2: Start Metro/Expo JS server (keep running)
pnpm ios    # Terminal 3: Build and launch iOS app (once)
```

## File Quick Reference

| File | Purpose |
|------|---------|
| `apps/api/src/index.ts` | Fastify entry, CORS setup |
| `apps/api/src/routes/items.ts` | Example CRUD API routes |
| `apps/app/src/entrypoints/web/App.tsx` | Web entry point |
| `apps/app/src/modules/routing/web/Router.tsx` | Web router |
| `apps/app/src/modules/home/web/HomePage.tsx` | Example web page |
| `apps/app/src/modules/home/native/HomeScreen.tsx` | Example native screen |
| `apps/app/src/modules/store/createStore.tsx` | Store factory |
| `apps/app/src/design/theme.tsx` | Theme constants |
