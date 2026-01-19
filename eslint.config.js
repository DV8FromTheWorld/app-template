import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from '@eslint-react/eslint-plugin';
import reactHooks from 'eslint-plugin-react-hooks';
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
      // Require strict equality, but allow == null to catch both null and undefined
      eqeqeq: ['error', 'always', { null: 'ignore' }],

      // Disallow non-boolean types in conditions (if, &&, ||, ternary condition)
      // This is the key rule for enforcing explicit null checks
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowString: false,
          allowNumber: false,
          allowNullableObject: true,
          allowNullableBoolean: true, // Allow boolean | undefined
          allowNullableString: false,
          allowNullableNumber: false,
          allowNullableEnum: false,
          allowAny: false,
        },
      ],

      // Prevent rendering unexpected values via && in JSX
      // e.g. {count && <Component />} renders "0" when count is 0
      '@eslint-react/no-leaked-conditional-rendering': 'error',

      // Allow unused vars prefixed with _
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],

      // Allow async functions without await (common in route handlers)
      '@typescript-eslint/require-await': 'off',

      // Allow void operator for promise ignoring (useful for event handlers)
      '@typescript-eslint/no-floating-promises': ['error', { ignoreVoid: true }],

      // Allow promises in event handlers (common React pattern)
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false, // Allow async onClick handlers
          },
        },
      ],

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
    },
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.js', '**/*.cjs', '**/*.mjs'],
  },
  // Prettier - must be last to disable conflicting rules
  eslintConfigPrettier
);
