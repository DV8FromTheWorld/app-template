# TypeScript & ESLint Strict Configuration Guide

This guide explains how to set up strict TypeScript, React hooks linting, and path aliasing.

## 1. TypeScript Configuration (`tsconfig.json`)

Ensure these options are enabled:

```json
{
  "compilerOptions": {
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "useUnknownInCatchVariables": true,
    "noImplicitOverride": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

### Key Options Explained

| Option                       | Effect                                                     |
| ---------------------------- | ---------------------------------------------------------- |
| `exactOptionalPropertyTypes` | Requires `bio?: string \| undefined` (explicit undefined)  |
| `noUncheckedIndexedAccess`   | Array access returns `T \| undefined`, forcing null checks |
| `useUnknownInCatchVariables` | `catch (e)` types `e` as `unknown` instead of `any`        |
| `noImplicitOverride`         | Requires `override` keyword when overriding class methods  |
| `noImplicitReturns`          | All code paths must return (or not return)                 |
| `noFallthroughCasesInSwitch` | Prevents accidental switch case fallthrough                |

---

## 2. ESLint Configuration

### Install Dependencies

```bash
pnpm add -D eslint @eslint/js typescript-eslint @eslint-react/eslint-plugin eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-plugin-simple-import-sort @eslint-community/eslint-plugin-eslint-comments eslint-config-prettier
```

### Create `eslint.config.js`

```javascript
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import eslintComments from '@eslint-community/eslint-plugin-eslint-comments';
import eslintConfigPrettier from 'eslint-config-prettier';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    files: ['**/*.tsx', '**/*.ts'],
    ...reactPlugin.configs['recommended-type-checked'],
  },
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
  // Accessibility rules for JSX
  {
    files: ['**/*.tsx'],
    ...jsxA11y.flatConfigs.recommended,
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
  {
    rules: {
      // Require === but allow == null for null/undefined checks
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // KEY RULE: Disallow implicit boolean coercion
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: false, // Disallow: if (str)
          allowNumber: false, // Disallow: if (num)
          allowNullableObject: true, // Allow: if (obj) for objects
          allowNullableBoolean: true, // Allow: if (bool) for booleans
          allowNullableString: false,
          allowNullableNumber: false,
          allowNullableEnum: false,
          allowAny: false,
        },
      ],

      // Prevent {count && <Component />} rendering "0" in JSX
      '@eslint-react/no-leaked-conditional-rendering': 'error',

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

      // Prefer ?? over || for nullish checks (|| treats '' and 0 as falsy)
      '@typescript-eslint/prefer-nullish-coalescing': 'error',

      // Prefer ?. over && chains for optional access
      '@typescript-eslint/prefer-optional-chain': 'error',

      // Disallow non-null assertion (!) - forces proper null handling
      '@typescript-eslint/no-non-null-assertion': 'error',

      // Allow unused vars prefixed with _
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Practical adjustments for common patterns
      '@typescript-eslint/require-await': 'off',
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],
      '@typescript-eslint/no-misused-promises': [
        'error',
        { checksVoidReturn: { attributes: false } },
      ],
    },
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.js', '**/*.cjs', '**/*.mjs'],
  },
  // Prettier - must be last to disable conflicting rules
  eslintConfigPrettier
);
```

### Add to `package.json`

```json
{
  "type": "module",
  "scripts": {
    "lint": "eslint src/"
  }
}
```

---

## 3. Code Patterns Enforced

| ❌ Wrong                      | ✅ Correct                                    |
| ----------------------------- | --------------------------------------------- |
| `if (value) { }`              | `if (value != null) { }`                      |
| `{error && <Error />}`        | `{error !== null ? <Error /> : null}`         |
| `{item.name && <Name />}`     | `{item.name !== undefined ? <Name /> : null}` |
| `str ? a : b` (str is string) | `str !== '' ? a : b`                          |

**Key principle**: Use `!= null` (loose equality) to check both `null` and `undefined` in one check.

---

## 4. Path Alias Configuration (`@/` imports)

### TypeScript (`tsconfig.json`)

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

### Rspack/Webpack (`rspack.config.ts` or `webpack.config.js`)

```typescript
import { resolve } from 'path';

export default {
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
};
```

### React Native / Metro (`babel.config.js`)

```javascript
const path = require('path');

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          alias: {
            '@': path.resolve(__dirname, '../app/src'), // Adjust path as needed
          },
        },
      ],
    ],
  };
};
```

**Required dependency:**

```bash
pnpm add -D babel-plugin-module-resolver
```

### Usage

```typescript
// Instead of:
import { Text } from '../../../design/components/Text/web/Text';

// Use:
import { Text } from '@/design/components/Text/web/Text';
```

---

## 5. React Hooks Rules

The `eslint-plugin-react-hooks` package enforces the Rules of Hooks:

| Rule              | Severity | Purpose                                                                          |
| ----------------- | -------- | -------------------------------------------------------------------------------- |
| `rules-of-hooks`  | error    | Ensures hooks are called in the same order every render (no conditionals, loops) |
| `exhaustive-deps` | error    | Errors when effect dependencies are missing or unnecessary                       |

### Example Violations

```typescript
// ❌ Wrong: Hook inside condition
function Component({ show }) {
  if (show) {
    const [count, setCount] = useState(0); // Error!
  }
}

// ❌ Wrong: Missing dependency
function Component({ id }) {
  useEffect(() => {
    fetchData(id); // Warning: 'id' should be in dependency array
  }, []);
}

