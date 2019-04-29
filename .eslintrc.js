module.exports = {
  extends: ['eslint:recommended', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'react'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    useJSXTextNode: true,
    sourceType: 'module',
    project: './tsconfig.json'
  },
  env: {
    browser: true
  },
  rules: {
    'no-console': 'warn',
    'prefer-const': 'error',
    'react/jsx-uses-vars': 'error',
    'react/jsx-uses-react': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }]
  }
}
