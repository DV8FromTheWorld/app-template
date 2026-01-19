# LLM Context Files

This folder contains context documents for LLMs working on this project.

## Files

| File | Description |
|------|-------------|
| `PROJECT-CONTEXT.md` | **Main context document** - Architecture, patterns, and implementation details |
| `INITIAL-SETUP.md` | Tech stack decisions and architectural choices |
| `TYPESCRIPT-ESLINT-SETUP.md` | Guide for strict boolean expressions and path aliasing |
| `IOS-SIMULATOR-AUTOMATION.md` | Guide for programmatically interacting with iOS Simulator |

## For LLMs

When starting work on this project:

1. **Read `PROJECT-CONTEXT.md` first** - It contains everything you need to know about:
   - Cross-platform code sharing strategy
   - Module pattern and file organization
   - State management approach
   - Design system usage
   - API patterns

2. **Key files to reference**:
   
   **Backend:**
   - `apps/api/src/routes/items.ts` - Example CRUD API routes
   - `apps/api/src/index.ts` - API entry point
   
   **Frontend:**
   - `apps/app/src/modules/routing/` - Routes and platform routers
   - `apps/app/src/modules/home/` - Example feature module
   - `apps/app/src/modules/store/` - Store infrastructure
   - `apps/app/src/design/` - Design system

3. **Frontend architecture:**
   ```
   apps/app/src/
   ├── entrypoints/           # Platform bootstrapping (web/native)
   ├── modules/               # Feature slices
   │   └── {feature}/
   │       ├── types.tsx      # Shared types
   │       ├── store.tsx      # Zustand store
   │       ├── services/      # API calls
   │       ├── web/           # Web UI
   │       └── native/        # Native UI
   ├── config/                # Environment config
   └── design/                # Design system
   ```

4. **Code conventions:**
   - All TypeScript files use `.tsx` extension
   - No barrel files (`index.ts`) - use direct imports
   - `exactOptionalPropertyTypes: true` - use `field?: T | undefined`
   - Explicit null checks: `value != null ? <X /> : null` (not `value && <X />`)

5. **ALWAYS run after making changes:**
   ```bash
   pnpm typecheck   # Check for TypeScript errors
   pnpm lint        # Check for ESLint errors (enforces strict boolean expressions)
   ```
   
   Fix any errors before considering the task complete.

6. **Testing changes**:
   ```bash
   # Start API
   pnpm api
   
   # Start web app
   pnpm app
   
   # Test endpoint
   curl "http://localhost:3001/items" | jq
   ```
