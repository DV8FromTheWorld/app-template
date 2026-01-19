# Cursor Rules for App Template

## Project Context

This is a cross-platform app template with shared code for web and React Native. Read `llm-context/PROJECT-CONTEXT.md` for full context.

## Code Style

- TypeScript with strict mode and `exactOptionalPropertyTypes: true`
- Optional properties: `field?: T | undefined` (not just `field?: T`)
- **Explicit null checks**: Use ternary `value != null ? <X /> : null` instead of `value && <X />` (loose `==` catches both null and undefined)
- Fastify + Zod for API validation
- React + CSS Modules for web frontend
- Use existing patterns from similar files

## File Organization

- API routes: `apps/api/src/routes/`
- Frontend modules: `apps/app/src/modules/{feature}/`
- Each module has: shared files at root, `web/` and `native/` subfolders for UI
- Design system: `apps/app/src/design/`

## API Conventions

- All responses use Zod schemas for validation
- Return proper HTTP status codes (200, 201, 204, 404, 500)
- Use Fastify with Zod type provider

## Import Pattern

- Use `@/` path aliases instead of relative imports (`../`)
- `@/` resolves to `apps/app/src/`
- Example: `import { Text } from '@/design/components/Text/web/Text'`

## Store Pattern

- Use `createStore` or `createPersistentStore` from `@/modules/store/createStore`
- Do NOT import Zustand directly
- Actions as standalone functions, not methods

## After Making Changes

**ALWAYS run these checks after completing any task:**

```bash
pnpm typecheck   # Check for TypeScript errors
pnpm lint        # Check for ESLint errors
```

Fix any errors before considering the task complete.

## Testing

All commands run from repo root.

**Frontend changes require testing BOTH platforms:**

```bash
# API (always needed)
pnpm api

# Web app
pnpm app

# React Native (need both - JS server + iOS build)
pnpm native   # Start Metro/Expo JS server (keep running)
pnpm ios      # Build and launch iOS app (once)
```

For iOS Simulator automation (clicking, screenshots), see `llm-context/IOS-SIMULATOR-AUTOMATION.md`.

### When to test both
- Changes to `apps/app/src/modules/*/` (shared code)
- Changes to design components
- Any routing or navigation changes

### Single-platform OK
- API changes: just test with curl
- Web-only files (`modules/*/web/`): just test web
- Native-only files (`modules/*/native/`): just test native

### Quick API test
```bash
curl "http://localhost:3001/items" | jq
```

## Common Imports

```typescript
// API routes
import { z } from 'zod';
import type { FastifyPluginAsync } from 'fastify';

// Store
import { createStore, createPersistentStore } from '@/modules/store/createStore';

// Design system (web)
import { Text } from '@/design/components/Text/web/Text';
import { Heading } from '@/design/components/Heading/web/Heading';

// Design system (native)
import { Text } from '@/design/components/Text/native/Text';
import { Heading } from '@/design/components/Heading/native/Heading';

// Environment config
import { env } from '@/config/env';
```
