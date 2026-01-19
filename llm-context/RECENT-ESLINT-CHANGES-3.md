# Recent Changes (Part 3) - Accessibility & Pre-commit Hooks

## 1. Accessibility Linting (jsx-a11y)

### Install

```bash
pnpm add -D eslint-plugin-jsx-a11y
```

### Add to eslint.config.js

Import:

```javascript
import jsxA11y from 'eslint-plugin-jsx-a11y';
```

Add config section:

```javascript
// Accessibility rules for JSX
{
  files: ['**/*.tsx'],
  ...jsxA11y.flatConfigs.recommended,
},
```

### What it catches

- Missing `alt` text on images
- Invalid ARIA attributes
- Missing form labels
- Non-interactive elements with click handlers
- And many more accessibility issues

Example violations:

```tsx
// ❌ Wrong - missing alt
<img src="photo.jpg" />

// ✅ Correct
<img src="photo.jpg" alt="A sunset over mountains" />

// ❌ Wrong - click on non-interactive element
<div onClick={handleClick}>Click me</div>

// ✅ Correct - use button or add role
<button onClick={handleClick}>Click me</button>
```

---

## 2. Pre-commit Hooks (husky + lint-staged)

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

### What this does

- **Before every commit**, runs:
  - ESLint (with auto-fix) on staged `.ts` and `.tsx` files
  - Prettier on all staged files
- **Prevents** committing code that fails linting
- **Only runs on staged files** - fast even in large repos

### If a commit fails

```bash
$ git commit -m "Add feature"
✖ eslint --fix:
  /path/to/file.tsx
    1:1  error  Something is wrong

husky - pre-commit hook exited with code 1 (error)
```

Fix the errors, `git add` the fixes, then commit again.

---

## Summary

| Addition                 | Purpose                           |
| ------------------------ | --------------------------------- |
| `eslint-plugin-jsx-a11y` | Catch accessibility issues in JSX |
| `husky`                  | Git hooks manager                 |
| `lint-staged`            | Run linters only on staged files  |
