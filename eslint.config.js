import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from '@eslint-react/eslint-plugin';

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
    },
  },
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/*.js', '**/*.cjs', '**/*.mjs'],
  }
);
