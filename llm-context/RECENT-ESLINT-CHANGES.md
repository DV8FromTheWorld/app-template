# Recent ESLint & TypeScript Additions

Summary of changes to import into another project.

## 1. Install New Dependencies

```bash
pnpm add -D eslint-plugin-react-hooks eslint-plugin-simple-import-sort eslint-config-prettier @eslint-community/eslint-plugin-eslint-comments
```

## 2. Update `eslint.config.js`

### Add imports at top:

```javascript
import reactHooks from 'eslint-plugin-react-hooks';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';
import eslintConfigPrettier from 'eslint-config-prettier';
```

### Add these config sections:

```javascript
// React Hooks rules (official React linter)
{
  files: ['**/*.tsx', '**/*.ts'],
  plugins: {
    'react-hooks': reactHooks,
  },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
  },
},
// Import sorting
{
  plugins: {
    'simple-import-sort': simpleImportSort,
  },
  rules: {
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
},
// ESLint directive comments (require explanations for eslint-disable)
{
  plugins: {
    '@eslint-community/eslint-comments': eslintComments,
  },
  rules: {
    '@eslint-community/eslint-comments/require-description': [
      'error',
      { ignore: ['eslint-enable'] },
    ],
    '@eslint-community/eslint-comments/no-unlimited-disable': 'error',
    '@eslint-community/eslint-comments/no-unused-disable': 'error',
  },
},
```

### Add these rules to existing rules section:

```javascript
// Enforce using `import type` for type-only imports
'@typescript-eslint/consistent-type-imports': [
  'error',
  {
    prefer: 'type-imports',
    fixStyle: 'separate-type-imports',
  },
],

// Ensure all cases in switch statements on union types are handled
'@typescript-eslint/switch-exhaustiveness-check': 'error',
```

### Add Prettier config at the very end (must be last):

```javascript
// Prettier - must be last to disable conflicting rules
eslintConfigPrettier
```

## 3. Update `tsconfig.json`

Add these compiler options:

```json
{
  "compilerOptions": {
    "useUnknownInCatchVariables": true,
    "noImplicitOverride": true
  }
}
```

## 4. Fix Violations

```bash
# Auto-sort imports
eslint src/ --fix

# Check for remaining issues
pnpm lint
pnpm typecheck
```

## What These Add

| Addition | Purpose |
|----------|---------|
| `react-hooks/rules-of-hooks` | No hooks in conditionals/loops |
| `react-hooks/exhaustive-deps` | Error on missing effect dependencies |
| `consistent-type-imports` | Enforce `import type {}` for types |
| `switch-exhaustiveness-check` | Ensure all union cases handled in switches |
| `simple-import-sort` | Auto-sort imports into consistent groups |
| `eslint-config-prettier` | Disable rules that conflict with Prettier |
| `require-description` | Require explanation on `eslint-disable` comments |
| `no-unlimited-disable` | Disallow `eslint-disable` without specific rule names |
| `no-unused-disable` | Error on `eslint-disable` that aren't needed |
| `useUnknownInCatchVariables` | `catch(e)` types `e` as `unknown` not `any` |
| `noImplicitOverride` | Require `override` keyword on class method overrides |
