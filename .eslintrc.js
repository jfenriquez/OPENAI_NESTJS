module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended', // Asegura que Prettier y ESLint no entren en conflicto
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // Aquí puedes personalizar o desactivar reglas según tus necesidades.
    'prettier/prettier': ['error', { endOfLine: 'lf', singleQuote: true, trailingComma: 'all' }],
    'linebreak-style': ['error', 'unix'],
    // Otras reglas específicas pueden ser agregadas o modificadas
  },
};
