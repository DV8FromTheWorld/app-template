# Recent ESLint Changes (Part 2)

Additional ESLint rules added after initial setup.

## New Rules Added

Add these rules to your existing ESLint config's `rules` section:

```javascript
// Prefer ?? over || for nullish checks (|| treats '' and 0 as falsy)
'@typescript-eslint/prefer-nullish-coalescing': 'error',

// Prefer ?. over && chains for optional access
'@typescript-eslint/prefer-optional-chain': 'error',

// Disallow non-null assertion (!) - forces proper null handling
'@typescript-eslint/no-non-null-assertion': 'error',
```

## What These Rules Do

### prefer-nullish-coalescing

```typescript
// ❌ Wrong - || treats '' and 0 as falsy
const name = user.name || 'Anonymous';
const count = data.count || 0; // Bug: if count is 0, returns 0 anyway!

// ✅ Correct - ?? only triggers on null/undefined
const name = user.name ?? 'Anonymous';
const count = data.count ?? 0;
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

// ✅ Also correct - optional chain with fallback
console.log(user?.name ?? 'Unknown');
```

When `!` is truly needed (rare), use eslint-disable with explanation:
```typescript
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion -- element guaranteed in index.html
document.getElementById('root')!
```

## Summary

| Rule | Purpose |
|------|---------|
| `prefer-nullish-coalescing` | Use `??` instead of `||` for defaults |
| `prefer-optional-chain` | Use `?.` instead of `&&` chains |
| `no-non-null-assertion` | Ban `!` operator, force proper null handling |