// ✅ Correct
function Component({ id }) {
  useEffect(() => {
    fetchData(id);
  }, [id]);
}
```

---

## 6. Type-Only Imports

The `@typescript-eslint/consistent-type-imports` rule enforces using `import type` for type-only imports:

```typescript
// ❌ Wrong
import { User, fetchUser } from './api'; // User is only used as a type

// ✅ Correct
import type { User } from './api';
import { fetchUser } from './api';
```

This improves tree-shaking and makes it clear which imports are types vs values.

---

## 7. Import Sorting

The `eslint-plugin-simple-import-sort` plugin automatically organizes imports into consistent groups:

```typescript
// Before (unsorted)
import { useState } from 'react';
import styles from './Button.module.css';
import { Button } from '@/components/Button';
import type { User } from './types';

// After (sorted)
import { useState } from 'react';

import type { User } from './types';

import { Button } from '@/components/Button';

import styles from './Button.module.css';
```

Imports are grouped by:

1. Side-effect imports (`import './styles.css'`)
2. Node.js built-ins and external packages
3. Internal aliases (`@/`)
4. Relative imports
5. Style imports

Run `eslint --fix` to auto-sort imports.

---

## 8. Prettier Integration

The `eslint-config-prettier` package disables ESLint rules that conflict with Prettier formatting:

- **Must be last** in the ESLint config array
- Prevents ESLint from complaining about formatting Prettier handles
- Allows ESLint to focus on code quality, Prettier on formatting

If using Prettier, always include this to avoid conflicting rules.

---

## 9. ESLint Disable Comments

The `@eslint-community/eslint-plugin-eslint-comments` package enforces good practices for `eslint-disable` comments:

| Rule                   | Purpose                                            |
| ---------------------- | -------------------------------------------------- |
| `require-description`  | Every `eslint-disable` must include an explanation |
| `no-unlimited-disable` | Must specify which rule(s) to disable              |
| `no-unused-disable`    | Error if disable comment isn't needed              |

### Example

```typescript
// ❌ Wrong - no explanation
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const data: any = response;

// ❌ Wrong - disables all rules
// eslint-disable-next-line
const data: any = response;

// ✅ Correct - specific rule with explanation
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- API returns untyped JSON
const data: any = response;
```

This ensures every rule suppression is documented and intentional.

---

## 10. Accessibility (jsx-a11y)

The `eslint-plugin-jsx-a11y` plugin catches accessibility issues in JSX:

```tsx
// ❌ Wrong - missing alt
<img src="photo.jpg" />

// ✅ Correct
<img src="photo.jpg" alt="A sunset over mountains" />

// ❌ Wrong - click on non-interactive element
<div onClick={handleClick}>Click me</div>

// ✅ Correct - use button
<button onClick={handleClick}>Click me</button>
```

---

## 11. Nullish Coalescing & Optional Chaining

### prefer-nullish-coalescing

```typescript
// ❌ Wrong - || treats '' and 0 as falsy
const name = user.name || 'Anonymous';

// ✅ Correct - ?? only triggers on null/undefined
const name = user.name ?? 'Anonymous';
```

### prefer-optional-chain

```typescript
// ❌ Wrong - verbose && chains
const street = user && user.address && user.address.street;

// ✅ Correct - cleaner optional chain
const street = user?.address?.street;
```

### no-non-null-assertion

```typescript
// ❌ Wrong - ! bypasses null checking
const user = getUser(); // returns User | null
console.log(user!.name); // Runtime error if null!

// ✅ Correct - explicit null handling
const user = getUser();
if (user == null) {
  throw new Error('User not found');
}
console.log(user.name);
```

When `!` is truly needed, use eslint-disable with explanation:

```typescript
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- element guaranteed in index.html
document.getElementById('root')!;
```

---

## 12. Pre-commit Hooks (husky + lint-staged)

### Install

```bash
pnpm add -D husky lint-staged
pnpm exec husky init
```

### Configure lint-staged in package.json

```json
{
  "lint-staged": {
    "*.{ts,tsx}": ["eslint --fix", "prettier --write"],
    "*.{js,cjs,mjs,json,md,css}": ["prettier --write"]
  }
}
```

### Update .husky/pre-commit

```bash
pnpm exec lint-staged
```

This runs ESLint and Prettier on staged files before every commit, preventing bad code from being committed.

---

## Quick Setup Checklist

1. [ ] Add `"type": "module"` to root `package.json`
2. [ ] Install ESLint dependencies:
   - `@eslint/js`, `typescript-eslint`
   - `@eslint-react/eslint-plugin`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`
   - `eslint-plugin-simple-import-sort`, `@eslint-community/eslint-plugin-eslint-comments`
   - `eslint-config-prettier`
3. [ ] Create `eslint.config.js` with all rules (see config above)
4. [ ] Add strict tsconfig options (`useUnknownInCatchVariables`, `noImplicitOverride`, etc.)
5. [ ] Add `lint` script to package.json
6. [ ] Configure `paths` in tsconfig.json for `@/` alias
7. [ ] Configure bundler (Rspack/Webpack) with `resolve.alias`
8. [ ] Configure Babel with `module-resolver` plugin (for React Native)
9. [ ] Install and configure husky + lint-staged for pre-commit hooks
10. [ ] Run `pnpm lint --fix` to auto-sort imports
11. [ ] Run `pnpm lint` and `pnpm typecheck` and fix any violations
