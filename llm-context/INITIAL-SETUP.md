# Project Setup Context

## What Was Built

A **Turborepo monorepo** with pnpm workspaces containing:

```
app-template/
├── apps/
│   ├── app/          # React + React Native shared code (rspack for web)
│   ├── native/       # React Native entry point
│   └── api/          # Fastify API with Zod validation
├── packages/
│   └── shared/       # Shared Zod schemas & types
├── turbo.json        # Task orchestration config
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── .prettierrc
└── .gitignore
```

---

## Key Decisions Made

| Topic | Decision | Reasoning |
|-------|----------|-----------|
| **Monorepo tool** | Turborepo + pnpm | Automatic build order, caching, simpler than Nx |
| **API framework** | Fastify (not Hono/Express) | Cleaner route code with Zod, first-class TypeScript |
| **Validation** | Zod + fastify-type-provider-zod | Typed request bodies after validation |
| **Bundler** | Rspack | Fast Rust-based bundler, webpack compatible |
| **State** | Zustand with custom factories | Cross-platform persistence, consistent patterns |
| **Formatting** | Prettier (root-level) | Single config for entire monorepo |
| **File extensions** | `.tsx` for all TypeScript | Consistency, allows adding JSX without rename |
| **Module pattern** | Vertical slices | Code sharing between web and native |

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Monorepo | Turborepo 2.x + pnpm 9.x |
| Frontend | React 18 + Rspack + react-router-dom |
| Native | React Native + Expo + @react-navigation |
| Backend | Fastify 5 + fastify-type-provider-zod |
| Validation | Zod 3 |
| State | Zustand 5 with persistence |
| Shared | TypeScript package with Zod schemas |
| Formatting | Prettier 3 |

---

## Commands

```bash
pnpm api              # Start API server (port 3001)
pnpm app              # Start web app (port 3000)
pnpm native           # Start Metro bundler
pnpm ios              # Build and run iOS app
pnpm android          # Build and run Android app
pnpm build            # Build all packages (respects dependency order)
pnpm typecheck        # TypeScript check
pnpm format           # Prettier format
pnpm format:check     # Check formatting (CI)

# Filter to specific app
pnpm dev --filter=@repo/app
pnpm dev --filter=@repo/api
```

---

## API Details

- Runs on port **3001**
- Has Zod validation with automatic error responses
- Main routes in `apps/api/src/routes/items.ts`
- Uses `@repo/shared` for Zod schemas

**Endpoints:**
- `GET /health` - Health check
- `GET /items` - List items
- `GET /items/:id` - Get item
- `POST /items` - Create item
- `PUT /items/:id` - Update item
- `DELETE /items/:id` - Delete item

---

## Web App Details

- Runs on port **3000**
- Uses Rspack with SWC for fast builds
- `DefinePlugin` configured for `process.env.PUBLIC_API_URL`
- Uses react-router-dom for routing

---

## Frontend Architecture

The frontend (`apps/app/`) uses a modules-based architecture:

```
apps/app/src/
├── entrypoints/           # Platform entry points
│   ├── web/App.tsx
│   └── native/App.tsx
├── modules/               # Feature slices
│   ├── routing/           # Shared routes + platform routers
│   ├── home/              # Example feature
│   ├── store/             # Store infrastructure
│   └── storage/           # Platform storage
├── config/                # Environment configuration
└── design/                # Design system components
```

Each module contains:
- Shared logic at root (store, types, services)
- Platform-specific UI in `web/` and `native/` subfolders

---

## Prettier Config

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100
}
```

---

## Code Conventions

- All TypeScript files use `.tsx` extension
- No barrel files (`index.ts`) - use direct imports
- `exactOptionalPropertyTypes: true` in tsconfig
- Optional properties: `field?: T | undefined`
